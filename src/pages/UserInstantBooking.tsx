import { getCategories } from '@/store/categorySlice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { localService } from '@/shared/_session/local';
import { ArrowLeft, Star } from 'lucide-react';
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { acceptInstateJobBooking, cancelInstantBooking, getInstantBookingData, postInstantBooking } from '@/store/instantBookingSlice';
import { openRazorpayJob } from '@/components/Razorpay/RazorpayJob';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"




const UserInstantBooking = () => {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const categoryVar = useSelector((state: RootState) => state.category);
    const [showBooking, setBooking] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [open, setOpen] = useState(false);
    const authVar = useSelector((state: RootState) => state.auth)
    const instantBookingVar: any = useSelector((state: RootState) => state.instant)
    const dispatch = useDispatch<AppDispatch>()

    const [formData, setFormData] = useState<any>({
        title: "",
        categoryId: "",
        budget: "",
        address: "",
        description: "instant booking",
        lat: null,
        lng: null,
    });

    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
    useEffect(() => {
        if (window.google) {
            autocompleteService.current =
                new window.google.maps.places.AutocompleteService();
        }
        dispatch(getCategories());
        dispatch(getInstantBookingData());
    }, [dispatch]);

    const fetchAddressSuggestions = (input: string) => {
        if (!input.trim() || !autocompleteService.current) {
            setSuggestions([]);
            return;
        }

        autocompleteService.current.getPlacePredictions(
            { input, componentRestrictions: { country: "in" } },
            (predictions, status) => {
                if (
                    status === window.google.maps.places.PlacesServiceStatus.OK &&
                    predictions
                ) {
                    setSuggestions(predictions);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                }
            }
        );
    };


    const handleSuggestionSelect = (description: string) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: description }, (results, status) => {
            if (status === "OK" && results && results[0].geometry.location) {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();
                setFormData({ ...formData, address: description, lat, lng });
                setSuggestions([]);
                setShowSuggestions(false);
            }
        });
    };

    const fetchCurrentLocation = async () => {
        try {
            let latitude, longitude;

            if (Capacitor.getPlatform() === "web") {
                await new Promise<void>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition((pos) => {
                        latitude = pos.coords.latitude;
                        longitude = pos.coords.longitude;
                        resolve();
                    }, reject);
                });
            } else {
                const permission = await Geolocation.requestPermissions();
                if (permission.location === "denied") {
                    alert("Location permission denied");
                    return;
                }

                const pos = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: false,
                    timeout: 8000,
                    maximumAge: 60000,
                });
                latitude = pos.coords.latitude;
                longitude = pos.coords.longitude;
            }

            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
                { location: { lat: latitude, lng: longitude } },
                (results, status) => {
                    if (status === "OK" && results?.[0]) {
                        setFormData({
                            ...formData,
                            address: results[0].formatted_address,
                            lat: latitude,
                            lng: longitude,
                        });
                    }
                }
            );
        } catch (err) {
            console.error(err);
            alert("Unable to retrieve your location");
        }
    };

    const handleSubmit = () => {
        dispatch(postInstantBooking(formData)).then((res) => {
            setFormData({
                title: "",
                categoryId: "",
                budget: "",
                address: "",
                description: "instant booking",
                lat: null,
                lng: null,
            })
        })
    }

    const cancelBooking = (id) => {
        dispatch(cancelInstantBooking('deleted', id)).then((res) => {
            setFormData({
                title: "",
                categoryId: "",
                budget: "",
                address: "",
                description: "instant booking",
                lat: null,
                lng: null,
            })
        })
    }

    const acceptBooking = (freelancerId) => {
        dispatch(acceptInstateJobBooking({
            jobId: instantBookingVar?.instantBookingJobData?._id,
            freelancerId: freelancerId
        }))
    }

    useEffect(() => {
        if (instantBookingVar?.instantShortListData?.razorpayKey && instantBookingVar?.instantShortListData?.order) {
            openRazorpayJob(instantBookingVar?.instantShortListData, authVar, instantBookingVar?.instantBookingJobData?._id, dispatch)
        }
    }, [instantBookingVar?.instantShortListData])


    return (
        <div className={`min-h-screen bg-background pb-4 flex flex-col  h-screen ${localService.get('role') === 'user' ? 'justify-between' : ''}`}>
            {/* <Header onLogin={handleLogin} /> */}
            <div className="sticky top-0 z-50 bg-background border-b">
                <div className="flex items-center justify-between p-4">
                    <Link to={`${localService?.get('role') === 'freelancer' ? "/freelancer-dashboard" : "/employer-dashboard"}`} className="flex items-center gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">Instant Booking</span>
                    </Link>
                    {localService.get('role') === 'freelancer' && <Switch id="airplane-mode" />}
                </div>
            </div>
            {instantBookingVar?.instantBookingJobData?.result === null && <div className="grid lg:grid-cols-2 gap-8 px-4 mt-2">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Job Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Job Details</Label>
                        <Textarea
                            id="title"
                            placeholder="e.g, Need Yoga Yaar for a couple"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            onInput={(e) => {
                                e.currentTarget.value = e.currentTarget.value.replace(
                                    /[0-9]/g,
                                    ""
                                );
                            }}
                        />
                    </div>

                    {/* Service Category */}
                    <div className="space-y-2">
                        <Label htmlFor="category">Service Category</Label>
                        <Select
                            value={formData.categoryId}
                            onValueChange={(value) =>
                                setFormData({ ...formData, categoryId: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a service category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categoryVar?.categoryData?.map((category) => (
                                    <SelectItem key={category._id} value={category._id}>
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Budget & Location */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget</Label>
                            <Input
                                id="budget"
                                placeholder="e.g., ₹5,000"
                                type="number"
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.replace(
                                        /[^0-9]/g,
                                        ""
                                    );
                                }}
                                value={formData.budget}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        budget: e.target.value.replace(/[^0-9.]/g, ""),
                                    })
                                }
                            />
                        </div>

                        <div className="space-y-1 flex flex-col relative">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                placeholder="Type your location..."
                                value={formData.address}
                                onChange={(e) => {
                                    setFormData({ ...formData, address: e.target.value });
                                    fetchAddressSuggestions(e.target.value);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() =>
                                    setTimeout(() => setShowSuggestions(false), 150)
                                }
                            />
                            {showSuggestions && suggestions.length > 0 && (
                                <ul className="absolute top-16 z-50 w-full bg-white border rounded-md shadow-md mt-1 max-h-80 overflow-y-auto">
                                    {suggestions.map((item) => (
                                        <li
                                            key={item.place_id}
                                            className="p-2 cursor-pointer hover:bg-gray-100 text-sm"
                                            onClick={() => handleSuggestionSelect(item.description)}
                                        >
                                            {item.description}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <button
                                type="button"
                                onClick={fetchCurrentLocation}
                                className="self-end text-xs text-primary font-medium"
                            >
                                Use Current Location
                            </button>
                        </div>
                    </div>
                </div>
                <Button onClick={handleSubmit}>Instant Booking</Button>
            </div>}

            {instantBookingVar?.instantBookingJobData?.result !== null && <div className="px-4 space-y-3">
                <div className="space-y-1 overflow-auto">
                    {instantBookingVar?.instantBookingJobData?.applications?.map((user) => (
                        <div className="border shadow rounded-lg p-4 space-y-2 w-full" key={user?._id}>
                            <div className="price font-medium text-lg flex items-center justify-between">₹{user?.bidAmount} <span className="text-sm font-normal text-zinc-500">
                                {user?.createdAt
                                    ? new Date(user.createdAt).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </span>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* <div className="border border-black  rounded-full w-8 h-8 flex items-center justify-center"><User2Icon /></div> */}
                                <div className="title flex items-start gap-1 justify-between w-full">
                                    <div>
                                        <p className="font-medium flex items-center gap-2 truncate capitalize">{user?.freelancerId?.firstName} {user?.freelancerId?.lastName}<span className="flex items-center gap-1 font-normal text-sm"><Star className="text-[#ffda03] w-4 font-normal" fill="#ffda03" />{user?.freelancerId?.averageRating}</span></p>
                                    </div>
                                    {user?.status === 'applied' ? <Button className="h-8" onClick={() => acceptBooking(user?.freelancerId?._id)}>Accept</Button>
                                        : <Button className="h-8" variant='outline'>Hired</Button>}
                                </div>
                            </div>
                            {user?.status === 'shortlisted' && <div className='rounded-lg p-2 flex items-center justify-between bg-blue-50'>
                                <p className='text-blue-600 text-sm'>Share with freeloancer to start</p>
                                <p className='text-blue-600 text-sm'>{user?.startOtp}</p>
                            </div>}
                            {user?.status === 'inProgress' && <div className='rounded-lg p-2 flex items-center justify-between bg-green-50'>
                                <p className='text-green-600  text-sm'>Share with freeloancer to complete</p>
                                <p className='text-green-600 text-sm'>{user?.completionOtp}</p>
                            </div>}
                        </div>
                    ))}
                </div>
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className=" truncate text-xl">{instantBookingVar?.instantBookingJobData?.title}</CardTitle>
                        <CardDescription>
                            <div className='space-y-0.5'>
                                <span className="text-sm text-neutral-400">{instantBookingVar?.instantBookingJobData?.categoryId?.name}</span>
                                <p className="">{instantBookingVar?.instantBookingJobData?.address}</p>
                            </div>
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex items-center gap-6">
                        <Label className="flex-1 text-md">
                            ₹{instantBookingVar?.instantBookingJobData?.budget}
                        </Label>

                        {instantBookingVar?.instantBookingJobData?.status !== "inProgress" && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" className="flex-1" variant="outline">
                                        Cancel
                                    </Button>
                                </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to cancel this booking? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>No</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                cancelBooking(instantBookingVar?.instantBookingJobData?._id)
                                            }
                                        >
                                            Yes, Cancel
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </CardFooter>

                </Card>
            </div>}

        </div>
    )
}

export default UserInstantBooking
