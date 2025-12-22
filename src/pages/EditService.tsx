// import { Header } from "@/components/layout/Header";
// import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
// import { useUserRole } from "@/contexts/UserRoleContext";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Camera, MapPin, Star, Plus, Upload, ArrowLeft, X } from "lucide-react";
// import { serviceCategories } from "@/data/staticData";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { useEffect, useState } from "react";
// import { getCategories } from "@/store/categorySlice";
// import { useNavigate, useParams } from "react-router-dom";
// import { getServiceById, updateService } from "@/store/ServiceSlice";
// import { DropzoneMulti } from "@/components/dropzone/DropZoneMulti";
// import ScheduleManagement from "@/components/service/ScheduleManagement";

// const EditService = () => {
//     const dispatch = useDispatch<AppDispatch>();
//     const navigate = useNavigate();
//     const { id } = useParams();
//     const categoryVar = useSelector((state: RootState) => state?.category);
//     const serviceVar = useSelector((state: RootState) => state?.service);
//     const [formData, setFormData] = useState({
//         title: '',
//         description: "",
//         price: "",
//         categoryId: "",
//         skills: [],
//         experience: "",
//         equipments: "",
//         requirements: "",
//         images: [],
//         existingImages: [],
//         deletedImages: [],
//         schedules: []
//     })

//     const isFormIncomplete = Object.entries(formData).some(([key, value]) => {
//         const optionalFields = ["existingImages", "deletedImages", "location", "availability", "duration"];
//         if (optionalFields.includes(key)) return false;

//         return (
//             value === "" ||
//             value === null ||
//             (Array.isArray(value) && value.length === 0)
//         );
//     });

//     useEffect(() => {
//         dispatch(getCategories())
//         dispatch(getServiceById(id))
//     }, [])

//     useEffect(() => {
//         if (serviceVar.serviceDetails) {
//             setFormData({
//                 title: serviceVar.serviceDetails.title,
//                 description: serviceVar.serviceDetails.description,
//                 price: serviceVar.serviceDetails.price,
//                 categoryId: serviceVar.serviceDetails.categoryId,
//                 skills: serviceVar.serviceDetails.skills,
//                 experience: serviceVar.serviceDetails.experience,
//                 equipments: serviceVar.serviceDetails.equipments,
//                 requirements: serviceVar.serviceDetails.requirements,
//                 existingImages: serviceVar.serviceDetails.images,
//                 images: [],
//                 deletedImages: [],
//                 schedules: serviceVar?.serviceDetails?.schedules
//             })
//         }
//     }, [serviceVar.serviceDetails])

//     const updateServiceService = () => {
//         dispatch(updateService(formData, id, formData.images, navigate));
//     }

