import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ArrowLeft, Save, CheckCircle, XCircle, Clock, Users, Briefcase, Calendar, User } from 'lucide-react';
import { Category } from '@/types/categoryTypes';
import categoryData from '@/data/categoryData.json';
import { useToast } from '@/hooks/use-toast';

export const CategoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [category, setCategory] = useState<Category | null>(() => {
    return (categoryData as Category[]).find(c => c.id === id) || null;
  });
  
  const [editedCategory, setEditedCategory] = useState<Category | null>(category);
  const [adminNotes, setAdminNotes] = useState(category?.adminNotes || '');

  if (!category || !editedCategory) {
    return (
      <div className="h-screen bg-background flex overflow-hidden">
        <AdminSidebar
          activeTab="categories"
          setActiveTab={() => {}}
          onLogout={() => {}}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Category Not Found</h2>
            <p className="text-muted-foreground mb-4">The requested category could not be found.</p>
            <Button onClick={() => navigate('/admin?tab=categories')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'inactive':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setEditedCategory(prev => prev ? { ...prev, status: newStatus as any } : null);
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    setCategory(editedCategory);
    toast({
      title: "Category Updated",
      description: "Category details have been saved successfully",
    });
  };

  const handleApprove = () => {
    handleStatusChange('active');
    setAdminNotes(prev => prev + (prev ? '\n' : '') + `Approved on ${new Date().toLocaleString()}`);
    toast({
      title: "Category Approved",
      description: "Category has been approved and is now active",
    });
  };

  const handleReject = () => {
    handleStatusChange('inactive');
    setAdminNotes(prev => prev + (prev ? '\n' : '') + `Rejected on ${new Date().toLocaleString()}`);
    toast({
      title: "Category Rejected",
      description: "Category has been rejected",
    });
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar
        activeTab="categories"
        setActiveTab={() => {}}
        onLogout={() => {}}
      />
      
      <div className="flex-1 overflow-auto bg-background">
        <main className="p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin?tab=categories')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">Category Details</h1>
              <p className="text-muted-foreground">Manage category information and status</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Category Information
                    {getStatusIcon(editedCategory.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Category Name</Label>
                      <Input
                        id="name"
                        value={editedCategory.name}
                        onChange={(e) => setEditedCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select value={editedCategory.status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editedCategory.description}
                      onChange={(e) => setEditedCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Input
                      id="icon"
                      value={editedCategory.icon}
                      onChange={(e) => setEditedCategory(prev => prev ? { ...prev, icon: e.target.value } : null)}
                      placeholder="Icon name (e.g., wrench, camera, etc.)"
                    />
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
                    placeholder="Add internal notes about this category..."
                    rows={4}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
                
                {editedCategory.status === 'pending' && (
                  <>
                    <Button
                      onClick={handleApprove}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve Category
                    </Button>
                    <Button
                      onClick={handleReject}
                      variant="destructive"
                      className="flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Category
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusIcon(editedCategory.status)}
                    {getStatusBadge(editedCategory.status)}
                  </div>
                  
                  {editedCategory.requestedBy && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Requested by:</span>
                      </div>
                      <div className="ml-6">
                        <div className="font-medium">{editedCategory.requestedBy.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {editedCategory.requestedBy.type}
                        </Badge>
                      </div>
                    </div>
                  )}
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
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Services</span>
                    </div>
                    <span className="font-semibold">{editedCategory.totalServices}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Jobs</span>
                    </div>
                    <span className="font-semibold">{editedCategory.totalJobs}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Timestamps */}
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Created</div>
                      <div className="text-muted-foreground">
                        {new Date(editedCategory.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Last Updated</div>
                      <div className="text-muted-foreground">
                        {new Date(editedCategory.updatedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryDetails;