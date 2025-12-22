import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, ArrowLeft, Users, Award } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useUserRole } from '@/contexts/UserRoleContext';
import freelancerData from '@/data/freelancerData.json';
import type { FreelancerData } from '@/types/freelancerTypes';

export const PlatformBooking = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserRole } = useUserRole();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (role: string) => {
    setUserRole(role as 'employer' | 'freelancer');
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  // Get freelancer ID from URL params if no serviceId
  const urlParams = new URLSearchParams(window.location.search);
  const freelancerId = urlParams.get('freelancer');

  // Find service by ID or show freelancer booking options
  const service = serviceId ? (freelancerData as FreelancerData).services.find(s => s.id === serviceId) : null;

  // If no service found and we have freelancer ID, show freelancer services
  if (!service && freelancerId) {
    const freelancerServices = (freelancerData as FreelancerData).services.filter(s => s.freelancerId === freelancerId);
    
    if (freelancerServices.length === 0) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">No Services Available</h2>
            <p className="text-muted-foreground mb-4">This freelancer hasn't listed any services yet.</p>
            <Button onClick={() => navigate('/shortlist-freelancers')}>Back to Shortlist</Button>
          </div>
        </div>
      );
    }

    // Show freelancer's services for selection
    return (
      <div className="min-h-screen bg-background">
        <div className="hidden md:block">
          <Header onLogin={handleLogin} />
        </div>
        <div className="container mx-auto px-4 py-6 pb-20 md:pb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/shortlist-freelancers')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shortlist
          </Button>
          
          <h1 className="text-2xl font-bold mb-6">Choose a Service</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancerServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" 
                    onClick={() => navigate(`/platform-booking/${service.id}`)}>
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{service.category}</Badge>
                    {service.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{service.rating}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{service.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">₹{service.basePrice.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{service.duration}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
          <p className="text-muted-foreground mb-4">The service you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hidden md:block">
        <Header onLogin={handleLogin} />
      </div>

      {/* Mobile-first Layout */}
      <div className="container mx-auto px-4 py-6 pb-24">{/* Added pb-24 for sticky button space */}
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Service Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <img
              src={service.images[0]}
              alt={service.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
            {service.images.length > 1 && (
              <div className="grid grid-cols-3 gap-2">
                {service.images.slice(1, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${service.title} ${index + 2}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Service Info */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{service.category}</Badge>
                {service.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{service.rating}</span>
                  </div>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{service.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{service.location}</span>
              </div>
            </div>

            {/* Pricing */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    ₹{service.basePrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Base Price</div>
                  <div className="text-xs text-muted-foreground">
                    + Platform commission & tax will apply
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{service.duration}</div>
                  <div className="text-xs text-muted-foreground">Duration</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{service.completedJobs}</div>
                  <div className="text-xs text-muted-foreground">Jobs Done</div>
                </CardContent>
              </Card>
            </div>

            {/* Platform Guarantee */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 flex items-center gap-3">
                <Award className="w-6 h-6 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">Platform Guarantee</div>
                  <div className="text-sm text-green-700">
                    100% secure booking with full refund protection
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">About This Service</h3>
            <p className="text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          </CardContent>
        </Card>

        {/* Skills */}
        {service.skills.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {service.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Availability */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {service.availability.map((time, index) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {time}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Book Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <Button 
          onClick={() => {
            navigate(`/book-service/${serviceId}`);
          }}
          size="lg" 
          className="w-full"
        >
          Book This Service
        </Button>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-6 text-center space-y-4">
              <h3 className="text-xl font-semibold">Login Required</h3>
              <p className="text-muted-foreground">
                Please login to book this service
              </p>
              <div className="space-y-2">
                <Button onClick={() => handleLogin('employer')} className="w-full">
                  Login as Employer
                </Button>
                <Button onClick={() => handleLogin('freelancer')} variant="outline" className="w-full">
                  Login as Freelancer
                </Button>
              </div>
              <Button variant="ghost" onClick={() => setShowLoginModal(false)}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};