//     const [inputValue, setInputValue] = useState("")

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === "Enter" && inputValue.trim() !== "") {
//             e.preventDefault()
//             if (!formData.skills.includes(inputValue.trim())) {
//                 setFormData((prev) => ({
//                     ...prev,
//                     skills: [...prev.skills, inputValue.trim()],
//                 }))
//             }
//             setInputValue("")
//         }
//     }

//     const handleAddSkill = () => {
//         if (inputValue.trim() !== "") {
//             if (!formData.skills.includes(inputValue.trim())) {
//                 setFormData((prev) => ({
//                     ...prev,
//                     skills: [...prev.skills, inputValue.trim()],
//                 }))
//             }
//             setInputValue("")
//         }
//     }

//     const removeSkill = (skill: string) => {
//         setFormData((prev) => ({
//             ...prev,
//             skills: prev.skills.filter((s) => s !== skill),
//         }))
//     }

//     const handleRemoveImage = (image: string) => {
//         setFormData((prev) => ({
//             ...prev,
//             existingImages: prev.existingImages.filter((img) => img !== image),
//             deletedImages: [...prev.deletedImages, image],
//         }));
//     };


//     return (
//         <div className="min-h-screen bg-background">

//             <div className="container mx-auto px-6 py-8">
//                 <div className="max-w-2xl mx-auto mb-10">
//                     <Card className="border-none shadow-none">
//                         <CardContent className="space-y-6 px-0">
//                             {/* Service Photos */}
//                             <div className="space-y-4 mt-2">
//                                 <Label>Service Photos</Label>
//                                 <DropzoneMulti
//                                     images={formData.images}
//                                     setImages={(imgs) =>
//                                         setFormData((prev) => ({ ...prev, images: imgs }))
//                                     }
//                                 />
//                                 <p className="text-xs text-muted-foreground">
//                                     Add up to 5 photos showcasing your work. First photo will be your main image.
//                                 </p>
//                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                                     {formData.existingImages.map((image, index) => (
//                                         <div key={index} className="aspect-square rounded-lg flex items-center justify-center hover:border-primary cursor-pointer relative">
//                                             <img src={image} alt={`Service Image ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
//                                             <div className="cross bg-red-500 text-white rounded-full absolute top-1 right-1" onClick={() => handleRemoveImage(image)}><X className="w-5 h-5" /></div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             {/* Service Details */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="title">Service Title *</Label>
//                                 <Input
//                                     id="title"
//                                     placeholder="e.g., Professional Chef for Events & Parties"
//                                     onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
//                                     value={formData?.title}
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="category">Service Category *</Label>
//                                 <Select value={formData?.categoryId?._id} onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}>
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select your service category" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {categoryVar?.categoryData && categoryVar?.categoryData.map((category) => (
//                                             <SelectItem key={category._id} value={category._id}>
//                                                 {category.name}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="description">Service Description *</Label>
//                                 <Textarea
//                                     id="description"
//                                     placeholder="Describe your service, experience, specialties, and what makes you unique..."
//                                     className="min-h-[120px]"
//                                     onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                                     value={formData?.description}
//                                 />
//                             </div>

//                             {/* Pricing */}
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="price">Price *</Label>
//                                     <div className="relative flex items-center">
//                                         <span className="absolute left-3 text-muted-foreground">₹</span>
//                                         <Input id="price" placeholder="500" className="pl-8" value={formData?.price} onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} />
//                                     </div>
//                                 </div>
//                             </div>


//                             <ScheduleManagement setFormData={setFormData} initialSchedules={formData.schedules} />


//                             {/* Skills & Specialties */}
//                             <div className="space-y-2">
//                                 <Label>Skills & Specialties</Label>
//                                 <div className="flex flex-wrap gap-2 mb-3">
//                                     {formData.skills.map((skill, index) => (
//                                         <Badge
//                                             key={index}
//                                             variant="secondary"
//                                             className="flex items-center gap-1 px-2 py-1"
//                                         >
//                                             {skill}
//                                             <X
//                                                 className="w-3 h-3 cursor-pointer"
//                                                 onClick={() => removeSkill(skill)}
//                                             />
//                                         </Badge>
//                                     ))}
//                                 </div>
//                                 <div className="tab flex items-center gap-2">
//                                     <Input
//                                         placeholder="Add a skill or specialty"
//                                         value={inputValue}
//                                         onChange={(e) => setInputValue(e.target.value)}
//                                         onKeyDown={handleKeyDown}
//                                     />
//                                     <Button variant="secondary" onClick={handleAddSkill}>Add</Button>
//                                 </div>
//                             </div>

//                             {/* Experience */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="experience">Years of Experience</Label>
//                                 <Select value={String(formData?.experience)} onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}>
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select experience level" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="0">Less than 1 year</SelectItem>
//                                         <SelectItem value="1">1+ years</SelectItem>
//                                         <SelectItem value="3">3+ years</SelectItem>
//                                         <SelectItem value="5">5+ years</SelectItem>
//                                         <SelectItem value="10">10+ years</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>

//                             {/* Additional Info */}
//                             <div className="space-y-2">
//                                 <Label htmlFor="equipment">Equipment/Tools Provided</Label>
//                                 <Textarea
//                                     id="equipment"
//                                     placeholder="List any equipment, tools, or materials you provide..."
//                                     className="min-h-[80px]"
//                                     onChange={(e) => setFormData((prev) => ({ ...prev, equipments: e.target.value }))}
//                                     value={formData?.equipments}
//                                 />
//                             </div>

//                             <div className="space-y-2">
//                                 <Label htmlFor="requirements">Special Requirements</Label>
//                                 <Textarea
//                                     id="requirements"
//                                     placeholder="Any special requirements from clients (kitchen access, parking, etc.)..."
//                                     className="min-h-[80px]"
//                                     onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
//                                     value={formData?.requirements}
//                                 />
//                             </div>

//                             {/* Action Buttons */}
//                             <div className="flex gap-4 pt-6">
//                                 <Button className="flex-1" onClick={updateServiceService} disabled={isFormIncomplete}>
//                                     Update Service
//                                 </Button>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>

//             <MobileBottomNav />
//         </div>
//     );
// };

// export default EditService;


import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState, useMemo, useRef } from "react";
import { getCategories } from "@/store/categorySlice";
import { useNavigate, useParams } from "react-router-dom";
import { getServiceById, updateService } from "@/store/ServiceSlice";
import { DropzoneMulti } from "@/components/dropzone/DropZoneMulti";
import ScheduleManagement from "@/components/service/ScheduleManagement";
import imageCompression from "browser-image-compression";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";

