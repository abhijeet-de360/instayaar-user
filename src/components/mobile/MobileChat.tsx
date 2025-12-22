import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getCoversationDetails } from "@/store/chatSlice";
import { chatSocket } from "@/lib/socket";
import { localService } from "@/shared/_session/local";
import { format, parseISO } from "date-fns";

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


            <h3 className="font-semibold text-sm">
              {chatVar?.profile?.firstName} {chatVar?.profile?.lastName}
            </h3>
          </Link>
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
                    className={`rounded-2xl px-3 py-2 ${message?.sender === localService?.get("role")
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                      }`}
                  >
                    <p className="text-sm leading-relaxed">{message.message}</p>
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
      <div className="bg-background border-t px-4 py-3 fixed bottom-0 left-0 right-0 z-10">
        <div className="flex gap-2 items-end">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 min-h-10 resize-none"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-10 w-10 flex-shrink-0"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileChat;
