import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Send, MessageCircle, Bot, User, Shield, Paperclip, FileText, Play, ExternalLink, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { service } from "@/shared/_services/api_service";
import { chatSocket } from "@/lib/socket";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface ISupportAttachment {
  url: string;
  type: "image" | "video" | "pdf" | "other";
  name: string;
}

interface Message {
  id: string;
  senderId: string;
  senderType: "user" | "freelancer" | "admin" | "ai";
  content: string;
  attachments?: ISupportAttachment[];
  options?: string[];
  timestamp: string;
  isAi: boolean;
}

const SupportChatInterface = () => {
  const navigate = useNavigate();
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchChat = async () => {
    try {
      const resp = await service.startSupportChat();
      setChat(resp.data);
      setMessages(resp.data.messages);
    } catch (err) {
      console.error("Error starting support chat", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    if (chat?._id) {
      chatSocket.on(`support-chat-${chat._id}`, (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });
      chatSocket.on(`support-chat-status-${chat._id}`, ({ status }: { status: string }) => {
        setChat((prev: any) => ({ ...prev, status }));
        if (status === "resolved") {
          toast.success("This conversation has been marked as resolved.");
        }
      });
      return () => {
        chatSocket.off(`support-chat-${chat._id}`);
        chatSocket.off(`support-chat-status-${chat._id}`);
      };
    }
  }, [chat?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string, attachments?: ISupportAttachment[]) => {
    if ((!content.trim() && (!attachments || attachments.length === 0)) || !chat?._id || chat?.status === "resolved") return;
    try {
      const resp = await service.sendSupportMessage({
        chatId: chat._id,
        content: content,
        attachments: attachments,
      });
      setChat(resp.data);
      setMessages(resp.data.messages);
      setInputValue("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      toast.error("File size exceeds 1MB limit");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    try {
      const resp = await service.uploadSupportAttachment(file);
      const attachment: ISupportAttachment = resp.data;
      handleSendMessage(`Sent a ${attachment.type}`, [attachment]);
    } catch (err) {
      console.error("Error uploading file", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleOptionClick = (option: string) => {
    handleSendMessage(option);
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground italic animate-pulse">Initializing Secure Connection...</div>;
  }

  const lastMessage = messages[messages.length - 1];
  const showOptions = lastMessage?.senderType === "ai" && !chat?.isWithAdmin;
  const currentOptions = showOptions ? (lastMessage?.options || []) : [];

  return (
    <div className="flex flex-col h-screen w-full mx-auto bg-background overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between ">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h3 className="font-bold">
              InstaYaar Support
            </h3>
            <p className="text-xs opacity-80 flex items-center gap-1">
              {chat?.isWithAdmin ? (
                <><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Admin Online</>
              ) : (
                <>AI Assistant</>
              )}
            </p>
          </div>
        </div>
        {chat?.status === "resolved" && (
           <Badge variant="outline" className="bg-green-500/20 text-green-100 border-none">Resolved</Badge>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((msg, index) => {
          const isOwn = msg.senderType !== "ai" && msg.senderType !== "admin";
          const isAi = msg.senderType === "ai";
          const isAdmin = msg.senderType === "admin";

          return (
            <div key={index} className={`flex ${isOwn ? "justify-end" : "justify-start animate-in fade-in slide-in-from-bottom-2"}`}>
              <div className={`flex items-end gap-2 max-w-[85%] ${isOwn ? "flex-row-reverse" : ""}`}>
                <div 
                  className={`p-3 rounded-2xl shadow-sm text-sm ${
                    isOwn ? "bg-primary text-primary-foreground rounded-br-none" 
                    : "bg-blue-50 border-blue-100 border rounded-bl-none"
                  }`}
                >
                  {msg.content}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.attachments.map((at, i) => (
                        <div key={i} className="overflow-hidden rounded-lg border bg-background/50">
                          {at.type === "image" ? (
                            <img src={at.url} alt={at.name} className="max-w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(at.url, '_blank')} />
                          ) : at.type === "video" ? (
                            <div className="relative group cursor-pointer" onClick={() => window.open(at.url, '_blank')}>
                              <video src={at.url} className="max-w-full h-auto" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                                <Play className="h-10 w-10 text-white fill-white" />
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => window.open(at.url, '_blank')}>
                              {at.type === "pdf" ? <FileText className="h-8 w-8 text-red-500" /> : <FileText className="h-8 w-8 text-blue-500" />}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{at.name}</p>
                                <p className="text-[10px] text-muted-foreground uppercase">{at.type}</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Footer / Input */}
      <div className="p-4 bg-white border-t space-y-3">
        {chat?.status === "resolved" ? (
          <div className="bg-green-50 border border-green-100 p-3 rounded-xl text-center">
            <p className="text-sm font-medium text-green-800 flex items-center justify-center gap-2">
              This conversation has been marked as resolved.
            </p>
            <p className="text-[10px] text-green-600 mt-1">Thank you for contacting InstaYaar Support!</p>
          </div>
        ) : (
          <>
            {showOptions && currentOptions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {currentOptions.map((opt) => (
                  <Button 
                    key={opt} 
                    variant="outline" 
                    size="sm" 
                    className="rounded-full text-xs hover:bg-primary/5 hover:text-primary transition-all active:scale-95"
                    onClick={() => handleOptionClick(opt)}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            )}

            <div className="flex gap-2 items-center">
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
                accept="image/*,video/*,application/pdf"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-full h-10 w-10 shrink-0 text-muted-foreground hover:text-primary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
              </Button>
              <Input 
                placeholder={chat?.isWithAdmin ? "Describe your issue..." : "Select an option or ask a question..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage(inputValue)}
                className="rounded-full bg-muted/50 focus-visible:ring-primary h-10"
              />
              <Button 
                size="icon" 
                className="rounded-full h-10 w-10 shrink-0 shadow-md"
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || uploading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupportChatInterface;
