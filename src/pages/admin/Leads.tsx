import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
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
  Users,
  Clock,
  Laptop,
  MapPin,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

interface Lead {
  id: string;
  customer_name: string;
  brand_name?:  string | null;
  phone_number: string;
  verified_phone?: string | null;
  is_phone_verified: boolean;
  final_price:  number | null;
  created_at: string | null;
  lead_status: string | null;
  lead_notes?: string | null;
  converted_to_pickup: boolean;
  device?: {
    brand?:  { name?:  string } | null;
    model_name?: string | null;
  } | null;
  variant?: { storage_gb?: number | null } | null;
  city?: { name?: string | null } | null;
  condition?: string | null;
  age_group?: string | null;
  device_powers_on?: boolean | null;
  display_condition?: string | null;
  body_condition?: string | null;
  can_make_calls?: boolean | null;
  is_touch_working?: boolean | null;
  is_screen_original?: boolean | null;
  is_battery_healthy?: boolean | null;
  has_charger?:  boolean | null;
  has_box?: boolean | null;
  has_bill?: boolean | null;
  overall_condition?: string | null;
}

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-white text-red-600 border-red-200 animate-pulse shadow-sm" },
  { value: "RNR", label: "RNR", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "Not interested", label: "Not Interested", color: "bg-gray-50 text-gray-700 border-gray-200" },
  { value: "Scheduled", label: "Scheduled", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "Reschedule", label: "Reschedule", color: "bg-orange-50 text-orange-700 border-orange-200" },
];
const statusMap = Object.fromEntries(STATUS_OPTIONS.map(s => [s.value, s]));
const getStatusColor = (status: string | null) => statusMap[status || 'new']?.color || "bg-gray-50 text-gray-500 border-gray-200";
const getStatusLabel = (status: string | null) => statusMap[status || 'new']?.label || status || 'New';

