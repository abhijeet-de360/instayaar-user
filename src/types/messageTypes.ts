export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'employer' | 'freelancer' | 'admin';
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participants: {
    employer: {
      id: string;
      name: string;
      avatar?: string;
    };
    freelancer: {
      id: string;
      name: string;
      avatar?: string;
    };
  };
  jobTitle?: string;
  serviceTitle?: string;
  lastMessage: Message;
  totalMessages: number;
  unreadCount: number;
  status: 'active' | 'resolved' | 'archived';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
}

export interface ConversationFilters {
  status: string;
  priority: string;
  search: string;
  unreadOnly: boolean;
}