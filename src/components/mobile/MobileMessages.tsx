import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {  MessageCircleCodeIcon,} from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getConversationList } from "@/store/chatSlice";
import { formatDistanceToNow, parseISO } from "date-fns";
import { chatSocket } from "@/lib/socket";

const MobileMessages = () => {
  const navigate = useNavigate();
  const authVar = useSelector((state: RootState) => state.auth);
  const { setUserRole, setIsLoggedIn, userRole, isLoggedIn } = useUserRole();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const chatVar = useSelector((state: RootState) => state?.chat);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
    setShowLoginModal(false);
  };

  // Check if user is logged in, show login modal if not
  useEffect(() => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    dispatch(getConversationList())
  }, [])

  useEffect(() => {
    chatSocket.on("messageSent", (newMessage) => {
      dispatch(getConversationList())
    });

    return () => {
      chatSocket.off("messageSent");
    };
  }, []);


  return (
    <div className="min-h-screen bg-background pb-20 ">
      {/* Hide header when logged in on mobile */}
      {!authVar.isAuthenticated && <Header onLogin={handleLogin} />}

      <div className="flex flex-col h-[calc(100vh-140px)]">
        {chatVar?.conversationList.length > 0 ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-1">
              {chatVar?.conversationList?.map((conversation) => (
                <Card
                  key={conversation._id}
                  className="p-0 overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/chat/${conversation?._id}`)}
                >
                  <CardContent className="p-0">
                    <div className="flex items-center gap-3 p-4 hover:bg-muted/50 active:bg-muted transition-colors">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={
                              conversation?.freelancerId?.profile ||
                              conversation?.userId?.profile
                            }
                          />
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold truncate text-sm">
                            {conversation?.freelancerId?.firstName ||
                              conversation?.userId?.firstName}{" "}
                            {conversation?.freelancerId?.lastName ||
                              conversation?.userId?.lastName}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {conversation?.lastMessageAt
                                ? formatDistanceToNow(
                                  parseISO(conversation.lastMessageAt),
                                  { addSuffix: true }
                                )
                                : ""}
                            </span>
                            {conversation.unread > 0 && (
                              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs text-primary-foreground font-medium">
                                  {conversation.unread}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation?.lastMessage}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="border-none shadow-none">
              <CardContent className="p-8 text-center">
                <MessageCircleCodeIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No Chat found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  User chat will appear here
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>


      <MobileBottomNav />
    </div>
  );
};

export default MobileMessages;