export default function AdminLeads() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select(`
          id,
          customer_name,
          brand_name,
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
          device:  devices(
            brand:  brands(name),
            model_name
          ),
          variant: variants(storage_gb),
          city:cities(name)
        `)
        .eq("converted_to_pickup", false)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching leads:", error);
        throw error;
      }

      const transformed = data?.map((lead: any) => {
        const rawDevice = Array.isArray(lead.device) ? lead.device[0] :  lead.device ??  null;
        const rawVariant = Array.isArray(lead.variant) ? lead.variant[0] : lead.variant ??  null;
        const rawCity = Array.isArray(lead.city) ? lead.city[0] : lead.city ?? null;
        const rawBrand = rawDevice?.brand;
        let brandObj = null;
        if (Array.isArray(rawBrand)) brandObj = rawBrand[0] ??  null;
        else if (rawBrand) brandObj = rawBrand;
        return {
          ...lead,
          device: rawDevice
            ? {
                model_name: rawDevice.model_name ??  null,
                brand: brandObj ? { name: brandObj.name ??  null } : null,
              }
            : null,
          variant: rawVariant ?  { storage_gb: rawVariant.storage_gb ?? null } :  null,
          city: rawCity ? { name: rawCity.name ?? null } : null,
        };
      });

      return transformed as Lead[];
    },
    refetchInterval: 30000,
  });

  const updateLeadStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id:  string; status: string }) => {
      const { data, error } = await supabase
        .from("leads")
        .update({ lead_status: status })
        .eq("id", id)
        .select();
      
      if (error) throw error;
      
      if (! data || data.length === 0) {
        throw new Error("Update failed: Permission denied or row not found.");
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-leads"] });
      toast.success("Status updated successfully");
    },
    onError: (error) => {
      console.error("Status update error:", error);
      toast.error(error.message || "Failed to update status");
    },
  });

  const updateLeadNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes:  string }) => {
      const { data, error } = await supabase
        .from("leads")
        .update({ lead_notes: notes })
        .eq("id", id)
        .select();

      if (error) throw error;

      if (!data || data. length === 0) {
        throw new Error("Update failed: Permission denied or row not found.");
      }

      return data[0];
    },
    onSuccess:  () => {
      queryClient. invalidateQueries({ queryKey:  ["admin-leads"] });
      toast.success("Notes saved successfully");
      setNotesDialogOpen(false);
      setSelectedLead(null);
      setNoteText("");
    },
    onError: (error) => {
      console.error("Notes update error:", error);
      toast.error(error.message || "Failed to save notes");
    },
  });

  const handleOpenDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setDetailsDialogOpen(true);
  };
  const handleOpenNotes = (lead: Lead) => {
    setSelectedLead(lead);
    setNoteText(lead.lead_notes || "");
    setNotesDialogOpen(true);
  };
  const handleSaveNotes = () => {
    if (! selectedLead) return;
    updateLeadNotesMutation. mutate({
      id: selectedLead. id,
      notes: noteText,
    });
  };

  const filteredLeads = leads?.filter((lead) => {
    if (! searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      lead.customer_name?. toLowerCase().includes(search) ||
      lead.brand_name?.toLowerCase().includes(search) ||
      lead.phone_number?.includes(search) ||
      lead.verified_phone?.includes(search) ||
      lead.device?.model_name?.toLowerCase().includes(search) ||
      lead.city?.name?.toLowerCase().includes(search)
    );
  });

  const newLeads = filteredLeads?. filter((l) => (l.lead_status === "new" || ! l.lead_status)).length || 0;
  const rnrLeads = filteredLeads?.filter((l) => l.lead_status === "RNR").length || 0;
  const scheduledLeads = filteredLeads?.filter((l) => l.lead_status === "Scheduled").length || 0;
  const rescheduleLeads = filteredLeads?.filter((l) => l.lead_status === "Reschedule").length || 0;
  const notInterestedLeads = filteredLeads?.filter((l) => l.lead_status === "Not interested").length || 0;

  const exportToCSV = () => {
    if (!filteredLeads || filteredLeads.length === 0) {
      toast.error("No data to export");
      return;
    }
    try {
      const headers = ["#", "Customer", "Brand", "Phone", "Verified", "Device", "City", "Price", "Status", "Notes", "Created"];
      const rows = filteredLeads.map((lead, idx) => [
        idx + 1,
        lead.customer_name,
        lead.brand_name || "N/A",
        lead.phone_number,
        lead.is_phone_verified ? "Yes" : "No",
        `${lead.device?.brand?.name || ""} ${lead.device?.model_name || ""} ${lead.variant?.storage_gb || ""}GB`,
        lead.city?.name || "N/A",
        lead.final_price ??  "N/A",
        lead. lead_status || "new",
        lead.lead_notes || "",
        lead.created_at ?  format(new Date(lead.created_at), "yyyy-MM-dd HH:mm:ss") : "N/A",
      ]);
      const csvContent = [headers. join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leads-${format(new Date(), "yyyy-MM-dd-HHmmss")}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Exported ${filteredLeads. length} leads`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  const isSimplifiedLaptopLead = (lead: Lead) => lead.brand_name && ! lead.device?. model_name;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-500 mt-1">Customers who verified phone and saw price but didn't book pickup</p>
        </div>
        <Button 
          onClick={exportToCSV} 
          variant="outline" 
          disabled={!filteredLeads || filteredLeads.length === 0}
          className="border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
        >
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-white border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-gray-500">New</div>
            <div className="p-2 bg-red-50 rounded-full group-hover:scale-110 transition-transform">
               <Clock className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{newLeads}</div>
            <p className="text-xs text-gray-500 mt-1">New leads</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-gray-500">RNR</div>
            <div className="p-2 bg-blue-50 rounded-full group-hover:scale-110 transition-transform">
               <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{rnrLeads}</div>
            <p className="text-xs text-gray-500 mt-1">RNR status</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-gray-500">Scheduled</div>
            <div className="p-2 bg-indigo-50 rounded-full group-hover:scale-110 transition-transform">
               <CheckCircle className="h-4 w-4 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{scheduledLeads}</div>
            <p className="text-xs text-gray-500 mt-1">Scheduled pickups</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-gray-500">Reschedule</div>
            <div className="p-2 bg-orange-50 rounded-full group-hover:scale-110 transition-transform">
               <PhoneCall className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{rescheduleLeads}</div>
            <p className="text-xs text-gray-500 mt-1">Rescheduled</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-none shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-gray-500">Not Interested</div>
            <div className="p-2 bg-gray-100 rounded-full group-hover:scale-110 transition-transform">
               <XCircle className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{notInterestedLeads}</div>
            <p className="text-xs text-gray-500 mt-1">Marked not interested</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-none shadow-lg rounded-xl overflow-hidden">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name, brand, phone, device, or city..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-10 bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-gray-100" />
              ))}
            </div>
          ) : !filteredLeads || filteredLeads.length === 0 ?  (
            <div className="text-center py-12">
              <Phone className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-lg font-medium text-gray-900">No leads yet</p>
              <p className="text-sm text-gray-500 mt-1">Leads will appear here when customers verify phone but don't book pickup</p>
            </div>
          ) : (
            <div className="rounded-md border border-gray-200 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 hover:bg-gray-50">
                    <TableHead className="w-[60px] text-gray-500">#</TableHead>
                    <TableHead className="text-gray-500">Device</TableHead>
                    <TableHead className="text-gray-500">Phone Number</TableHead>
                    <TableHead className="text-gray-500">City</TableHead>
                    <TableHead className="text-gray-500">Notes</TableHead>
                    <TableHead className="text-gray-500">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead, index) => {
                    const isSimplified = isSimplifiedLaptopLead(lead);

                    return (
                      <TableRow key={lead.id} className="border-gray-200 hover:bg-gray-50">
                        <TableCell className="font-mono text-sm text-gray-500">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <button onClick={() => handleOpenDetails(lead)} className="text-left hover:bg-gray-100 p-2 rounded transition-colors w-full">
                            <div className="flex items-center gap-3">
                              {isSimplified ?  (
                                <Laptop className="h-5 w-5 text-purple-600 flex-shrink-0" />
                              ) : (
                                <Smartphone className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                {isSimplified ? (
                                  <>
                                    <div className="font-medium text-purple-600 hover:text-purple-700 hover:underline truncate flex items-center gap-2">
                                      {lead.brand_name} Laptop
                                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">Quick Lead</Badge>
                                    </div>
                                    <div className="text-xs text-gray-500">Brand only • Needs follow-up</div>
                                  </>
                                ) : (
                                  <>
                                    <div className="font-medium text-blue-600 hover:text-blue-700 hover:underline truncate">
                                      {lead.device?.brand?.name} {lead.device?.model_name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {lead.variant?.storage_gb}GB • ₹{(lead.final_price ??  0).toLocaleString("en-IN")}
                                    </div>
                                  </>
                                )}
                                <div className="text-xs text-gray-600 mt-0.5 truncate">{lead.customer_name}</div>
                              </div>
                            </div>
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <div className="font-mono font-medium flex items-center gap-2 text-gray-700">
                                <span>{lead.verified_phone || lead.phone_number}</span>
                                {lead.is_phone_verified && (
                                  <span title="Verified">
                                    <ShieldCheck className="h-3 w-3 text-green-600 flex-shrink-0" />
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">{lead.created_at ?  formatDistanceToNow(new Date(lead.created_at), { addSuffix: true }) : "N/A"}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{lead.city?.name || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleOpenNotes(lead)} 
                            className="h-9 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <FileText className={`h-4 w-4 ${lead.lead_notes ?  "text-blue-600" : "text-gray-400"}`} />
                            {lead.lead_notes && <span className="ml-2 text-xs">View</span>}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Select 
                            value={lead.lead_status || "new"} 
                            onValueChange={(value) => { 
                              updateLeadStatusMutation.mutate({ id: lead.id, status: value }); 
                            }}
                          >
                            <SelectTrigger 
                              className={cn(
                                "w-[160px] border-gray-200 transition-all",
                                (lead.lead_status === "new" || !lead.lead_status) 
                                  ? "bg-red-50 text-red-700 border-red-200 animate-pulse font-semibold shadow-sm" 
                                  : "bg-white text-gray-900"
                              )}
                            >
                              {(lead.lead_status === "new" || !lead.lead_status) ? (
                                <span className="flex items-center gap-2">
                                  New
                                </span>
                              ) : (
                                <Badge variant="secondary" className={getStatusColor(lead.lead_status)}>
                                  {getStatusLabel(lead.lead_status)}
                                </Badge>
                              )}
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-200">
                              {STATUS_OPTIONS.map(s => (
                                <SelectItem key={s.value} value={s.value} className="text-gray-900 hover:bg-gray-50">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${s.color. split(' ').find(c => c.startsWith('bg-'))}`} />
                                    {s.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-2xl text-gray-900">Lead Details</DialogTitle>
            <DialogDescription className="text-gray-500">Customer's device selection and answers</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6">
              {isSimplifiedLaptopLead(selectedLead) ? (
                <>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Laptop className="h-6 w-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{selectedLead.brand_name} Laptop</h3>
                        <p className="text-sm text-gray-500">{selectedLead.customer_name}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Quick Lead - Brand Only
                    </Badge>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{selectedLead.device?.brand?.name} {selectedLead.device?.model_name}</h3>
                        <p className="text-sm text-gray-500">{selectedLead.variant?.storage_gb}GB • {selectedLead.customer_name}</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">₹{(selectedLead.final_price ?? 0).toLocaleString("en-IN")}</div>
                  </div>
                  <Separator className="bg-gray-200" />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">Device Condition</h3>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      {selectedLead.condition && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Condition:</span>
                          <Badge variant="outline" className="capitalize bg-white text-gray-700 border-gray-200">{selectedLead.condition}</Badge>
                        </div>
                      )}
                      {selectedLead.age_group && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age: </span>
                          <Badge variant="outline" className="bg-white text-gray-700 border-gray-200">{selectedLead.age_group}</Badge>
                        </div>
                      )}
                      {selectedLead.display_condition && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Display: </span>
                          <Badge variant="outline" className="capitalize bg-white text-gray-700 border-gray-200">{selectedLead.display_condition}</Badge>
                        </div>
                      )}
                      {selectedLead.body_condition && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Body:</span>
                          <Badge variant="outline" className="capitalize bg-white text-gray-700 border-gray-200">{selectedLead.body_condition}</Badge>
                        </div>
                      )}
                      <Separator className="bg-gray-200" />
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Powers On", value: selectedLead.device_powers_on },
                          { label: "Can Call", value: selectedLead.can_make_calls },
                          { label: "Touch Works", value: selectedLead.is_touch_working },
                          { label: "Original Screen", value: selectedLead.is_screen_original },
                          { label: "Battery OK", value: selectedLead.is_battery_healthy },
                          { label: "Has Charger", value: selectedLead.has_charger },
                          { label: "Has Box", value: selectedLead.has_box },
                          { label: "Has Bill", value: selectedLead.has_bill },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center gap-2">
                            {item.value ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                            <span className="text-sm text-gray-600">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                <p><strong>Created:</strong> {selectedLead.created_at ? format(new Date(selectedLead.created_at), "MMM dd, yyyy HH:mm:ss") : "N/A"}</p>
                <p><strong>Phone:</strong> {selectedLead.verified_phone || selectedLead.phone_number}</p>
                {selectedLead.city && (
                  <p className="flex items-center gap-1">
                    <strong>City:</strong>
                    <MapPin className="h-3 w-3 text-gray-400 inline" />
                    {selectedLead.city.name}
                  </p>
                )}
                {selectedLead.brand_name && <p><strong>Brand:</strong> {selectedLead.brand_name}</p>}
              </div>
              {selectedLead.lead_notes && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-600 mb-2">📝 Notes</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedLead.lead_notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)} className="border-gray-200 text-gray-700 hover:bg-gray-50">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border-gray-200 text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Lead Notes</DialogTitle>
            <DialogDescription className="text-gray-500">Internal notes for follow-up</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              value={noteText} 
              onChange={(e) => setNoteText(e.target.value)} 
              placeholder="Add follow-up notes, customer preferences, best time to call, etc..." 
              className="min-h-[150px] bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500" 
              rows={8} 
            />
            <p className="text-xs text-gray-500">{noteText.length} characters</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setNotesDialogOpen(false); setNoteText(""); }} className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancel</Button>
            <Button onClick={handleSaveNotes} disabled={updateLeadNotesMutation.isPending} className="bg-blue-600 hover:bg-blue-500 text-white">
              <Save className="mr-2 h-4 w-4" />
              {updateLeadNotesMutation.isPending ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
