import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Edit, Shield, Eye, User, Mail, Phone, Calendar, Building } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { TeamMember } from '@/types/teamTypes';
import teamData from '@/data/teamData.json';
import { useToast } from '@/hooks/use-toast';

export const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [member, setMember] = useState<TeamMember | null>(null);
  const [editedMember, setEditedMember] = useState<TeamMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const foundMember = teamData.team.find(m => m.id === id);
    if (foundMember) {
      setMember(foundMember as TeamMember);
      setEditedMember(foundMember as TeamMember);
    }
  }, [id]);

  if (!member) {
    return (
      <div className="flex h-screen bg-background">
        <AdminSidebar activeTab="settings" setActiveTab={() => {}} onLogout={() => navigate('/admin/login')} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Team Member Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested team member could not be found.</p>
            <Button onClick={() => navigate('/admin?tab=settings')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Shield className="w-4 h-4 text-green-600" />;
      case 'inactive': return <Shield className="w-4 h-4 text-gray-500" />;
      case 'pending': return <Shield className="w-4 h-4 text-yellow-600" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleSave = () => {
    // Simulate saving changes
    setMember(editedMember);
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Team member details have been updated successfully.",
    });
  };

  const handlePermissionChange = (pageId: string, type: 'view' | 'edit', value: boolean) => {
    if (!editedMember) return;
    
    setEditedMember({
      ...editedMember,
      permissions: {
        ...editedMember.permissions,
        [pageId]: {
          ...editedMember.permissions[pageId],
          [type]: value
        }
      }
    });
  };

  const handleStatusChange = (newStatus: 'active' | 'inactive' | 'pending') => {
    if (!editedMember) return;
    
    setEditedMember({
      ...editedMember,
      status: newStatus,
      lastActive: newStatus === 'active' ? new Date().toISOString() : editedMember.lastActive
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab="settings" setActiveTab={() => {}} onLogout={() => navigate('/admin/login')} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => navigate('/admin?tab=settings')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Team
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">{member.name}</h1>
                  <p className="text-muted-foreground">{member.role} • {member.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Member
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Member Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Basic Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(member.status)}
                          {getStatusBadge(member.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Member since {new Date(member.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        {isEditing ? (
                          <Input
                            value={editedMember?.name || ''}
                            onChange={(e) => setEditedMember(prev => prev ? {...prev, name: e.target.value} : null)}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{member.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Email Address</Label>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={editedMember?.email || ''}
                            onChange={(e) => setEditedMember(prev => prev ? {...prev, email: e.target.value} : null)}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{member.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        {isEditing ? (
                          <Input
                            value={editedMember?.phone || ''}
                            onChange={(e) => setEditedMember(prev => prev ? {...prev, phone: e.target.value} : null)}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Role</Label>
                        {isEditing ? (
                          <Input
                            value={editedMember?.role || ''}
                            onChange={(e) => setEditedMember(prev => prev ? {...prev, role: e.target.value} : null)}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            <span>{member.role}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Department</Label>
                        {isEditing ? (
                          <Input
                            value={editedMember?.department || ''}
                            onChange={(e) => setEditedMember(prev => prev ? {...prev, department: e.target.value} : null)}
                          />
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span>{member.department}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Status</Label>
                        {isEditing ? (
                          <div className="flex space-x-2">
                            <Button
                              variant={editedMember?.status === 'active' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusChange('active')}
                            >
                              Active
                            </Button>
                            <Button
                              variant={editedMember?.status === 'inactive' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusChange('inactive')}
                            >
                              Inactive
                            </Button>
                            <Button
                              variant={editedMember?.status === 'pending' ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => handleStatusChange('pending')}
                            >
                              Pending
                            </Button>
                          </div>
                        ) : (
                          <div>{getStatusBadge(member.status)}</div>
                        )}
                      </div>
                    </div>

                    {(member.notes || isEditing) && (
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        {isEditing ? (
                          <Textarea
                            value={editedMember?.notes || ''}
                            onChange={(e) => setEditedMember(prev => prev ? {...prev, notes: e.target.value} : null)}
                            placeholder="Add notes about this team member..."
                          />
                        ) : (
                          <p className="text-sm">{member.notes}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Permissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="w-5 h-5" />
                      <span>Access Permissions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {teamData.adminPages.map((page) => (
                        <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{page.name}</h4>
                            <p className="text-sm text-muted-foreground">{page.description}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">View</span>
                              <Switch
                                checked={editedMember?.permissions[page.id]?.view || false}
                                onCheckedChange={(checked) => handlePermissionChange(page.id, 'view', checked)}
                                disabled={!isEditing}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Edit className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Edit</span>
                              <Switch
                                checked={editedMember?.permissions[page.id]?.edit || false}
                                onCheckedChange={(checked) => handlePermissionChange(page.id, 'edit', checked)}
                                disabled={!isEditing || !editedMember?.permissions[page.id]?.view}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Activity & Stats */}
              <div className="space-y-6">
                {/* Current Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Current Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      {getStatusBadge(member.status)}
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Active</span>
                      <span className="text-sm">{new Date(member.lastActive).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Join Date</span>
                      <span className="text-sm">{new Date(member.joinDate).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Permission Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Permission Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Pages</span>
                      <span className="text-sm font-medium">{teamData.adminPages.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">View Access</span>
                      <span className="text-sm font-medium">
                        {Object.values(member.permissions).filter(p => p.view).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Edit Access</span>
                      <span className="text-sm font-medium">
                        {Object.values(member.permissions).filter(p => p.edit).length}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};