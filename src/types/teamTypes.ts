export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
  permissions: Record<string, { view: boolean; edit: boolean }>;
  createdBy: string;
  notes?: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface AdminPage {
  id: string;
  name: string;
  description: string;
}

export interface TeamFilters {
  status: string;
  department: string;
  role: string;
  search: string;
}