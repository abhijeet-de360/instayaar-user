import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Ban, Search } from "lucide-react";
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
import { getFreelancerProfile } from "@/store/authSlice";

export const BlockedUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch: any = useDispatch();

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      setLoading(true);
      const res = await service.getBlockedUsers();
      setUsers(res.data);
    } catch (error: any) {
      errorHandler(error?.response || { data: { message: "Failed to fetch blocked clients" } });
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      await service.unblockUser(userId);
      successHandler("Client unblocked successfully");
      setUsers(prev => prev.filter(u => u._id !== userId));
      dispatch(getFreelancerProfile()); // Refresh freelancer profile
    } catch (error: any) {
      errorHandler(error?.response || { data: { message: "Failed to unblock user" } });
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 md:pb-0">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Blocked Clients</h1>
              <p className="text-sm text-muted-foreground mr-1">
                Manage the clients you have blocked.
              </p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search blocked clients..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Ban className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {users.length === 0 ? "You haven't blocked any clients." : "No blocked clients found matching your search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16 mb-2">
                      <AvatarImage src={user.profile} alt={user.firstName} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary uppercase text-lg">
                        {user.firstName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0 flex flex-col gap-0 justify-center">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg truncate">
                            {user.firstName} {user.lastName}
                          </h3>
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
                              <AlertDialogTitle>Unblock Client?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to unblock {user.firstName}? They will be able to message you and book your services again.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row justify-end space-x-2">
                              <AlertDialogCancel className="mt-0 flex-1">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="flex-1"
                                onClick={() => handleUnblock(user._id)}
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
