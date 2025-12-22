import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Eye, MessageCircle, Clock, Users, Archive, AlertTriangle, Loader2 } from 'lucide-react';
import { Conversation, ConversationFilters } from '@/types/messageTypes';
import messageData from '@/data/messageData.json';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 10;

export const MessageManagement: React.FC = () => {
  const [allConversations] = useState<Conversation[]>(messageData as Conversation[]);
  const [displayedConversations, setDisplayedConversations] = useState<Conversation[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [filters, setFilters] = useState<ConversationFilters>({
    status: 'all',
    priority: 'all',
    search: '',
    unreadOnly: false
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const observerRef = useRef<IntersectionObserver>();
  const lastConversationRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        loadMoreConversations();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isLoading, hasNextPage]);

  // Filter conversations based on current filters
  const getFilteredConversations = useCallback(() => {
    return allConversations.filter(conversation => {
      const matchesStatus = filters.status === 'all' || conversation.status === filters.status;
      const matchesPriority = filters.priority === 'all' || conversation.priority === filters.priority;
      const matchesSearch = conversation.participants.employer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        conversation.participants.freelancer.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (conversation.jobTitle && conversation.jobTitle.toLowerCase().includes(filters.search.toLowerCase())) ||
        (conversation.serviceTitle && conversation.serviceTitle.toLowerCase().includes(filters.search.toLowerCase()));
      const matchesUnread = !filters.unreadOnly || conversation.unreadCount > 0;
      
      return matchesStatus && matchesPriority && matchesSearch && matchesUnread;
    });
  }, [allConversations, filters]);

  // Load more conversations (simulate infinite scroll)
  const loadMoreConversations = useCallback(() => {
    if (isLoading || !hasNextPage) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const filteredConversations = getFilteredConversations();
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newConversations = filteredConversations.slice(startIndex, endIndex);
      
      if (newConversations.length > 0) {
        setDisplayedConversations(prev => [...prev, ...newConversations]);
        setCurrentPage(prev => prev + 1);
        setHasNextPage(endIndex < filteredConversations.length);
      } else {
        setHasNextPage(false);
      }
      
      setIsLoading(false);
    }, 500); // Simulate loading delay
  }, [currentPage, isLoading, hasNextPage, getFilteredConversations]);

  // Reset conversations when filters change
  useEffect(() => {
    const filteredConversations = getFilteredConversations();
    const initialConversations = filteredConversations.slice(0, ITEMS_PER_PAGE);
    
    setDisplayedConversations(initialConversations);
    setCurrentPage(2);
    setHasNextPage(filteredConversations.length > ITEMS_PER_PAGE);
  }, [filters, getFilteredConversations]);

  // Initial load
  useEffect(() => {
    const filteredConversations = getFilteredConversations();
    const initialConversations = filteredConversations.slice(0, ITEMS_PER_PAGE);
    
    setDisplayedConversations(initialConversations);
    setCurrentPage(2);
    setHasNextPage(filteredConversations.length > ITEMS_PER_PAGE);
  }, []);

  const stats = {
    total: allConversations.length,
    active: allConversations.filter(c => c.status === 'active').length,
    unread: allConversations.reduce((sum, c) => sum + c.unreadCount, 0),
    highPriority: allConversations.filter(c => c.priority === 'high').length
  };

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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleMarkAsRead = (conversationId: string) => {
    toast({
      title: "Marked as Read",
      description: "Conversation marked as read",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Message Management</h1>
        <p className="text-muted-foreground">Monitor and manage conversations between users</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.highPriority}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Conversations (Infinite Scroll Enabled)</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {displayedConversations.length} of {getFilteredConversations().length} conversations
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilters({ ...filters, priority: value })}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="unread"
                checked={filters.unreadOnly}
                onCheckedChange={(checked) => setFilters({ ...filters, unreadOnly: !!checked })}
              />
              <label htmlFor="unread" className="text-sm">Unread only</label>
            </div>
          </div>

          {/* Conversations Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participants</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Last Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-center">Messages</TableHead>
                  <TableHead className="text-center">Unread</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedConversations.map((conversation, index) => (
                  <TableRow 
                    key={conversation.id}
                    ref={index === displayedConversations.length - 1 ? lastConversationRef : null}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="flex -space-x-2">
                          <Avatar className="w-8 h-8 border-2 border-background">
                            <AvatarImage src={conversation.participants.employer.avatar} />
                            <AvatarFallback>{conversation.participants.employer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <Avatar className="w-8 h-8 border-2 border-background">
                            <AvatarImage src={conversation.participants.freelancer.avatar} />
                            <AvatarFallback>{conversation.participants.freelancer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{conversation.participants.employer.name}</div>
                          <div className="text-xs text-muted-foreground">{conversation.participants.freelancer.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{conversation.jobTitle || conversation.serviceTitle}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm">
                        <span className="font-medium">{conversation.lastMessage.senderName}: </span>
                        {conversation.lastMessage.content}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatTimeAgo(conversation.lastMessage.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(conversation.status)}</TableCell>
                    <TableCell>{getPriorityBadge(conversation.priority)}</TableCell>
                    <TableCell className="text-center">{conversation.totalMessages}</TableCell>
                    <TableCell className="text-center">
                      {conversation.unreadCount > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatTimeAgo(conversation.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {conversation.unreadCount > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(conversation.id)}
                            className="text-xs"
                          >
                            Mark Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/admin/messages/${conversation.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading more conversations...</span>
              </div>
            )}
            
            {/* End of data indicator */}
            {!hasNextPage && displayedConversations.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>You've reached the end of the conversations list.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};