import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { logAdminActivity } from '@/lib/admin/auth';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminReviews() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    device_name: '',
    rating: 5,
    review_text: '',
    location: '',
    is_featured: false,
    display_order: 0,
  });
  const { session } = useAdminAuth();
  const queryClient = useQueryClient();

  const { data: reviews } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('reviews').insert([data]);
      if (error) throw error;

      if (session) {
        await logAdminActivity({
          admin_user_id: session.user.id,
          action_type: 'create',
          table_name: 'reviews',
          after_data: data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success('Review created successfully');
      setIsAddDialogOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const { error } = await supabase.from('reviews').update(data).eq('id', id);
      if (error) throw error;

      if (session) {
        await logAdminActivity({
          admin_user_id: session.user.id,
          action_type: 'update',
          table_name: 'reviews',
          record_id: id,
          after_data: data,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success('Review updated successfully');
      setEditingReview(null);
      setIsAddDialogOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;

      if (session) {
        await logAdminActivity({
          admin_user_id: session.user.id,
          action_type: 'delete',
          table_name: 'reviews',
          record_id: id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast.success('Review deleted successfully');
    },
  });

  const resetForm = () => {
    setFormData({
      customer_name: '',
      device_name: '',
      rating: 5,
      review_text: '',
      location: '',
      is_featured: false,
      display_order: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      updateMutation.mutate({ id: editingReview.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reviews</h1>
          <p className="text-slate-500 mt-1">Manage customer reviews and testimonials</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingReview(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingReview ? 'Edit Review' : 'Add New Review'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer_name">Customer Name</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) =>
                      setFormData({ ...formData, customer_name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="device_name">Device Name</Label>
                  <Input
                    id="device_name"
                    value={formData.device_name}
                    onChange={(e) =>
                      setFormData({ ...formData, device_name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: parseInt(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review_text">Review Text</Label>
                <Textarea
                  id="review_text"
                  value={formData.review_text}
                  onChange={(e) =>
                    setFormData({ ...formData, review_text: e.target.value })
                  }
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_featured: checked })
                  }
                />
                <Label htmlFor="is_featured">Featured on Homepage</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingReview(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingReview ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reviews?.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{review.customer_name}</h3>
                    <Badge variant="outline">{review.device_name}</Badge>
                    {review.is_featured && <Badge variant="default">Featured</Badge>}
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-slate-500 ml-2">{review.location}</span>
                  </div>
                  <p className="text-slate-600">{review.review_text}</p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingReview(review);
                      setFormData({
                        customer_name: review.customer_name,
                        device_name: review.device_name,
                        rating: review.rating,
                        review_text: review.review_text,
                        location: review.location || '',
                        is_featured: review.is_featured,
                        display_order: review.display_order,
                      });
                      setIsAddDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this review?')) {
                        deleteMutation.mutate(review.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
