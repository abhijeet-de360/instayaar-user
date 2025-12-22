import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Calendar, ArrowLeft, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { freelancerById } from "@/store/freelancerSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Badge } from "@/components/ui/badge";
const FreelancerReviews = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const freelancerVar: any = useSelector((state: RootState) => state.freelancer);
  useEffect(() => {
    dispatch(freelancerById(id));
  }, [id]);
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
      />
    ));
  };
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <span onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Reviews & Rating</span>
          </span>
        </div>
      </div>
      <div className="px-4 py-6">
        <Card className="mb-6 pt-5">
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {freelancerVar?.freelancerDetails?.averageRating}
                </div>
                <p className="text-xs text-muted-foreground">Average Rating</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {freelancerVar?.freelancerDetails?.totalReview}
                </div>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {freelancerVar?.freelancerDetails?.reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-2 flex-col">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium">{`${review.userId.firstName} ${review.userId.lastName}`}</p>
                      <Badge className="capitalize text-xs" variant="outline">{review.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-muted-foreground">
                        {review.rating}/5
                      </span>
                    </div>

                  </div>
                  <div className="w-full">
                    <p className="text-xs mb-3">{review.review}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(review.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {freelancerVar?.freelancerDetails?.reviews.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Review</h3>
            </CardContent>
          </Card>
        )}
      </div>
      <MobileBottomNav />
    </div>
  );
};
export default FreelancerReviews;