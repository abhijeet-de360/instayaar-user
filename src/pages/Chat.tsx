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
import MobileChat from "@/components/mobile/MobileChat";

const Chat = () => {
  const { freelancerId } = useParams();
  const navigate = useNavigate();
  const { setUserRole, setIsLoggedIn } = useUserRole();
  const [isMobile, setIsMobile] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // Mock messages - moved before early return
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: freelancerId,
      senderName: "Arjun Mehta",
      message: "Hi! Thank you for considering my application for the DJ position.",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      senderId: "employer",
      senderName: "You",
      message: "Hello! I saw your proposal and I'm interested. Can you tell me more about your equipment?",
      timestamp: "10:32 AM",
      isOwn: true
    },
    {
      id: 3,
      senderId: freelancerId,
      senderName: "Arjun Mehta",
      message: "Absolutely! I have professional Pioneer DJ equipment including CDJ-2000s, DJM-900 mixer, and a full sound system with speakers and lighting.",
      timestamp: "10:35 AM",
      isOwn: false
    },
    {
      id: 4,
      senderId: "employer",
      senderName: "You",
      message: "That sounds perfect! What about your music collection?",
      timestamp: "10:37 AM",
      isOwn: true
    },
    {
      id: 5,
      senderId: freelancerId,
      senderName: "Arjun Mehta",
      message: "I have an extensive collection of Bollywood hits, international music, and can take special requests. I always customize the playlist based on the event and audience.",
      timestamp: "10:40 AM",
      isOwn: false
    }
  ]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLogin = (role: string) => {
    setIsLoggedIn(true);
    setUserRole(role as 'employer' | 'freelancer');
  };

  // Mock freelancer data
  const freelancer = {
    id: freelancerId,
    name: "Arjun Mehta",
    service: "DJ",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80",
    isOnline: true
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        senderId: "employer",
        senderName: "You",
        message: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      };
      setMessages([...messages, message]);
      setNewMessage("");
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
                <AvatarImage src={freelancer.image} alt={freelancer.name} />
                <AvatarFallback>{freelancer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-semibold">{freelancer.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {freelancer.isOnline ? "Online" : "Last seen recently"} • {freelancer.service}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost">
                  <Video className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.isOwn ? 'order-2' : 'order-1'}`}>
                  <div 
                    className={`rounded-lg p-3 ${
                      message.isOwn 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 ${
                    message.isOwn ? 'text-right' : 'text-left'
                  }`}>
                    {message.timestamp}
                  </p>
                </div>
                
                {!message.isOwn && (
                  <Avatar className="h-8 w-8 order-1 mr-2">
                    <AvatarImage src={freelancer.image} alt={freelancer.name} />
                    <AvatarFallback className="text-xs">{freelancer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <Card className="rounded-none border-x-0 border-b-0">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Don't show MobileBottomNav in chat - commented out */}
      {/* <MobileBottomNav /> */}
    </div>
  );
};

export default Chat;