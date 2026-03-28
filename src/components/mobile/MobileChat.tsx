import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, MessageCircle, MoreVertical, Paperclip, Loader2, Download } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getCoversationDetails } from "@/store/chatSlice";
import { getUserProfile, getFreelancerProfile } from "@/store/authSlice";
import { chatSocket } from "@/lib/socket";
import { localService } from "@/shared/_session/local";
import { format, parseISO } from "date-fns";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { service } from "@/shared/_services/api_service";
import { successHandler, errorHandler } from "@/shared/_helper/responseHelper";

const MobileChat = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn } = useUserRole();
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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const amIBlocked = localService.get('role') === 'user'
    ? chatVar?.profile?.blockedUsers?.some((id: any) => id === authVar?.user?._id || id?._id === authVar?.user?._id)
    : chatVar?.profile?.blockedFreelancers?.some((id: any) => id === authVar?.freelancer?._id || id?._id === authVar?.freelancer?._id);

  const haveIBlocked = localService.get('role') === 'user'
    ? authVar?.user?.blockedFreelancers?.some((id: any) => id === chatVar?.profile?._id || id?._id === chatVar?.profile?._id)
    : authVar?.freelancer?.blockedUsers?.some((id: any) => id === chatVar?.profile?._id || id?._id === chatVar?.profile?._id);

  const isCommunicationBlocked = amIBlocked || haveIBlocked;

  const endedStatuses = ['completed', 'cancelled', 'rejected', 'closed', 'deleted', 'suspended'];
  const isBookingCompleted = endedStatuses.includes(chatVar?.serviceBookingId?.status) || 
                             endedStatuses.includes(chatVar?.serviceBookingId?.serviceId?.status) ||
                             endedStatuses.includes(chatVar?.jobApplicationId?.status) ||
                             endedStatuses.includes(chatVar?.jobApplicationId?.jobId?.status);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as "employer" | "freelancer");
  };

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

  // Auto scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

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

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      errorHandler({ data: { message: "File size must be less than 5MB" } });
      return;
    }

    try {
      setIsUploading(true);
      
      const tempId = `temp-${Date.now()}`;
      const messageType: any = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "file";
      
      const optimisticMessage = {
        _id: tempId,
        chatParticipantId: conversationId,
        sender: localService?.get("role"),
        message: URL.createObjectURL(file), // Local preview URL
        messageType: messageType,
        userId: authVar?.user?._id || chatVar?.profile?._id,
        freelancerId: authVar?.freelancer?._id || chatVar?.profile?._id,
        createdAt: new Date().toISOString(),
        isUploading: true,
        uploadProgress: 0,
      };

      setChatMessages((prev) => [...prev, optimisticMessage]);

      const res = await service.uploadChatFile(file, (progressEvent: any) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setChatMessages((prev) => 
          prev.map((msg) => 
            msg._id === tempId ? { ...msg, uploadProgress: percentCompleted } : msg
          )
        );
      });

      const { url, messageType: finalType } = res.data;

      const finalMessage = {
        chatParticipantId: conversationId,
        sender: localService?.get("role"),
        message: url,
        messageType: finalType,
        userId: authVar?.user?._id || chatVar?.profile?._id,
        freelancerId: authVar?.freelancer?._id || chatVar?.profile?._id,
        createdAt: new Date().toISOString(),
      };

      chatSocket.emit("sendMessage", finalMessage);
      
      setChatMessages((prev) => 
        prev.map((msg) => msg._id === tempId ? { ...finalMessage, _id: res.data._id || Date.now() } : msg)
      );
    } catch (error: any) {
      errorHandler(error?.response || { data: { message: "Failed to upload file" } });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReportChat = async () => {
    if (!reportReason) {
      errorHandler({ data: { message: "Please select a reason for reporting." } });
      return;
    }

    try {
      setIsSubmittingReport(true);
      const reportData = {
        reportedEntityId: chatVar?.profile?._id,
        reason: reportReason,
        details: reportDetails,
      };

      if (localService.get('role') === 'user') {
        await service.submitChatReport(reportData);
      } else {
        await service.submitChatReportUser(reportData);
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-0">
      {/* Show header if not logged in */}
      {!authVar?.isAuthenticated && <Header onLogin={handleLogin} />}

      {/* Chat Header */}
      <div className="bg-background border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Link to={localService.get('role') === 'user' ? `/freelancer-profile/${chatVar?.profile?._id}` : ``} className="flex gap-3 items-center">
            {/* <Link to={`/freelancer-profile/${chatVar?.profile?._id}`} className="flex gap-3 items-center"> */}
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={chatVar?.profile?.profile}
                alt={chatVar?.profile?.firstName}
              />
            </Avatar>


            <div>
              <h3 className="font-semibold text-sm">
                {chatVar?.profile?.firstName} {chatVar?.profile?.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                {chatVar?.serviceBookingId?.serviceId?.title && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium inline-block truncate max-w-[120px]">
                    {chatVar?.serviceBookingId?.serviceId?.title}
                  </span>
                )}
                {chatVar?.jobApplicationId?.jobId?.title && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded-full font-medium inline-block truncate max-w-[120px]">
                    {chatVar?.jobApplicationId?.jobId?.title}
                  </span>
                )}
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
                        className="text-[7px] h-3.5 px-1 bg-green-50 text-green-700 border-green-200 font-bold uppercase"
                      >
                        Completed
                      </Badge>
                    );
                  }

                  if (chatVar?.jobApplicationId?.status === 'shortlisted' || chatVar?.jobApplicationId?.status === 'hired') {
                    return (
                      <Badge
                        variant="outline"
                        className="text-[7px] h-3.5 px-1 bg-blue-50 text-blue-700 border-blue-200 font-bold uppercase"
                      >
                        {chatVar.jobApplicationId.status}
                      </Badge>
                    );
                  }

                  if (chatVar?.jobApplicationId?.status === 'applied') {
                    return (
                      <Badge
                        variant="outline"
                        className="text-[7px] h-3.5 px-1 bg-gray-50 text-gray-700 border-gray-200 font-bold uppercase"
                      >
                        Applied
                      </Badge>
                    );
                  }

                  return null;
                })()}
              </div>
            </div>
          </Link>

          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto pb-20">
        <div className="space-y-3">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground h-[90dvh]">
              <MessageCircle className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-base font-medium">No messages yet</p>
              <p className="text-sm">Start the conversation to see messages here</p>
            </div>
          ) : (
            chatMessages.map((message, idx) => (
              <div
                key={message._id || idx}
                className={`flex ${message?.sender === localService?.get("role")
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[85%] ${message?.sender === localService?.get("role")
                    ? "order-2"
                    : "order-1"
                    }`}
                >
                  <div
                    className={`rounded-2xl p-2 relative ${message?.sender === localService?.get("role")
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                      }`}
                  >
                    {message.isUploading && (
                      <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-8 h-8 border-3 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                          <span className="text-[9px] font-bold text-primary">{message.uploadProgress || 0}%</span>
                        </div>
                      </div>
                    )}
                    {message.messageType === "text" || !message.messageType ? (
                      <p className="text-sm px-1 leading-relaxed">{message.message}</p>
                    ) : message.messageType === "image" ? (
                      <div className="rounded-xl overflow-hidden bg-background/10">
                        <img 
                          src={message.message} 
                          alt="Shared image" 
                          className="max-w-full h-auto max-h-60 object-contain"
                          onClick={() => window.open(message.message, '_blank')}
                        />
                      </div>
                    ) : message.messageType === "video" ? (
                      <div className="rounded-xl overflow-hidden bg-black max-w-full">
                        <video 
                          src={message.message} 
                          controls 
                          className="max-w-full max-h-60"
                        />
                      </div>
                    ) : message.messageType === "file" ? (
                      <div className="flex items-center gap-3 p-2 bg-background/10 rounded-xl">
                        <div className="bg-background/20 p-2 rounded-lg">
                          <Paperclip className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">
                            {message.message.split('/').pop() || 'Document'}
                          </p>
                        </div>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-inherit hover:bg-background/20"
                          onClick={() => window.open(message.message, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                  <p
                    className={`text-xs text-muted-foreground mt-1 px-1 ${message?.sender === localService?.get("role")
                      ? "text-right"
                      : "text-left"
                      }`}
                  >
                    {message?.createdAt
                      ? format(parseISO(message.createdAt), "p")
                      : ""}
                  </p>
                </div>
              </div>
            ))
          )}
          {/* Invisible div for scroll target */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      {/* Message Input or Blocked Status */}
      <div className="bg-background border-t px-4 py-3 fixed bottom-0 left-0 right-0 z-10 font-medium">
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
          <div className="flex gap-2 items-end">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 min-h-10 resize-none h-11"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,video/*,application/pdf"
            />
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleFileClick}
              disabled={isUploading}
              className="h-11 w-11 flex-shrink-0"
            >
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              ) : (
                <Paperclip className="h-5 w-5" />
              )}
            </Button>
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-11 w-11 flex-shrink-0"
              disabled={!newMessage.trim() || isUploading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      {/* Report Modal */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="w-[90%] rounded-xl max-w-md">
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

          <DialogFooter className="flex-row justify-end space-x-2">
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

export default MobileChat;
