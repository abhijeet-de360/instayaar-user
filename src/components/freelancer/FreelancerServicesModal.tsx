import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Eye, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import freelancerData from '@/data/freelancerData.json';
import type { Freelancer, FreelancerService } from '@/types/freelancerTypes';

interface FreelancerServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancer: Freelancer;
}

interface ServiceCartItem {
  service: FreelancerService;
  quantity: number;
}

export const FreelancerServicesModal: React.FC<FreelancerServicesModalProps> = ({
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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <img 
                src={freelancer.image} 
                alt={freelancer.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold">{freelancer.name}</div>
                <div className="text-sm text-muted-foreground">{freelancer.location}</div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Services List */}
            <div className="lg:col-span-2 space-y-4">
              {freelancerServices.map(service => {
                const cartItem = cart.find(item => item.service.id === service.id);
                return (
                  <Card key={service.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{service.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {service.category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-primary">
                            ₹{service.basePrice}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {service.duration}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {service.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedService(service)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          {cartItem ? (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromCart(service.id)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center">{cartItem.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addToCart(service)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => addToCart(service)}
                              size="sm"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Cart ({cart.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No services selected</p>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {cart.map(item => (
                          <div key={item.service.id} className="flex justify-between items-center text-sm">
                            <div>
                              <div className="font-medium">{item.service.title}</div>
                              <div className="text-muted-foreground">
                                ₹{item.service.basePrice} x {item.quantity}
                              </div>
                            </div>
                            <div className="font-semibold">
                              ₹{item.service.basePrice * item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-3 mb-4">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total</span>
                          <span className="text-lg text-primary">₹{getTotalPrice()}</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={proceedToBooking}
                        className="w-full"
                      >
                        Proceed to Book
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Details Modal */}
      {selectedService && (
        <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedService.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <p className="text-sm text-muted-foreground">{selectedService.description}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">Skills</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedService.skills.map(skill => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => addToCart(selectedService)} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={() => setSelectedService(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};