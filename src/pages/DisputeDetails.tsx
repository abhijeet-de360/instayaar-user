import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertTriangle, Send, Paperclip, Download, User, Shield } from 'lucide-react';
import disputeData from '@/data/disputeData.json';
import { useToast } from '@/hooks/use-toast';
import type { Dispute, DisputeMessage } from '@/types/disputeTypes';

export const DisputeDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const dispute = disputeData.disputes.find(d => d.id === id) as Dispute;
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'resolved' | 'closed'>(
    (dispute?.status as 'pending' | 'in_progress' | 'resolved' | 'closed') || 'pending'
  );
  const [resolution, setResolution] = useState(dispute?.resolution || '');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<DisputeMessage[]>(dispute?.messages || []);

  if (!dispute) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Dispute Not Found</h2>
        <p className="text-muted-foreground mb-4">The dispute you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/admin?tab=disputes')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Disputes
        </Button>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    toast({
      title: "Status Updated",
      description: `Dispute status has been updated to ${status.replace('_', ' ')}`,
    });
  };

  const handleResolutionUpdate = () => {
    toast({
      title: "Resolution Updated",
      description: "Dispute resolution has been saved",
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: DisputeMessage = {
      id: `MSG-${Date.now()}`,
      content: newMessage,
      sender: 'admin',
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, message]);
    setNewMessage('');
    
    toast({
      title: "Message Sent",
      description: "Your reply has been sent to the user",
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-orange-100 text-orange-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      service_issue: 'bg-purple-100 text-purple-800',
      payment_issue: 'bg-red-100 text-red-800',
      quality_issue: 'bg-orange-100 text-orange-800',
      billing_issue: 'bg-blue-100 text-blue-800',
      behavior_issue: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatCategory = (category: string) => {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin?tab=disputes')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Disputes
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{dispute.title}</h1>
            <p className="text-muted-foreground">{dispute.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusIcon(dispute.status)}
          <Badge className={getStatusBadge(dispute.status)}>
            {dispute.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispute Information */}
          <Card>
            <CardHeader>
              <CardTitle>Dispute Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-muted-foreground">{dispute.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Category</h4>
                  <Badge className={getCategoryBadge(dispute.category)}>
                    {formatCategory(dispute.category)}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Priority</h4>
                  <Badge className={getPriorityBadge(dispute.priority)}>
                    {dispute.priority.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Related To</h4>
                  <p className="text-sm">{dispute.relatedTo.reference}</p>
                  <p className="text-xs text-muted-foreground">Type: {dispute.relatedTo.type}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Submitted Date</h4>
                  <p className="text-sm">{new Date(dispute.submittedAt).toLocaleString()}</p>
                </div>
              </div>

              {dispute.attachments && dispute.attachments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Attachments</h4>
                  <div className="space-y-2">
                    {dispute.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center space-x-2 p-2 border rounded">
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm flex-1">{attachment.name}</span>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Messages & Communication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md p-3 rounded-lg ${
                        message.sender === 'admin'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {message.sender === 'admin' ? (
                          <Shield className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        <span className="text-xs opacity-70">
                          {message.sender === 'admin' ? 'Admin' : 'User'}
                        </span>
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="mb-4" />

              {/* Reply Form */}
              <div className="space-y-3">
                <h4 className="font-semibold">Send Reply</h4>
                <Textarea
                  placeholder="Type your reply to the user..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach File
                  </Button>
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle>Submitted By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold">{dispute.submittedBy.name}</p>
                  <p className="text-sm text-muted-foreground">{dispute.submittedBy.email}</p>
                  <Badge variant="outline" className="mt-1">
                    {dispute.submittedBy.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle>Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Update Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'pending' | 'in_progress' | 'resolved' | 'closed')}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <Button onClick={handleStatusUpdate} className="w-full mt-2" size="sm">
                  Update Status
                </Button>
              </div>

              {dispute.assignedTo && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Assigned To</label>
                  <p className="text-sm">{dispute.assignedTo.name}</p>
                  <p className="text-xs text-muted-foreground">{dispute.assignedTo.email}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resolution */}
          <Card>
            <CardHeader>
              <CardTitle>Resolution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Resolution Notes</label>
                <Textarea
                  placeholder="Enter resolution details..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleResolutionUpdate} className="w-full mt-2" size="sm">
                  Save Resolution
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" size="sm">
                View Related Booking
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Contact User
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Export Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetails;
