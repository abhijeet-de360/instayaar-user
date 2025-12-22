import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, Filter, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

const ReviewsRatings = () => {
  const { setUserRole, setIsLoggedIn, isLoggedIn } = useUserRole();
  const isMobile = useIsMobile();

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      freelancer: "Rajesh Kumar",
      service: "Chef",
      rating: 5,
      date: "2024-02-15",
      review: "Excellent service! Rajesh prepared amazing Italian cuisine for our party. Highly recommended!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80"
    },
    {
      id: 2,
      freelancer: "Kavya Iyer", 
      service: "DJ",
      rating: 4,
      date: "2024-02-10",
      review: "Great music selection and kept the crowd engaged throughout the event. Very professional.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b2c0c8e8?auto=format&fit=crop&w=300&h=300&q=80"
    },
    {
      id: 3,
      freelancer: "Anita Reddy",
      service: "Bartender", 
      rating: 5,
      date: "2024-02-05",
      review: "Outstanding bartending skills! Made amazing cocktails and was very friendly with guests.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />
      
      <div className={`${isMobile ? 'p-4 pb-20' : 'container mx-auto px-6 py-8'}`}>
        <div className={`${isMobile ? '' : 'max-w-4xl mx-auto'}`}>
          {/* Header Section */}
          <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} ${isMobile ? 'items-start' : 'items-center justify-between'} gap-4 mb-6`}>
            <div>
              <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold`}>
                {isMobile ? 'Reviews & Ratings' : 'My Reviews & Ratings'}
              </h1>
              <p className="text-sm text-muted-foreground">Your feedback and ratings</p>
            </div>
            
            {/* Action Buttons */}
            {isMobile && (
              <div className="flex w-full gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            )}
          </div>

          {/* Search Bar - Mobile only */}
          {isMobile && (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                className="pl-9"
              />
            </div>
          )}
          
          
          {/* Summary Card */}
          <Card className={`${isMobile ? 'mb-4' : 'mb-8'}`}>
            <CardHeader className={`${isMobile ? 'pb-3' : ''}`}>
              <CardTitle className={`${isMobile ? 'text-lg' : ''}`}>
                {isMobile ? 'Summary' : 'Rating Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className={`${isMobile ? 'pt-0' : ''}`}>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-6'}`}>
                <div className={`${isMobile ? 'flex items-center justify-between bg-muted/50 rounded-lg p-3' : 'text-center'}`}>
                  <div className={`${isMobile ? '' : 'text-3xl font-bold text-primary mb-2'}`}>
                    {isMobile ? (
                      <div>
                        <p className="text-sm font-medium">Average Rating</p>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">4.7</span>
                          <div className="flex">
                            {renderStars(5)}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-primary mb-2">4.7</div>
                        <div className="flex justify-center mb-2">
                          {renderStars(5)}
                        </div>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                      </>
                    )}
                  </div>
                </div>
                
                {isMobile ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center bg-muted/50 rounded-lg p-3">
                      <div className="text-xl font-bold text-primary">{reviews.length}</div>
                      <p className="text-xs text-muted-foreground">Total Reviews</p>
                    </div>
                    <div className="text-center bg-muted/50 rounded-lg p-3">
                      <div className="text-xl font-bold text-green-600">100%</div>
                      <p className="text-xs text-muted-foreground">Satisfied</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{reviews.length}</div>
                      <p className="text-sm text-muted-foreground">Total Reviews</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">100%</div>
                      <p className="text-sm text-muted-foreground">Satisfied Customers</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          
          {/* Reviews List */}
          <div className="space-y-3 md:space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                  {isMobile ? (
                    /* Mobile Layout */
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <img 
                          src={review.image} 
                          alt={review.freelancer}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-sm">{review.freelancer}</h3>
                              <Badge variant="outline" className="text-xs">
                                {review.service}
                              </Badge>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {review.rating}/5
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {review.review}
                      </p>
                      
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm">
                          Edit Review
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* Desktop Layout */
                    <div className="flex items-start gap-4">
                      <img 
                        src={review.image} 
                        alt={review.freelancer}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{review.freelancer}</h3>
                            <Badge variant="outline" className="text-xs">
                              {review.service}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {review.rating}/5
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">
                          {review.review}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {review.date}
                          </div>
                          <Button variant="outline" size="sm">
                            Edit Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default ReviewsRatings;