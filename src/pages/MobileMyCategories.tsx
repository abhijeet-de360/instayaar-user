import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { Button } from '@/components/ui/button'
import { getCategories } from '@/store/categorySlice'
import { AppDispatch, RootState } from '@/store/store'
import { ArrowLeft, Check, ChevronsUpDown, Layers } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { getFreelancerProfile, updateFreelancerCategory } from '@/store/authSlice'
import { Card, CardContent } from '@/components/ui/card'

const MobileMyCategories = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const categoryVar = useSelector((state: RootState) => state.category)
    const authVar = useSelector((state: RootState) => state.auth)

    const [open, setOpen] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    useEffect(() => {
        dispatch(getCategories())
        dispatch(getFreelancerProfile())
    }, [dispatch])

    const categories = Array.isArray(categoryVar?.categoryData)
        ? categoryVar.categoryData
        : []

    const existingCategoryIds =
        authVar?.freelancer?.categoryIds?.map((cat: any) => cat._id) || []

    useEffect(() => {
        if (open) {
            setSelectedCategories(
                authVar?.freelancer?.categoryIds?.map((cat: any) => cat._id) || []
            );
        }
    }, [open]);


    const toggleCategory = (id: string) => {
        setSelectedCategories(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        )
    }

    const handleSubmit = () => {
        dispatch(updateFreelancerCategory(selectedCategories))
        setOpen(false)
    }

    return (
        <div className="h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background border-b">
                <div className="flex items-center justify-between p-4">
                    <span onClick={() => navigate(-1)} className="flex items-center gap-2 cursor-pointer">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="font-medium">My Categories</span>
                    </span>

                    <Button size="sm" onClick={() => setOpen(true)}>
                        Add Category
                    </Button>
                </div>
            </div>

            <div className="px-4 py-2">
                {authVar?.freelancer?.categoryIds?.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                                <Layers className="h-7 w-7 text-muted-foreground" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-base font-semibold">No Categories Selected</h3>
                                <p className="text-sm text-muted-foreground">
                                    Choose categories to improve your profile visibility.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex items-center gap-2 flex-wrap mt-3">
                    {authVar?.freelancer?.categoryIds?.map((cat: any) => (
                        <div
                            key={cat?._id}
                            className="font-medium border border-neutral-400 px-4 py-1 rounded-md text-sm"
                        >
                            {cat?.name}
                        </div>
                    ))}
                </div>
            </div>

            <MobileBottomNav />

            {/* Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Select Categories</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between rounded-md"
                                >
                                    {selectedCategories.length > 0
                                        ? `${selectedCategories.length} selected`
                                        : "Select categories"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                <Command>
                                    <CommandInput placeholder="Search category..." />

                                    <CommandList>
                                        <CommandEmpty>No category found.</CommandEmpty>

                                        <CommandGroup>
                                            {categories.map((cat: any) => (
                                                <CommandItem
                                                    key={cat._id}
                                                    value={cat.name}
                                                    onSelect={() => toggleCategory(cat._id)}
                                                    className="flex justify-between"
                                                >
                                                    {cat.name}
                                                    {selectedCategories.includes(cat._id) && (
                                                        <Check className="h-4 w-4" />
                                                    )}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                        {/* Selected Badges */}
                        {selectedCategories.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedCategories.map(id => {
                                    const cat = categories.find(c => c._id === id)
                                    return (
                                        <Badge key={id} variant="secondary">
                                            {cat?.name}
                                        </Badge>
                                    )
                                })}
                            </div>
                        )}

                        <Button onClick={handleSubmit} className="w-full rounded-md">
                            Submit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default MobileMyCategories
