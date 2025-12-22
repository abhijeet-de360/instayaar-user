import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Eye, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import freelancerData from '@/data/freelancerData.json';
import type { Freelancer, FreelancerService } from '@/types/freelancerTypes';

interface FreelancerServicesBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  freelancer: Freelancer;
}

interface ServiceCartItem {
  service: FreelancerService;
  quantity: number;
}

export const FreelancerServicesBottomSheet: React.FC<FreelancerServicesBottomSheetProps> = ({
  isOpen,
  onClose,
  freelancer
}) => {
  const [cart, setCart] = useState<ServiceCartItem[]>([]);
  const [selectedService, setSelectedService] = useState<FreelancerService | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get services offered by this freelancer
  const freelancerServices = freelancerData.services.filter(service => 
    freelancer.servicesOffered?.includes(service.id)
  );

  const addToCart = (service: FreelancerService) => {
    setCart(prev => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing) {
        return prev.map(item =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { service, quantity: 1 }];
    });
    toast({
      title: "Service Added",
      description: `${service.title} added to cart`,
    });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.service.id === serviceId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.service.id === serviceId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.service.id !== serviceId);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.service.basePrice * item.quantity), 0);
  };

  const proceedToBooking = () => {
    if (cart.length === 0) {
      toast({
        title: "No Services Selected",
        description: "Please select at least one service to proceed",
        variant: "destructive"
      });
      return;
    }
    
    // Store cart data and navigate to booking
    localStorage.setItem('selectedServices', JSON.stringify(cart));
    navigate(`/book-services/${freelancer.id}`);
    onClose();
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-3">
              <img 
                src={freelancer.image} 
                alt={freelancer.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold">{freelancer.name}</div>
                <div className="text-sm text-muted-foreground">{freelancer.location}</div>
              </div>
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-4 overflow-y-auto">
            {/* Cart Summary */}
            {cart.length > 0 && (
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Cart ({cart.length})
                    </div>
                    <div className="text-lg text-primary">₹{getTotalPrice()}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button onClick={proceedToBooking} className="w-full">
                    Proceed to Book
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Services List */}
            <div className="space-y-3">
              {freelancerServices.map(service => {
                const cartItem = cart.find(item => item.service.id === service.id);
                return (
                  <Card key={service.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-base">{service.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {service.category}
                          </Badge>
                        </div>
                        <div className="text-right ml-2">
                          <div className="text-base font-semibold text-primary">
                            ₹{service.basePrice}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {service.duration}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {service.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedService(service)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          {cartItem ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromCart(service.id)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-6 text-center text-sm">{cartItem.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addToCart(service)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addToCart(service)}
                              size="sm"
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Service Details Bottom Sheet */}
      {selectedService && (
        <Drawer open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle>{selectedService.title}</DrawerTitle>
            </DrawerHeader>
            
            <div className="px-4 pb-4 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p className="text-sm text-muted-foreground">{selectedService.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <p className="text-sm text-muted-foreground">{selectedService.duration}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <p className="text-sm text-muted-foreground">₹{selectedService.basePrice}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <p className="text-sm text-muted-foreground">{selectedService.location}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedService.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Skills</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedService.skills.map(skill => (
                    <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={() => addToCart(selectedService)} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={() => setSelectedService(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};