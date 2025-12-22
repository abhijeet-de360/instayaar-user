
export interface DisputeAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video';
}

export interface DisputeMessage {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: string;
}

export interface DisputeUser {
  id: string;
  name: string;
  email: string;
  role: 'employer' | 'freelancer';
}

export interface DisputeRelatedTo {
  type: 'booking' | 'payment' | 'service' | 'freelancer';
  id: string;
  reference: string;
}

export interface DisputeAssignee {
  id: string;
  name: string;
  email: string;
}

export interface Dispute {
  id: string;
  title: string;
  description: string;
  category: 'service_issue' | 'payment_issue' | 'quality_issue' | 'billing_issue' | 'behavior_issue' | 'other';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  submittedBy: DisputeUser;
  relatedTo: DisputeRelatedTo;
  submittedAt: string;
  updatedAt: string;
  assignedTo: DisputeAssignee | null;
  resolution: string | null;
  attachments: DisputeAttachment[];
  messages: DisputeMessage[];
}
