import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ban, MapPin, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { service } from "@/shared/_services/api_service";
import { errorHandler, successHandler } from "@/shared/_helper/responseHelper";
import { Input } from "@/components/ui/input";
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
import { useDispatch } from "react-redux";
import { getUserProfile } from "@/store/authSlice";

export const BlockedFreelancers = () => {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch: any = useDispatch();

  useEffect(() => {
    fetchBlockedFreelancers();
  }, []);

  const fetchBlockedFreelancers = async () => {
    try {
      setLoading(true);
      const res = await service.getBlockedFreelancers();
      setFreelancers(res.data);
    } catch (error: any) {
      errorHandler(error?.response || { data: { message: "Failed to fetch blocked yaaras" } });
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (freelancerId: string) => {
    try {
      await service.unblockFreelancer(freelancerId);
      successHandler("Freelancer unblocked successfully");
      setFreelancers(prev => prev.filter(f => f._id !== freelancerId));
      dispatch(getUserProfile()); // Refresh user profile to update block list globally
    } catch (error: any) {
      errorHandler(error?.response || { data: { message: "Failed to unblock freelancer" } });
    }
  };

  const filteredFreelancers = freelancers.filter(f => 
    `${f.firstName} ${f.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.skills?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 md:pb-0">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Blocked Yaars</h1>
              <p className="text-sm text-muted-foreground mr-1">
                Manage the Yaars you have blocked.
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search blocked Yaars..." 
                className="pl-9"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filteredFreelancers.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
             <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Ban className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {freelancers.length === 0 ? "You haven't blocked any Yaars." : "No blocked Yaars found matching your search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredFreelancers.map((freelancer) => (
              <Card key={freelancer._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={freelancer.profile} alt={freelancer.firstName} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary uppercase text-lg">
                         {freelancer.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 flex flex-col gap-0 justify-center">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg truncate">
                             {freelancer.firstName} {freelancer.lastName}
                          </h3>
                           {freelancer.skills && freelancer.skills.length > 0 && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {freelancer.skills[0]}
                            </p>
                           )}
                        </div>
                      </div>
                      <div className="mt-2 flex w-full">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-[120px] ml-auto text-destructive border-destructive"
                              >
                                Unblock
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="w-[90%] rounded-xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Unblock Yaars?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to unblock {freelancer.firstName}? They will be able to message you and you can book their services again.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-row justify-end space-x-2">
                                <AlertDialogCancel className="mt-0 flex-1">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  className="flex-1"
                                  onClick={() => handleUnblock(freelancer._id)}
                                >
                                  Unblock
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};