const EditService = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { id } = useParams();
    const categoryVar = useSelector((state: RootState) => state?.category);
    const serviceVar = useSelector((state: RootState) => state?.service);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);


    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        categoryId: "",
        skills: [],
        experience: "",
        equipments: "",
        requirements: "",
        images: [],
        existingImages: [],
        deletedImages: [],
        schedules: [],
        location: '',
        lat: null,
        lon: null
    });



    const isFormIncomplete = useMemo(() => {
        const requiredFields = [
            "title",
            "description",
            "price",
            "categoryId",
            "skills",
            "experience",
            "equipments",
            "requirements",
        ];

        // Check if any required field is blank or empty
        const hasEmptyField = requiredFields.some((key) => {
            const value = formData[key as keyof typeof formData];
            return (
                value === "" ||
                value === null ||
                (Array.isArray(value) && value.length === 0)
            );
        });

        // Check image condition → disable if no images at all
        const noImages =
            (formData.existingImages?.length === 0 || !formData.existingImages) &&
            (formData.images?.length === 0 || !formData.images);

        // Check if no schedule added
        const noSchedules = formData.schedules?.length === 0;

        return hasEmptyField || noImages || noSchedules;
    }, [formData]);


    // ✅ Fetch categories & service data
    useEffect(() => {
        dispatch(getCategories());
        dispatch(getServiceById(id));
    }, [dispatch, id]);

    // ✅ Load service details into form
    useEffect(() => {
        if (serviceVar.serviceDetails) {
            const s = serviceVar.serviceDetails;
            setFormData({
                title: s.title || "",
                description: s.description || "",
                price: s.price || "",
                categoryId: s.categoryId || "", // ✅ ensure string, not object
                skills: s.skills || [],
                experience: s.experience || "",
                equipments: s.equipments || "",
                requirements: s.requirements || "",
                existingImages: s.images || [],
                images: [],
                deletedImages: [],
                schedules: s.schedules || [],
                location: s.location || "",
                lat: s.lat || null,
                lon: s.lon || null
            });
        }
    }, [serviceVar.serviceDetails]);

    const updateServiceService = () => {
        dispatch(updateService(formData, id, formData.images, navigate));
    };

    // ✅ Skill input handling
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            e.preventDefault();
            if (!formData.skills.includes(inputValue.trim())) {
                setFormData((prev) => ({
                    ...prev,
                    skills: [...prev.skills, inputValue.trim()],
                }));
            }
            setInputValue("");
        }
    };

    const handleAddSkill = () => {
        if (inputValue.trim() !== "" && !formData.skills.includes(inputValue.trim())) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, inputValue.trim()],
            }));
            setInputValue("");
        }
    };

    const removeSkill = (skill: string) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    };

    const handleRemoveImage = (image: string) => {
        setFormData((prev) => ({
            ...prev,
            existingImages: prev.existingImages.filter((img) => img !== image),
            deletedImages: [...prev.deletedImages, image],
        }));
    };

    const compressImages = async (files) => {
        const options = {
            maxSizeMB: 0.8,           // target ≤ 1MB
            maxWidthOrHeight: 768, // resize if larger than 1200px
            useWebWorker: true,
        };

        const compressedFiles = await Promise.all(
            files.map(async (file) => {
                const compressedBlob = await imageCompression(file, options);
                return new File([compressedBlob], file.name, { type: file.type });
            })
        );

        return compressedFiles;
    };

    const handleSetImages = async (files) => {
        const compressedFiles = await compressImages(files);
        setFormData((prev) => ({
            ...prev,
            images: compressedFiles,
        }));
    };
  useEffect(() => {
    // Wait until Google Maps script is ready
    const initAutocomplete = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current =
          new window.google.maps.places.AutocompleteService();
      } else {
        setTimeout(initAutocomplete, 500);
      }
    };

    initAutocomplete();
  }, []);
    const fetchAddressSuggestions = (input: string) => {
        if (!input.trim() || !autocompleteService.current) {
            setSuggestions([]);
            return;
        }

        autocompleteService.current.getPlacePredictions(
            { input, componentRestrictions: { country: "in" } },
            (predictions, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                    setSuggestions(predictions);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                }
            }
        );
    };

    // When a suggestion is selected, get lat/lng using Geocoder
    const handleSuggestionSelect = (description: string) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: description }, (results, status) => {
            if (status === "OK" && results && results[0].geometry.location) {
                const lat = results[0].geometry.location.lat();
                const lon = results[0].geometry.location.lng();
                setFormData({ ...formData, location: description, lat, lon });
                setSuggestions([]);
                setShowSuggestions(false);
            }
        });
    };

    // Use current device location
    const fetchCurrentLocation = async () => {
        try {
            let latitude, longitude;

            if (Capacitor.getPlatform() === 'web') {
                await new Promise<void>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            latitude = pos.coords.latitude;
                            longitude = pos.coords.longitude;
                            resolve();
                        },
                        reject
                    );
                });
            } else {
                const permission = await Geolocation.requestPermissions();
                if (permission.location === 'denied') {
                    alert('Location permission denied');
                    return;
                }

                const pos = await Geolocation.getCurrentPosition({
                    enableHighAccuracy: false,
                    timeout: 8000,
                    maximumAge: 60000
                });
                latitude = pos.coords.latitude;
                longitude = pos.coords.longitude;
            }

            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                if (status === 'OK' && results?.[0]) {
                    setFormData({
                        ...formData,
                        location: results[0].formatted_address,
                        lat: latitude,
                        lon: longitude
                    });
                }
            });
        } catch (err) {
            console.error(err);
            alert('Unable to retrieve your location');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-2xl mx-auto mb-10">
                    <Card className="border-none shadow-none">
                        <CardContent className="space-y-6 px-0">
                            {/* Service Photos */}
                            <div className="space-y-4 mt-2">
                                <Label>Service Photos</Label>
                                <DropzoneMulti
                                    images={formData.images}
                                    setImages={handleSetImages}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Add up to 5 photos showcasing your work. First photo will be your main image.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.existingImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square rounded-lg flex items-center justify-center hover:border-primary cursor-pointer relative"
                                        >
                                            <img
                                                src={image}
                                                alt={`Service Image ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <div
                                                className="cross bg-red-500 text-white rounded-full absolute top-1 right-1 cursor-pointer"
                                                onClick={() => handleRemoveImage(image)}
                                            >
                                                <X className="w-5 h-5" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Service Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Service Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Professional Chef for Events & Parties"
                                    onInput={(e) => {
                                        e.currentTarget.value = e.currentTarget.value.replace(/[0-9]/g, '');
                                    }}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    value={formData.title}
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <Label htmlFor="category">Service Category *</Label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, categoryId: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your service category" />
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

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Service Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your service, experience, specialties, and what makes you unique..."
                                    className="min-h-[120px]"
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    value={formData.description}
                                />
                            </div>

                            {/* Price */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price *</Label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 text-muted-foreground">₹</span>
                                        <Input
                                            id="price"
                                            placeholder="500"
                                            className="pl-8"
                                            onInput={(e) => {
                                                e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                                            }}
                                            value={formData.price}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    price: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className="space-y-1 flex flex-col relative">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    placeholder="Type your location..."
                                    value={formData.location}
                                    onChange={(e) => {
                                        setFormData({ ...formData, location: e.target.value });
                                        fetchAddressSuggestions(e.target.value);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
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




                            {/* Schedule */}
                            <ScheduleManagement
                                setFormData={setFormData}
                                initialSchedules={formData.schedules}
                            />

                            {/* Skills */}
                            <div className="space-y-2">
                                <Label>Skills & Specialties</Label>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.skills.map((skill, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="flex items-center gap-1 px-2 py-1"
                                        >
                                            {skill}
                                            <X
                                                className="w-3 h-3 cursor-pointer"
                                                onClick={() => removeSkill(skill)}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                                <div className="tab flex items-center gap-2">
                                    <Input
                                        placeholder="Add a skill or specialty"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Button variant="secondary" onClick={handleAddSkill}>
                                        Add
                                    </Button>
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="space-y-2">
                                <Label htmlFor="experience">Years of Experience</Label>
                                <Select
                                    value={String(formData.experience)}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({ ...prev, experience: value }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select experience level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Less than 1 year</SelectItem>
                                        <SelectItem value="1">1+ years</SelectItem>
                                        <SelectItem value="3">3+ years</SelectItem>
                                        <SelectItem value="5">5+ years</SelectItem>
                                        <SelectItem value="10">10+ years</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Equipment */}
                            <div className="space-y-2">
                                <Label htmlFor="equipment">Equipment/Tools Provided</Label>
                                <Textarea
                                    id="equipment"
                                    placeholder="List any equipment, tools, or materials you provide..."
                                    className="min-h-[80px]"
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            equipments: e.target.value,
                                        }))
                                    }
                                    value={formData.equipments}
                                />
                            </div>

                            {/* Requirements */}
                            <div className="space-y-2">
                                <Label htmlFor="requirements">Special Requirements</Label>
                                <Textarea
                                    id="requirements"
                                    placeholder="Any special requirements from clients (kitchen access, parking, etc.)..."
                                    className="min-h-[80px]"
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            requirements: e.target.value,
                                        }))
                                    }
                                    value={formData.requirements}
                                />
                            </div>

                            {/* Action Button */}
                            <div className="flex gap-4 pt-6">
                                <Button
                                    className="flex-1"
                                    onClick={updateServiceService}
                                    disabled={isFormIncomplete}
                                >
                                    {serviceVar?.status === 'loading' ? 'Updating Service...' : 'Update Service'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <MobileBottomNav />
        </div>
    );
};

export default EditService;
