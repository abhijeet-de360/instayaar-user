import React, { useEffect, useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Clock, ArrowLeft, Check, Eye, Info } from "lucide-react";
import type { Freelancer, FreelancerService } from "@/types/freelancerTypes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getServicesByFreelancer } from "@/store/ServiceSlice";

export default function FreelancerServices() {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedServices, setSelectedServices] = useState<any>([]);
  const [selectedService, setSelectedService] = useState<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const serviceVar = useSelector((state: RootState) => state.service);

  useEffect(() => {
    dispatch(getServicesByFreelancer(freelancerId));
  }, [freelancerId]);

  // Find the freelancer
  // const freelancer = freelancerData.freelancers.find(
  //   f => f.id.toString() === freelancerId
  // ) as Freelancer | undefined;

  // const freelancerServices = freelancerData.services.filter(
  //   service => service.freelancerId === freelancer._id.toString()
  // );

  // const toggleService = (service: FreelancerService) => {
  //   setSelectedServices((prev) => {
  //     const isSelected = prev.some((s) => s.id === service.id);
  //     if (isSelected) {
  //       return prev.filter((s) => s.id !== service.id);
  //     } else {
  //       return [...prev, service];
  //     }
  //   });
  // };

  // const getTotalPrice = () => {
  //   return selectedServices.reduce(
  //     (total, service) => total + service?.price,
  //     0
  //   );
  // };

  // const proceedToBooking = (id: any) => {
  //   if (selectedServices.length === 0) return;
  //   navigate(`/multi-service-booking/${id}`);
  // };

  // const isServiceSelected = (service: any) => {
  //   return selectedServices.some((s) => s._id === service._id);
  // };

  // allow only one selected service at a time
  const toggleService = (service: FreelancerService) => {
    setSelectedServices((prev: any[]) => {
      // if the clicked service is already selected => deselect
      if (prev.length > 0 && prev[0]._id === service._id) {
        return [];
      }
      // otherwise replace with the new single service
      return [service];
    });
  };

  const getTotalPrice = () => {
    // still works with array but will be single element
    return selectedServices.reduce(
      (total: number, service: any) => total + (service?.price || 0),
      0
    );
  };

  // proceed using the selected service id (single)
  const proceedToBooking = (serviceId: string | null) => {
    if (!serviceId) return;
    navigate(`/multi-service-booking/${serviceId}`);
  };

  const isServiceSelected = (service: any) => {
    return (
      selectedServices.length > 0 && selectedServices[0]._id === service._id
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Hidden on mobile */}
      <div className="hidden lg:block">
        <Header onLogin={() => {}} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-6 pb-20 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 p-0 h-auto text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Page Header */}
        {/* <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Services Available</h1>
          <p className="text-muted-foreground">Select the services you need and proceed to booking</p>
        </div> */}

        {/* Services Grid - Enhanced for desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {serviceVar?.servicesByFreelancer.map((service) => {
            const isSelected = isServiceSelected(service);

            return (
              <Card
                key={service._id}
                className={`overflow-hidden transition-all hover:shadow-lg ${
                  isSelected ? "ring-2 ring-primary shadow-lg" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl mb-2 capitalize">{service?.title}</h3>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed capitalize">
                      {service.description}
                    </p>
                  </div>

                  {/* <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{service?.duration} hours</span>
                    </div>
                  </div> */}

                  <div className="flex gap-2 items-center justify-between">
                    <span className="font-bold text-2xl text-primary">
                      ₹{service?.price}
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        size="lg"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => toggleService(service)}
                        className="flex items-center gap-2"
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4" />
                            Selected
                          </>
                        ) : (
                          "Select"
                        )}
                      </Button>
                      <Button
                        size="icon"
                        onClick={() => setSelectedService(service)}
                        className=""
                        variant="outline"
                      >
                        <Info className="w-8 h-8 text-primary" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Services Summary - Desktop only */}
        {selectedServices.length > 0 && (
          <div className="hidden lg:block mb-8">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Selected Services ({selectedServices.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedServices.map((service: any) => (
                    <div
                      key={service._id}
                      className="flex justify-between items-center bg-primary/5 rounded-lg p-3 border border-primary/10"
                    >
                      <span className="font-medium">{service.title}</span>
                      <span className="font-bold text-primary">
                        ₹{service?.price}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{getTotalPrice()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Desktop Fixed Bottom Action */}
      <div className="hidden lg:block fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          onClick={() =>
            proceedToBooking(
              selectedServices.length > 0 ? selectedServices[0]._id : null
            )
          }
          className="px-8 py-3 text-lg font-semibold rounded-full shadow-lg"
          size="lg"
          disabled={selectedServices.length === 0}
          variant={selectedServices.length > 0 ? "default" : "secondary"}
        >
          {selectedServices.length > 0
            ? `Proceed to Book - ₹${getTotalPrice().toLocaleString()}`
            : "Select a Service to Continue"}
        </Button>
      </div>

      {/* Mobile Booking Summary */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-background border-t shadow-lg">
        <Button
          onClick={() =>
            proceedToBooking(
              selectedServices.length > 0 ? selectedServices[0]._id : null
            )
          }
          className="w-full h-14 text-base font-semibold rounded-lg"
          disabled={selectedServices.length === 0}
          variant={selectedServices.length > 0 ? "default" : "secondary"}
        >
          {selectedServices.length > 0
            ? `Proceed to Book - ₹${getTotalPrice().toLocaleString()}`
            : "Select a Service to Continue"}
        </Button>
      </div>

      {/* Service Details Modal/Drawer */}
      {selectedService && (
        <>
          {isMobile ? (
            <Drawer
              open={!!selectedService}
              onOpenChange={() => setSelectedService(null)}
            >
              <DrawerContent className="max-h-[80vh]">
                <DrawerHeader>
                  <DrawerTitle className="text-xl">
                    {selectedService?.title}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-2 flex-col rounded-lg p-4">
                    <div>
                      <h4 className="font-semibold mb-1">
                        Skills & Specialties
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <span>{selectedService.skills.join(", ")}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Years of experiences:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <p>{selectedService?.experience} Years</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Equipments/Tools Required:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <p>{selectedService?.equipments}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Special Requirements:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <p>{selectedService?.requirements}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Service Details:</h4>
                      <div className="flex flex-wrap gap-2">
                        <p>{selectedService?.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          ) : (
            <Dialog
              open={!!selectedService}
              onOpenChange={() => setSelectedService(null)}
            >
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedService?.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <Badge variant="outline" className="text-sm">
                    {selectedService?.categoryId?.name}
                  </Badge>
                  <div className="flex items-center justify-between bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium text-lg">
                        {selectedService?.duration}{" "}
                      </span>
                    </div>
                    <span className="text-3xl font-bold text-primary">
                      ₹{selectedService?.price}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {selectedService?.description}
                  </p>
                  <div>
                    <h4 className="font-semibold text-lg mb-3">
                      Skills Required:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => toggleService(selectedService)}
                    className="w-full"
                    size="lg"
                  >
                    {isServiceSelected(selectedService._id) ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      "Select Service"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
}
