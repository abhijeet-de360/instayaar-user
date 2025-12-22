import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Camera,
  Image as ImageIcon,
  Grid3X3,
  List
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import Dropzone from "react-dropzone";
import { createPortfolio, deletePortfolio, getAllPortfolio } from "@/store/portfolioSlice";
import imageCompression from "browser-image-compression";

const PortfolioGallery = () => {
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const categoryVar = useSelector((state: RootState) => state.category);
  const portfolioVar = useSelector((state: RootState) => state.portfolio);
  const dispatch = useDispatch<AppDispatch>();
  const [file, setFile] = useState(null);
  const [formVar, setFormVar] = useState({
    title: "",
    categoryId: "",
    image: ""
  });


  const compressFile = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 768, // resize
      useWebWorker: true,
    };

    try {
      const compressedBlob = await imageCompression(file, options);
      return new File([compressedBlob], file.name, { type: file.type, lastModified: Date.now() });
    } catch (error) {
      console.error("Image compression failed:", error);
      return file; // fallback
    }
  };

  const [view, setView] = useState(false);
  useEffect(() => {
    setFormVar((prev) => ({ ...prev, image: file }));
  }, [file]);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  const handleAddPhotos = () => {
    setView(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPortfolio({
      title: formVar.title,
      categoryId: formVar.categoryId
    }, formVar.image));
    setView(false);
    setFormVar({
      title: "",
      categoryId: "",
      image: ""
    });
  };

  useEffect(() => {
    dispatch(getAllPortfolio())
  }, [])

  const handleDeleteImage = (imageId: string) => {
    dispatch(deletePortfolio(imageId));
  };


  if (isMobile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        {/* Mobile Header */}
        <div className="sticky top-0 z-50 bg-background border-b">
          <div className="flex items-center justify-between p-4">
            <Link to="/freelancer-dashboard" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Portfolio Gallery</span>
            </Link>
            <Button
              size="sm"
              onClick={handleAddPhotos}
              className="h-8 px-3"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Images Grid/List */}
          {portfolioVar?.portfolioData.length > 0 ? (
            <div className={viewMode === "grid"
              ? "grid grid-cols-2 gap-3"
              : "space-y-3"
            }>
              {portfolioVar?.portfolioData.map((image) => (
                <Card key={image._id} className="overflow-hidden">
                  <div className={viewMode === "grid"
                    ? "aspect-square relative"
                    : "flex gap-3 p-3"
                  }>
                    <img
                      src={image?.image}
                      alt={image?.title}
                      className={viewMode === "grid"
                        ? "w-full h-full object-cover"
                        : "w-16 h-16 object-cover rounded"
                      }
                    />
                    {viewMode === "grid" && (
                      <div className="absolute top-2 right-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-6 w-6 p-0 rounded-full"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-sm">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Image</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this image from your portfolio?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteImage(image._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                    {viewMode === "grid" && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                        <div className="text-xs font-medium truncate">{image?.title}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {image?.categoryId?.name}
                        </Badge>
                      </div>
                    )}
                    {viewMode === "list" && (
                      <div className="flex-1 flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{image?.title}</div>
                          <Badge variant="outline" className="text-xs mt-1">
                            {image?.categoryId?.name}
                          </Badge>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-sm">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Image</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this image from your portfolio?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteImage(image._id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No Images Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your portfolio by adding photos of your work
              </p>
              {/* <Button onClick={handleAddPhotos}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Photo
              </Button> */}
            </Card>
          )}
        </div>

        <MobileBottomNav />
        <Dialog open={view} onOpenChange={setView}>
          <form>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Photo</DialogTitle>
                <DialogDescription>
                  Add photo to your portfolio. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Title</Label>
                  <Input id="name-1" name="title" placeholder="Your photo title" value={formVar.title} onChange={(e) => setFormVar({ ...formVar, title: e.target.value })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Category</Label>
                  <Select value={formVar.categoryId} onValueChange={(value) => setFormVar({ ...formVar, categoryId: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {
                          categoryVar?.categoryData?.map((category) => (
                            <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                          ))
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="username-1">Image</Label>
                  <Dropzone
                    accept={{ "image/*": [] }}
                    multiple={false}
                    onDrop={async (acceptedFiles) => {
                      if (acceptedFiles.length === 0) return;

                      const uploadedFile = acceptedFiles[0];
                      const compressedFile = await compressFile(uploadedFile); // compress
                      const previewUrl = URL.createObjectURL(compressedFile);

                      setFile(Object.assign(compressedFile, { preview: previewUrl }));

                      setFormVar((prev) => ({
                        ...prev,
                        image: compressedFile,
                      }));
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section className="flex justify-center">
                        <div
                          {...getRootProps()}
                          className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-2 py-6 w-full flex flex-col items-center justify-center text-gray-500"
                        >
                          <input {...getInputProps()} />

                          {file ? (
                            <img
                              src={file.preview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-sm shadow-md"
                            />
                          ) : (
                            <p className="text-center">Drag & drop or click to upload</p>
                          )}
                        </div>
                      </section>
                    )}
                  </Dropzone>

                </div>
              </div>
              <DialogFooter className="">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={handleSubmit}>Add Photo</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>
    );
  }

  // Desktop version
  return (
    <>
      <div className="min-h-screen bg-background">
        <Header onLogin={handleLogin} />

        <div className="container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Link to="/my-services">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Services
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold">Portfolio Gallery</h1>
                  <p className="text-muted-foreground">Showcase your work with photos and videos</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddPhotos}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{portfolioImages.length}</div>
                  <p className="text-sm text-muted-foreground">Total Images</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">245</div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </CardContent>
              </Card>
            </div> */}

            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Portfolio</h2>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>
            </div>

            {/* Images Display */}
            {portfolioVar?.portfolioData.length > 0 ? (
              <div className={viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {portfolioVar?.portfolioData.map((image) => (
                  <Card key={image._id} className="overflow-hidden group">
                    {viewMode === "grid" ? (
                      <div className="relative">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={image?.image}
                            alt={image?.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{image?.title}" from your portfolio? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteImage(image._id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{image.title}</h3>
                          <Badge variant="outline">{image?.categoryId?.name}</Badge>
                        </CardContent>
                      </div>
                    ) : (
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={image?.image}
                            alt={image?.title}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{image?.title}</h3>
                            <Badge variant="outline" className="mb-2">{image?.categoryId?.name}</Badge>
                            <p className="text-sm text-muted-foreground">Added to portfolio</p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Image</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{image.title}" from your portfolio? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteImage(image._id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-xl font-semibold mb-4">No Images Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start building your portfolio by adding photos of your work. High-quality images help you attract more clients.
                </p>
                <div className="flex gap-3 justify-center">
                  {/* <Button onClick={handleTakePhoto} variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button> */}
                  <Button onClick={handleAddPhotos}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Photo
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>

        <MobileBottomNav />
      </div>
      <Dialog open={view} onOpenChange={setView}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Photo</DialogTitle>
              <DialogDescription>
                Add photo to your portfolio. Click save when you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Title</Label>
                <Input id="name-1" name="title" placeholder="Your photo title" value={formVar.title} onChange={(e) => setFormVar({ ...formVar, title: e.target.value })} />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Category</Label>
                <Select value={formVar.categoryId} onValueChange={(value) => setFormVar({ ...formVar, categoryId: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Categories</SelectLabel>
                      {
                        categoryVar?.categoryData?.map((category) => (
                          <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                        ))
                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Image</Label>
                <Dropzone
                  accept={{ "image/*": [] }}
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                    const uploadedFile = acceptedFiles[0];
                    setFile(Object.assign(uploadedFile, {
                      preview: URL.createObjectURL(uploadedFile)
                    }));
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section className="flex justify-center">
                      <div
                        {...getRootProps()}
                        className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-2 py-6 w-full flex flex-col items-center justify-center text-gray-500"
                      >
                        <input {...getInputProps()} />

                        {file ? (
                          <img
                            src={file.preview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-sm shadow-md"
                          />
                        ) : (
                          <p className="text-center">Drag & drop or click to upload</p>
                        )}
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleSubmit}>Add Photo</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default PortfolioGallery;