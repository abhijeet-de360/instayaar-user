import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Paperclip, Phone, Video } from "lucide-react";
import MobileMessages from "@/components/mobile/MobileMessages";
import { LoginModal } from "@/components/auth/LoginModal";

const Messages = () => {
  const { setUserRole, setIsLoggedIn, isLoggedIn } = useUserRole();
  const [isMobile, setIsMobile] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    setShowLoginModal(false);
  };

  // Check if user is logged in, show login modal if not
  useEffect(() => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  }, [isLoggedIn]);

  // Use mobile component on small screens
  if (isMobile) {
    return (
      <>
        <MobileMessages />

      </>
    );
  }

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Chef",
      lastMessage: "I can definitely help with the Italian cuisine. When do you need it?",
      timestamp: "2 min ago",
      unread: 2,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
      online: true
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "DJ",
      lastMessage: "Thanks for considering my application. Looking forward to hearing from you.",
      timestamp: "1 hour ago",
      unread: 0,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b2c0c8e8?auto=format&fit=crop&w=300&h=300&q=80",
      online: false
    },
    {
      id: 3,
      name: "Anita Reddy",
      role: "Bartender",
      lastMessage: "I have experience with corporate events. Happy to discuss further.",
      timestamp: "3 hours ago",
      unread: 1,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80",
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Rajesh Kumar",
      content: "Hi! I saw your job posting for Italian cuisine. I have 8+ years experience in Italian cooking.",
      timestamp: "10:30 AM",
      isMe: false
    },
    {
      id: 2,
      sender: "You",
      content: "Great! Can you tell me more about your experience with events?",
      timestamp: "10:32 AM",
      isMe: true
    },
    {
      id: 3,
      sender: "Rajesh Kumar",
      content: "I've catered for 50+ private events, including birthday parties, anniversaries, and corporate dinners. I can handle 20 people easily.",
      timestamp: "10:35 AM",
      isMe: false
    },
    {
      id: 4,
      sender: "You",
      content: "Perfect! What would be your rate for this event?",
      timestamp: "10:36 AM",
      isMe: true
    },
    {
      id: 5,
      sender: "Rajesh Kumar",
      content: "I can definitely help with the Italian cuisine. When do you need it?",
      timestamp: "10:38 AM",
      isMe: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onLogin={handleLogin} />

      {/* <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto h-[calc(100vh-200px)]">
          <h1 className="text-3xl font-bold mb-8">Messages</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <Card className="md:col-span-1">
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className="flex items-center gap-3 p-4 hover:bg-muted cursor-pointer border-b"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conversation.avatar} />
                          <AvatarFallback>{conversation.name[0]}</AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold truncate">{conversation.name}</h4>
                          <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                          {conversation.unread > 0 && (
                            <Badge variant="destructive" className="text-xs px-2 py-1">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs mt-1">{conversation.role}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80" />
                      <AvatarFallback>RK</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">Rajesh Kumar</h3>
                      <p className="text-sm text-muted-foreground">Chef • Online</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.isMe 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1"
                  />
                  <Button size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div> */}
      <p className="text-center pt-5">No Messages</p>
      <MobileBottomNav />

      {/* <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLogin}
        isMobile={false}
      /> */}
    </div>
  );
};

export default Messages;