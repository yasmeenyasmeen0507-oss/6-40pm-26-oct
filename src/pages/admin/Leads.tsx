import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Phone, 
  Search, 
  Download,
  ShieldCheck,
  Smartphone,
  FileText,
  Save,
  CheckCircle,
  XCircle,
  PhoneCall,
  IndianRupee,
  Package,
  Users,
  Clock
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

interface Lead {
  id: string;
  customer_name: string;
  phone_number: string;
  verified_phone?: string;
  is_phone_verified: boolean;
  final_price: number | null; // Changed to allow null
  created_at: string | null; // Changed to allow null
  lead_status: string;
  lead_notes?: string;
  converted_to_pickup: boolean;
  device?: {
    brand: { name: string };
    model_name: string;
  };
  variant?: {
    storage_gb: number;
  };
  city?: {
    name: string;
  };
  condition?: string;
  age_group?: string;
  device_powers_on?: boolean;
  display_condition?: string;
  body_condition?: string;
  can_make_calls?: boolean;
  is_touch_working?: boolean;
  is_screen_original?: boolean;
  is_battery_healthy?: boolean;
  has_charger?: boolean;
  has_box?: boolean;
  has_bill?: boolean;
  overall_condition?: string;
}

export default function AdminLeads() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          id,
          customer_name,
          phone_number,
          verified_phone,
          is_phone_verified,
          final_price,
          created_at,
          lead_status,
          lead_notes,
          converted_to_pickup,
          condition,
          age_group,
          device_powers_on,
          display_condition,
          body_condition,
          can_make_calls,
          is_touch_working,
          is_screen_original,
          is_battery_healthy,
          has_charger,
          has_box,
          has_bill,
          overall_condition,
          device:devices(
            brand:brands(name),
            model_name
          ),
          variant:variants(storage_gb),
          city:cities(name)
        `)
        .eq('converted_to_pickup', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        throw error;
      }

      console.log('📊 Leads fetched:', data?.length);
      return data as Lead[];
    },
    refetchInterval: 30000,
  });

  const updateLeadStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ lead_status: status })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Status updated successfully');
    },
    onError: (error) => {
      console.error('Status update error:', error);
      toast.error('Failed to update status');
    },
  });

  const updateLeadNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .update({ lead_notes: notes })
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-leads'] });
      toast.success('Notes saved successfully');
      setNotesDialogOpen(false);
      setSelectedLead(null);
      setNoteText('');
    },
    onError: (error) => {
      console.error('Notes update error:', error);
      toast.error('Failed to save notes');
    },
  });

  const handleOpenDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsDialogOpen(true);
  };

  const handleOpenNotes = (lead: Lead) => {
    setSelectedLead(lead);
    setNoteText(lead.lead_notes || '');
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = () => {
    if (!selectedLead) return;
    updateLeadNotesMutation.mutate({
      id: selectedLead.id,
      notes: noteText,
    });
  };

  const filteredLeads = leads?.filter((lead) => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      lead.customer_name?.toLowerCase().includes(search) ||
      lead.phone_number?.includes(search) ||
      lead.verified_phone?.includes(search) ||
      lead.device?.model_name?.toLowerCase().includes(search)
    );
  });

  // Calculate stats
  const totalLeads = filteredLeads?.length || 0;
  const newLeads = filteredLeads?.filter(l => l.lead_status === 'new').length || 0;
  const contactedLeads = filteredLeads?.filter(l => l.lead_status === 'contacted').length || 0;
  const completedLeads = filteredLeads?.filter(l => l.lead_status === 'completed').length || 0;
  const rejectedLeads = filteredLeads?.filter(l => l.lead_status === 'rejected').length || 0;
  
  // Revenue from completed leads only
  const completedRevenue = filteredLeads
    ?.filter(l => l.lead_status === 'completed')
    .reduce((sum, l) => sum + Number(l.final_price || 0), 0) || 0; // Null check added here as well

  const exportToCSV = () => {
    if (!filteredLeads || filteredLeads.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      const headers = ['Customer', 'Phone', 'Verified', 'Device', 'Price', 'Status', 'Notes', 'Created'];
      const rows = filteredLeads.map(lead => [
        lead.customer_name,
        lead.phone_number,
        lead.is_phone_verified ? 'Yes' : 'No',
        `${lead.device?.brand?.name || ''} ${lead.device?.model_name || ''} ${lead.variant?.storage_gb || ''}GB`,
        lead.final_price,
        lead.lead_status,
        lead.lead_notes || '',
        lead.created_at ? format(new Date(lead.created_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A', // Null check added
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${filteredLeads.length} leads`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      contacted: 'bg-blue-100 text-blue-800 border-blue-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[status] || 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Leads Management</h1>
          <p className="text-slate-500 mt-1">
            Customers who verified phone and saw price but didn't book pickup
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" disabled={!filteredLeads || filteredLeads.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Leads</div>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-slate-500">Not converted yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">New</div>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{newLeads}</div>
            <p className="text-xs text-slate-500">Need follow-up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Contacted</div>
            <PhoneCall className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{contactedLeads}</div>
            <p className="text-xs text-slate-500">Following up</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Completed</div>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{completedLeads}</div>
            <p className="text-xs text-slate-500">Deal closed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Rejected</div>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{rejectedLeads}</div>
            <p className="text-xs text-slate-500">Not interested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Revenue</div>
            <IndianRupee className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {/* Null check handled in completedRevenue calculation */}
              ₹{completedRevenue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-500">From leads</p>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, phone, or device..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !filteredLeads || filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium text-slate-500">No leads yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Leads will appear here when customers verify phone but don't book pickup
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      {/* Device Column - Clickable */}
                      <TableCell>
                        <button
                          onClick={() => handleOpenDetails(lead)}
                          className="text-left hover:bg-slate-50 p-2 rounded transition-colors w-full"
                        >
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-medium text-blue-600 hover:text-blue-800 hover:underline truncate">
                                {lead.device?.brand?.name} {lead.device?.model_name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {/* FIX 1: Add null check for final_price */}
                                {lead.variant?.storage_gb}GB • ₹{(lead.final_price || 0).toLocaleString('en-IN')}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5 truncate">
                                {lead.customer_name}
                              </div>
                            </div>
                          </div>
                        </button>
                      </TableCell>

                      {/* Phone Number Column */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-mono font-medium flex items-center gap-2">
                              <span>{lead.verified_phone || lead.phone_number}</span>
                              {lead.is_phone_verified && (
                                <ShieldCheck className="h-3 w-3 text-green-600 flex-shrink-0" title="Verified" />
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {/* FIX 2: Add null check for created_at */}
                              {lead.created_at ? formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Notes Column */}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenNotes(lead)}
                          className="h-9"
                        >
                          <FileText className={`h-4 w-4 ${lead.lead_notes ? 'text-blue-600' : 'text-slate-400'}`} />
                          {lead.lead_notes && (
                            <span className="ml-2 text-xs">View</span>
                          )}
                        </Button>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell>
                        <Select
                          value={lead.lead_status}
                          onValueChange={(value) => {
                            updateLeadStatusMutation.mutate({
                              id: lead.id,
                              status: value,
                            });
                          }}
                        >
                          <SelectTrigger className="w-[140px]">
                            <Badge variant="secondary" className={getStatusColor(lead.lead_status)}>
                              <SelectValue />
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-yellow-600" />
                                New
                              </div>
                            </SelectItem>
                            <SelectItem value="contacted">
                              <div className="flex items-center gap-2">
                                <PhoneCall className="w-3 h-3 text-blue-600" />
                                Contacted
                              </div>
                            </SelectItem>
                            <SelectItem value="rejected">
                              <div className="flex items-center gap-2">
                                <XCircle className="w-3 h-3 text-red-600" />
                                Rejected
                              </div>
                            </SelectItem>
                            <SelectItem value="completed">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                                Completed
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Lead Details</DialogTitle>
            <DialogDescription>
              Customer's device selection and answers
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedLead.device?.brand?.name} {selectedLead.device?.model_name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {selectedLead.variant?.storage_gb}GB • {selectedLead.customer_name}
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {/* FIX 3: Add null check for final_price in dialog */}
                  ₹{(selectedLead.final_price || 0).toLocaleString('en-IN')}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Device Condition</h3>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  {selectedLead.condition && (
                    <div className="flex justify-between">
                      <span className="text-slate-700">Condition:</span>
                      <Badge variant="outline" className="capitalize">{selectedLead.condition}</Badge>
                    </div>
                  )}
                  {selectedLead.age_group && (
                    <div className="flex justify-between">
                      <span className="text-slate-700">Age:</span>
                      <Badge variant="outline">{selectedLead.age_group}</Badge>
                    </div>
                  )}
                  {selectedLead.display_condition && (
                    <div className="flex justify-between">
                      <span className="text-slate-700">Display:</span>
                      <Badge variant="outline" className="capitalize">{selectedLead.display_condition}</Badge>
                    </div>
                  )}
                  {selectedLead.body_condition && (
                    <div className="flex justify-between">
                      <span className="text-slate-700">Body:</span>
                      <Badge variant="outline" className="capitalize">{selectedLead.body_condition}</Badge>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Powers On', value: selectedLead.device_powers_on },
                      { label: 'Can Call', value: selectedLead.can_make_calls },
                      { label: 'Touch Works', value: selectedLead.is_touch_working },
                      { label: 'Original Screen', value: selectedLead.is_screen_original },
                      { label: 'Battery OK', value: selectedLead.is_battery_healthy },
                      { label: 'Has Charger', value: selectedLead.has_charger },
                      { label: 'Has Box', value: selectedLead.has_box },
                      { label: 'Has Bill', value: selectedLead.has_bill },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        {item.value ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-100 p-3 rounded">
                <p><strong>Created:</strong> {selectedLead.created_at ? format(new Date(selectedLead.created_at), 'MMM dd, yyyy HH:mm:ss') : 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedLead.verified_phone || selectedLead.phone_number}</p>
                {selectedLead.city && <p><strong>City:</strong> {selectedLead.city.name}</p>}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Lead Notes</DialogTitle>
            <DialogDescription>
              Internal notes for follow-up
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add follow-up notes, customer preferences, best time to call, etc..."
              className="min-h-[150px]"
              rows={8}
            />
            <p className="text-xs text-slate-500">{noteText.length} characters</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNotesDialogOpen(false);
              setNoteText('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes} disabled={updateLeadNotesMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateLeadNotesMutation.isPending ? 'Saving...' : 'Save Notes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
