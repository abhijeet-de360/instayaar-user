import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, Phone, Video, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MobileChat from "@/components/mobile/MobileChat";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { localService } from "@/shared/_session/local";
import { getCoversationDetails } from "@/store/chatSlice";
import { getUserProfile, getFreelancerProfile } from "@/store/authSlice";
import { chatSocket } from "@/lib/socket";
import { format, parseISO } from "date-fns";
import { useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { service } from "@/shared/_services/api_service";
import { successHandler, errorHandler } from "@/shared/_helper/responseHelper";

const Chat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const [isMobile, setIsMobile] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  
  const authVar = useSelector((state: RootState) => state?.auth);
  const dispatch = useDispatch<AppDispatch>();
  const chatVar: any = useSelector((state: RootState) => state?.chat);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const amIBlocked = localService.get('role') === 'user'
    ? chatVar?.profile?.blockedUsers?.some((id: any) => id === authVar?.user?._id || id?._id === authVar?.user?._id)
    : chatVar?.profile?.blockedFreelancers?.some((id: any) => id === authVar?.freelancer?._id || id?._id === authVar?.freelancer?._id);

  const haveIBlocked = localService.get('role') === 'user'
    ? authVar?.user?.blockedFreelancers?.some((id: any) => id === chatVar?.profile?._id || id?._id === chatVar?.profile?._id)
    : authVar?.freelancer?.blockedUsers?.some((id: any) => id === chatVar?.profile?._id || id?._id === chatVar?.profile?._id);

  const isCommunicationBlocked = amIBlocked || haveIBlocked;

  const isBookingCompleted = chatVar?.serviceBookingId?.status === 'completed';

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Fetch conversation on mount
  useEffect(() => {
    if (authVar?.isAuthenticated) {
      dispatch(getCoversationDetails(conversationId));
    }
  }, [authVar?.isAuthenticated, conversationId, dispatch]);

  // Sync messages from redux
  useEffect(() => {
    if (chatVar?.messages) {
      setChatMessages(chatVar.messages);
    }
  }, [chatVar?.messages]);

  // Listen for new messages from socket
  useEffect(() => {
    chatSocket.on("messageSent", (newMessage) => {
      setChatMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      chatSocket.off("messageSent");
    };
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  // Mock freelancer data
  const freelancer = {
    id: "freelancer",
    name: "Arjun Mehta",
    service: "DJ",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80",
    isOnline: true
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      chatParticipantId: conversationId,
      sender: localService?.get("role"),
      message: newMessage,
      messageType: "text",
      userId: authVar?.user?._id || chatVar?.profile?._id,
      freelancerId: authVar?.freelancer?._id || chatVar?.profile?._id,
      createdAt: new Date().toISOString(),
    };

    // Emit message to server
    chatSocket.emit("sendMessage", message);

    // Optimistically add message to local state
    setChatMessages((prev) => [...prev, message]);

    setNewMessage("");
  };

  const handleReportChat = async () => {
    if (!reportReason) {
      errorHandler({ data: { message: "Please select a reason for reporting." } });
      return;
    }

    try {
      setIsSubmittingReport(true);
      const reportData = {
        reportedEntityId: chatVar?.conversationId || chatVar?.messages?.[0]?.chatParticipantId,
        reason: reportReason,
        details: reportDetails,
      };

      if (localService.get('role') === 'user') {
        await service.submitChatReportUser(reportData);
      } else {
        await service.submitChatReport(reportData);
      }

      successHandler("Chat reported successfully. Our team will review it.");
      setIsReportModalOpen(false);
      setReportReason("");
      setReportDetails("");
    } catch (error: any) {
      errorHandler(error?.response || { data: { message: "Failed to submit report." } });
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handleBlockToggle = async () => {
    try {
      const role = localService.get('role');
      const otherId = chatVar?.profile?._id;
      
      if (role === 'user') {
        if (haveIBlocked) {
          const res = await service.unblockFreelancer(otherId);
          successHandler(res.data?.message || "Unblocked successfully");
        } else {
          const res = await service.blockFreelancer(otherId);
          successHandler(res.data?.message || "Blocked successfully");
        }
        dispatch(getUserProfile());
      } else {
        if (haveIBlocked) {
          const res = await service.unblockUser(otherId);
          successHandler(res.data?.message || "Unblocked successfully");
        } else {
          const res = await service.blockUser(otherId);
          successHandler(res.data?.message || "Blocked successfully");
        }
        dispatch(getFreelancerProfile());
      }
      dispatch(getCoversationDetails(conversationId));
    } catch (error: any) {
      errorHandler(error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Use mobile component on small screens - moved after all hooks
  if (isMobile) {
    return <MobileChat />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onLogin={handleLogin} />
      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Chat Header */}
        <Card className="rounded-none border-x-0 border-t-0">
          <CardHeader className="p-4">
            <div className="flex items-center gap-4">
              <Button 
                size="icon" 
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <Avatar className="h-10 w-10">
                <AvatarImage src={chatVar?.profile?.profile} alt={chatVar?.profile?.firstName} />
                <AvatarFallback>{chatVar?.profile?.firstName?.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-semibold">{chatVar?.profile?.firstName} {chatVar?.profile?.lastName}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {chatVar?.profile?.isOnline ? "Online" : "Last seen recently"}
                  </p>
                  {(() => {
                    const isServiceTerminal = chatVar?.serviceBookingId?.status === "completed" || 
                                            chatVar?.serviceBookingId?.serviceId?.status === "closed";
                    const isJobTerminal = chatVar?.jobApplicationId?.jobId?.status === "closed" || 
                                        chatVar?.jobApplicationId?.jobId?.status === "deleted" ||
                                        chatVar?.jobApplicationId?.status === "completed" ||
                                        chatVar?.jobApplicationId?.status === "rejected";
                    
                    if (isServiceTerminal || isJobTerminal) {
                      return (
                        <Badge
                          variant="outline"
                          className="text-[8px] h-4 px-1.5 bg-green-50 text-green-700 border-green-200 font-bold uppercase tracking-wider"
                        >
                          Completed
                        </Badge>
                      );
                    }

                    if (chatVar?.jobApplicationId?.status === 'shortlisted' || chatVar?.jobApplicationId?.status === 'hired') {
                      return (
                        <Badge
                          variant="outline"
                          className="text-[8px] h-4 px-1.5 bg-blue-50 text-blue-700 border-blue-200 font-bold uppercase tracking-wider"
                        >
                          {chatVar.jobApplicationId.status}
                        </Badge>
                      );
                    }

                    if (chatVar?.jobApplicationId?.status === 'applied') {
                      return (
                        <Badge
                          variant="outline"
                          className="text-[8px] h-4 px-1.5 bg-gray-50 text-gray-700 border-gray-200 font-bold uppercase tracking-wider"
                        >
                          Applied
                        </Badge>
                      );
                    }

                    return null;
                  })()}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Video className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsReportModalOpen(true)}>
                      Report Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBlockToggle} className={haveIBlocked ? "text-primary" : "text-destructive"}>
                      {haveIBlocked 
                        ? (localService.get('role') === 'user' ? "Unblock Yaar" : "Unblock Client")
                        : (localService.get('role') === 'user' ? "Block Yaar" : "Block Client")
                      }
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start the conversation to see messages here</p>
              </div>
            ) : (
              chatMessages.map((message, idx) => {
                const isOwn = message?.sender === localService?.get("role");
                return (
                  <div 
                    key={message._id || idx} 
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                      <div 
                        className={`rounded-lg p-3 ${
                          isOwn 
                            ? 'bg-primary text-primary-foreground rounded-br-none' 
                            : 'bg-muted rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p className={`text-xs text-muted-foreground mt-1 ${
                        isOwn ? 'text-right' : 'text-left'
                      }`}>
                        {message?.createdAt ? format(parseISO(message.createdAt), "p") : ""}
                      </p>
                    </div>
                    
                    {!isOwn && (
                      <Avatar className="h-8 w-8 order-1 mr-2 flex-shrink-0">
                        <AvatarImage src={chatVar?.profile?.profile} alt={chatVar?.profile?.firstName} />
                        <AvatarFallback className="text-xs">{chatVar?.profile?.firstName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input or Blocked Status */}
        <Card className="rounded-none border-x-0 border-b-0">
          <CardContent className="p-4">
            {isBookingCompleted ? (
              <div className="flex items-center justify-center p-3 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                Communication ended
              </div>
            ) : isCommunicationBlocked ? (
              <div className="flex items-center justify-center p-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium">
                {haveIBlocked 
                  ? (localService.get('role') === 'user' ? "You blocked this Yaar" : "You blocked this Client")
                  : (localService.get('role') === 'user' ? "You cannot send messages to this Yaar" : "You cannot send messages to this Client")
                }
              </div>
            ) : (
              <div className="flex gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Don't show MobileBottomNav in chat - commented out */}
      {/* <MobileBottomNav /> */}

      {/* Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Chat</DialogTitle>
            <DialogDescription>
              Please provide a reason why you are reporting this conversation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Reason</label>
              <Select onValueChange={setReportReason} value={reportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inappropriate language">Inappropriate language</SelectItem>
                  <SelectItem value="Spam or scam">Spam or scam</SelectItem>
                  <SelectItem value="Harassment">Harassment</SelectItem>
                  <SelectItem value="Off-platform payment request">Off-platform payment request</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Details (Optional)</label>
              <Textarea
                placeholder="Provide more information..."
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsReportModalOpen(false)} disabled={isSubmittingReport}>
              Cancel
            </Button>
            <Button onClick={handleReportChat} disabled={isSubmittingReport}>
              {isSubmittingReport ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Chat;