import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ArrowLeft, Send, Archive, AlertTriangle, Clock, Users, MessageCircle, Paperclip } from 'lucide-react';
import { Conversation, Message } from '@/types/messageTypes';
import messageData from '@/data/messageData.json';
import conversationMessages from '@/data/conversationMessages.json';
import { useToast } from '@/hooks/use-toast';

export const MessageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [conversation, setConversation] = useState<Conversation | null>(() => {
    return (messageData as Conversation[]).find(c => c.id === id) || null;
  });
  
  const [messages] = useState<Message[]>(() => {
    const messagesData = conversationMessages as Record<string, Message[]>;
    return messagesData[id || ''] || [];
  });
  
  const [adminNotes, setAdminNotes] = useState(conversation?.adminNotes || '');
  const [adminMessage, setAdminMessage] = useState('');

  if (!conversation) {
    return (
      <div className="h-screen bg-background flex overflow-hidden">
        <AdminSidebar
          activeTab="messages"
          setActiveTab={() => {}}
          onLogout={() => {}}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Conversation Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested conversation could not be found.</p>
            <Button onClick={() => navigate('/admin?tab=messages')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Messages
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'resolved':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Resolved</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Archived</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 border-red-200">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Low</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setConversation(prev => prev ? { ...prev, status: newStatus as any } : null);
    toast({
      title: "Status Updated",
      description: `Conversation status changed to ${newStatus}`,
    });
  };

  const handlePriorityChange = (newPriority: string) => {
    setConversation(prev => prev ? { ...prev, priority: newPriority as any } : null);
    toast({
      title: "Priority Updated",
      description: `Conversation priority changed to ${newPriority}`,
    });
  };

  const handleSendAdminMessage = () => {
    if (!adminMessage.trim()) return;
    
    // In a real app, this would send the message
    toast({
      title: "Message Sent",
      description: "Admin message sent to participants",
    });
    setAdminMessage('');
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSenderTypeColor = (senderType: string) => {
    switch (senderType) {
      case 'employer':
        return 'text-blue-600';
      case 'freelancer':
        return 'text-green-600';
      case 'admin':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar
        activeTab="messages"
        setActiveTab={() => {}}
        onLogout={() => {}}
      />
      
      <div className="flex-1 overflow-auto bg-background">
        <main className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin?tab=messages')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Messages
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Conversation Details</h1>
              <p className="text-muted-foreground">Monitor and manage user conversation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Messages Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Conversation Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      {conversation.jobTitle || conversation.serviceTitle}
                    </CardTitle>
                    <div className="flex gap-2">
                      {getStatusBadge(conversation.status)}
                      {getPriorityBadge(conversation.priority)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.participants.employer.avatar} />
                          <AvatarFallback>{conversation.participants.employer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{conversation.participants.employer.name}</div>
                          <div className="text-sm text-blue-600">Employer</div>
                        </div>
                      </div>
                      
                      <div className="text-muted-foreground">↔</div>
                      
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={conversation.participants.freelancer.avatar} />
                          <AvatarFallback>{conversation.participants.freelancer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{conversation.participants.freelancer.name}</div>
                          <div className="text-sm text-green-600">Freelancer</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Messages */}
              <Card>
                <CardHeader>
                  <CardTitle>Messages ({messages.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {messages.map((message) => (
                      <div key={message.id} className="flex space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {message.senderName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-medium text-sm ${getSenderTypeColor(message.senderType)}`}>
                              {message.senderName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {message.senderType}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(message.timestamp)}
                            </span>
                            {!message.isRead && (
                              <Badge variant="destructive" className="text-xs">New</Badge>
                            )}
                          </div>
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm">{message.content}</p>
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {message.attachments.map((attachment, index) => (
                                  <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Paperclip className="w-3 h-3" />
                                    {attachment}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Admin Message Input */}
              <Card>
                <CardHeader>
                  <CardTitle>Send Admin Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      value={adminMessage}
                      onChange={(e) => setAdminMessage(e.target.value)}
                      placeholder="Type your admin message here..."
                      rows={3}
                    />
                    <Button onClick={handleSendAdminMessage} className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Status Management */}
              <Card>
                <CardHeader>
                  <CardTitle>Manage Conversation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Status</label>
                    <Select value={conversation.status} onValueChange={handleStatusChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <Select value={conversation.priority} onValueChange={handlePriorityChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Total Messages</span>
                    </div>
                    <span className="font-semibold">{conversation.totalMessages}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Unread</span>
                    </div>
                    <span className="font-semibold">{conversation.unreadCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Created</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(conversation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this conversation..."
                    rows={4}
                  />
                  <Button className="mt-4 w-full" size="sm">
                    Save Notes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MessageDetails;