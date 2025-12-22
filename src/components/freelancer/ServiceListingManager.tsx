import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit2, Eye, MapPin, Star, Clock, DollarSign } from 'lucide-react';
import type { FreelancerService, ServiceCategory } from '@/types/freelancerTypes';
import freelancerData from '@/data/freelancerData.json';
import type { FreelancerData } from '@/types/freelancerTypes';

interface ServiceListingManagerProps {
  services: FreelancerService[];
  onServiceUpdate: (service: FreelancerService) => void;
  onServiceCreate: (service: Omit<FreelancerService, 'id'>) => void;
  onServiceToggle: (serviceId: string, isActive: boolean) => void;
}

export const ServiceListingManager: React.FC<ServiceListingManagerProps> = ({
  services,
  onServiceUpdate,
  onServiceCreate,
  onServiceToggle,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState<FreelancerService | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    basePrice: '',
    duration: '',
    location: '',
    skills: '',
  });

  const handleCreateService = () => {
    if (!formData.title || !formData.category || !formData.basePrice) {
      alert('Please fill in all required fields');
      return;
    }

    const newService: Omit<FreelancerService, 'id'> = {
      freelancerId: 'current_user',
      title: formData.title,
      description: formData.description,
      category: formData.category,
      basePrice: parseInt(formData.basePrice),
      duration: formData.duration,
      images: ['https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop'],
      location: formData.location,
      availability: ['weekdays', 'weekends'],
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      rating: 0,
      completedJobs: 0,
      isActive: true,
    };

    onServiceCreate(newService);
    setShowCreateForm(false);
    resetForm();
  };

  const handleUpdateService = () => {
    if (!editingService || !formData.title || !formData.category || !formData.basePrice) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedService: FreelancerService = {
      ...editingService,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      basePrice: parseInt(formData.basePrice),
      duration: formData.duration,
      location: formData.location,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
    };

    onServiceUpdate(updatedService);
    setEditingService(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      basePrice: '',
      duration: '',
      location: '',
      skills: '',
    });
  };

  const startEdit = (service: FreelancerService) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      category: service.category,
      basePrice: service.basePrice.toString(),
      duration: service.duration,
      location: service.location,
      skills: service.skills.join(', '),
    });
    setShowCreateForm(true);
  };

  if (showCreateForm) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {editingService ? 'Edit Service' : 'Create New Service'}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setShowCreateForm(false);
                setEditingService(null);
                resetForm();
              }}
            >
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Service Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Professional Wedding Photography"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(freelancerData as FreelancerData).serviceCategories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your service in detail..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Base Price (₹) *</label>
              <Input
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Duration</label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 4 hours"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Mumbai, Maharashtra"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Skills/Tags</label>
            <Input
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g., Photography, Editing, Portraits (comma separated)"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={editingService ? handleUpdateService : handleCreateService}>
              {editingService ? 'Update Service' : 'Create Service'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowCreateForm(false);
                setEditingService(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Services</h2>
          <p className="text-muted-foreground">Manage your service listings</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">No Services Yet</h3>
              <p className="text-muted-foreground">Create your first service listing to start receiving bookings</p>
            </div>
            <Button onClick={() => setShowCreateForm(true)}>
              Create Your First Service
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Switch
                    checked={service.isActive}
                    onCheckedChange={(checked) => onServiceToggle(service.id, checked)}
                  />
                </div>
                {!service.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">Inactive</Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold line-clamp-2">{service.title}</h4>
                    <Badge variant="outline" className="mt-1">
                      {service.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {service.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">₹{service.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{service.location}</span>
                    </div>
                    {service.rating > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{service.rating}</span>
                        <span className="text-muted-foreground">({service.completedJobs} jobs)</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => startEdit(service)}
                      className="flex-1"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};