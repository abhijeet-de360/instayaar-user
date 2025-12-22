import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useShortlist } from "@/hooks/useShortlist";
import { LoginModal } from "@/components/auth/LoginModal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Star, MapPin, Clock, MessageCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ShortlistFreelancersPage = () => {
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const { isMobile, showLoginModal, setShowLoginModal, checkAuth } = useAuthCheck();
  const { getShortlistedFreelancers, removeFromShortlist, shortlistCount } = useShortlist();
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  // Get actual shortlisted freelancers from the hook
  const freelancers = getShortlistedFreelancers().map(freelancer => ({
    ...freelancer,
    title: `Professional ${freelancer.primaryService}`,
    hourlyRate: Math.floor(Math.random() * 500) + 500, // Random rate for display
    experience: `${Math.floor(Math.random() * 8) + 2}+ years`,
    tags: [freelancer.primaryService, "Professional", "Experienced"],
    responseTime: "Within 2 hours",
    completedJobs: Math.floor(Math.random() * 200) + 50,
    isAvailable: Math.random() > 0.3 // 70% chance of being available
  }));

  const handleRemoveFromShortlist = (freelancerId: number) => {
    removeFromShortlist(freelancerId);
    toast.success("Freelancer removed from shortlist");
  };

  const handleViewProfile = (freelancerId: number) => {
    navigate(`/freelancer-profile/${freelancerId}`);
  };

  const handleHireNow = (freelancerId: number) => {
    checkAuth(() => navigate(`/freelancer-services/${freelancerId}`));
  };

  const handleMessage = (freelancerId: number) => {
    checkAuth(() => navigate(`/chat/${freelancerId}`));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Header onLogin={handleLogin} />
      </div>
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link to="/employer-dashboard" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Shortlisted Freelancere</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">

        {freelancers.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
              <h3 className="text-xl font-semibold">No freelancers in your shortlist</h3>
              <p className="text-muted-foreground">Start browsing and save freelancers you're interested in</p>
              <Button onClick={() => navigate('/discover')}>
                Browse Freelancers
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((freelancer) => (
              <Card key={freelancer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={freelancer.image || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=400&q=80`} alt={freelancer.name} />
                        <AvatarFallback className="bg-primary text-white font-medium">
                          {freelancer.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{freelancer.name}</h3>
                        <p className="text-sm text-muted-foreground">{freelancer.title}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromShortlist(freelancer.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{freelancer.rating}</span>
                      <span className="text-sm text-muted-foreground">({freelancer.reviews})</span>
                    </div>
                    <Badge variant={freelancer.isAvailable ? "default" : "secondary"}>
                      {freelancer.isAvailable ? "Available" : "Busy"}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {freelancer.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Responds {freelancer.responseTime}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {freelancer.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {freelancer.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{freelancer.tags.length - 2} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-lg font-bold">₹{freelancer.hourlyRate}</span>
                      <span className="text-sm text-muted-foreground">/hour</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{freelancer.completedJobs} jobs</p>
                      <p className="text-xs text-muted-foreground">{freelancer.experience}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewProfile(freelancer.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      View Profile
                    </Button>
                    <Button
                      onClick={() => handleMessage(freelancer.id)}
                      variant="outline"
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleHireNow(freelancer.id)}
                      size="sm"
                      className="flex-1"
                      disabled={!freelancer.isAvailable}
                    >
                      Hire Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <MobileBottomNav />

      <LoginModal
        isOpen={showLoginModal}
        onClose={setShowLoginModal}
        onLoginSuccess={handleLogin}
        isMobile={isMobile}
      />
    </div>
  );
};

export default ShortlistFreelancersPage;