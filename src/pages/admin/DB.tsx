import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Database,
  Loader2,
  RefreshCw,
  Save,
  Smartphone,
  Tags,
  Tablet,
} from 'lucide-react';

type BrandRow = {
  id: string;
  category: string;
  name: string;
  logo_url?: string | null;
  is_active?: boolean | null;
  display_order?: number | null;
  is_featured?: boolean | null;
};

type DeviceRow = {
  id: string;
  brand_id: string;
  series?: string | null;
  model_name: string;
  release_date?: string | null;
  image_url?: string | null;
  is_active?: boolean | null;
};

type VariantRow = {
  id: string;
  device_id: string;
  storage_gb: number;
  base_price: number;
};

type WarrantyPriceRow = {
  id: string;
  variant_id: string;
  price_0_3_months: number | null;
  price_3_6_months: number | null;
  price_6_11_months: number | null;
  price_11_plus_months: number | null;
  charger_deduction_amount?: number | null;
  box_deduction_amount?: number | null;
  bill_deduction_amount?: number | null;
  phoneconditiondeduction_good?: number | null;
  phoneconditiondeduction_average?: number | null;
  phoneconditiondeduction_belowaverage?: number | null;
  call_deduction_percentage?: number | null;
  touch_deduction_percentage?: number | null;
  screen_deduction_percentage?: number | null;
  battery_deduction_percentage?: number | null;
  notes?: string | null;
};

type EditState = { rowId: string; field: string; value: string };

type FieldDefinition = { key: string; label: string; type: 'text' | 'number' | 'textarea' | 'boolean' };

const brandFields: FieldDefinition[] = [
  { key: 'name', label: 'Brand name', type: 'text' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'logo_url', label: 'Logo URL', type: 'text' },
  { key: 'display_order', label: 'Display order', type: 'number' },
  { key: 'is_featured', label: 'Featured', type: 'boolean' },
  { key: 'is_active', label: 'Active', type: 'boolean' },
];

const deviceFields: FieldDefinition[] = [
  { key: 'model_name', label: 'Model name', type: 'text' },
  { key: 'series', label: 'Series name', type: 'text' },
  { key: 'release_date', label: 'Release date', type: 'text' },
  { key: 'image_url', label: 'Image URL', type: 'text' },
  { key: 'is_active', label: 'Active', type: 'boolean' },
];

const variantFields: FieldDefinition[] = [
  { key: 'storage_gb', label: 'Storage (GB)', type: 'number' },
  { key: 'base_price', label: 'Base price', type: 'number' },
];

const warrantyFields: FieldDefinition[] = [
  { key: 'price_0_3_months', label: '0-3 months', type: 'number' },
  { key: 'price_3_6_months', label: '3-6 months', type: 'number' },
  { key: 'price_6_11_months', label: '6-11 months', type: 'number' },
  { key: 'price_11_plus_months', label: '11+ months', type: 'number' },
  { key: 'charger_deduction_amount', label: 'Charger deduction', type: 'number' },
  { key: 'box_deduction_amount', label: 'Box deduction', type: 'number' },
  { key: 'bill_deduction_amount', label: 'Bill deduction', type: 'number' },
  { key: 'phoneconditiondeduction_good', label: 'Condition deduction - good', type: 'number' },
  { key: 'phoneconditiondeduction_average', label: 'Condition deduction - average', type: 'number' },
  { key: 'phoneconditiondeduction_belowaverage', label: 'Condition deduction - below average', type: 'number' },
  { key: 'call_deduction_percentage', label: 'Call deduction %', type: 'number' },
  { key: 'touch_deduction_percentage', label: 'Touch deduction %', type: 'number' },
  { key: 'screen_deduction_percentage', label: 'Screen deduction %', type: 'number' },
  { key: 'battery_deduction_percentage', label: 'Battery deduction %', type: 'number' },
  { key: 'notes', label: 'Notes', type: 'textarea' },
];

const parseNumeric = (value: string) => {
  const trimmed = value.trim();
  if (trimmed === '') return null;
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed)) throw new Error('Enter a valid number');
  return parsed;
};

export default function AdminDB() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<EditState | null>(null);

  const { data: brands = [], isLoading: brandsLoading, error: brandsError, refetch: refetchBrands } = useQuery({
    queryKey: ['db-brands'],
    queryFn: async () => {
      const primary = await supabase.from('brands').select('*').order('display_order', { ascending: true }).order('name', { ascending: true });
      if (!primary.error) return (primary.data || []) as BrandRow[];
      const fallback = await supabase.from('brands').select('*').order('name', { ascending: true });
      if (fallback.error) throw fallback.error;
      return (fallback.data || []) as BrandRow[];
    },
  });

  const selectedBrand = useMemo(() => brands.find((item) => item.id === selectedBrandId) || null, [brands, selectedBrandId]);

  const { data: devices = [], isLoading: devicesLoading, error: devicesError, refetch: refetchDevices } = useQuery({
    queryKey: ['db-devices', selectedBrandId],
    enabled: Boolean(selectedBrandId),
    queryFn: async () => {
      const primary = await supabase.from('devices').select('*').eq('brand_id', selectedBrandId).order('created_at', { ascending: false });
      if (!primary.error) return (primary.data || []) as DeviceRow[];
      const fallback = await supabase.from('devices').select('*').eq('brand_id', selectedBrandId).order('model_name', { ascending: true });
      if (fallback.error) throw fallback.error;
      return (fallback.data || []) as DeviceRow[];
    },
  });

  const selectedDevice = useMemo(() => devices.find((item) => item.id === selectedDeviceId) || null, [devices, selectedDeviceId]);

  const { data: variants = [], isLoading: variantsLoading, error: variantsError, refetch: refetchVariants } = useQuery({
    queryKey: ['db-variants', selectedDeviceId],
    enabled: Boolean(selectedDeviceId),
    queryFn: async () => {
      const primary = await supabase.from('variants').select('*').eq('device_id', selectedDeviceId).order('storage_gb', { ascending: true });
      if (!primary.error) return (primary.data || []) as VariantRow[];
      const fallback = await supabase.from('variants').select('*').eq('device_id', selectedDeviceId).order('base_price', { ascending: true });
      if (fallback.error) throw fallback.error;
      return (fallback.data || []) as VariantRow[];
    },
  });

  const selectedVariant = useMemo(() => variants.find((item) => item.id === selectedVariantId) || null, [variants, selectedVariantId]);

  const { data: warrantyRows = [], isLoading: warrantyLoading, error: warrantyError, refetch: refetchWarranty } = useQuery({
    queryKey: ['db-warranty-prices', selectedVariantId],
    enabled: Boolean(selectedVariantId),
    queryFn: async () => {
      const { data, error } = await supabase.from('warranty_prices').select('*').eq('variant_id', selectedVariantId).limit(1);
      if (error) throw error;
      return (data || []) as WarrantyPriceRow[];
    },
  });

  const selectedWarranty = warrantyRows[0] || null;

  useEffect(() => {
    if (!selectedBrandId) {
      setSelectedDeviceId(null);
      setSelectedVariantId(null);
    }
  }, [selectedBrandId]);

  useEffect(() => {
    if (!selectedDeviceId) setSelectedVariantId(null);
  }, [selectedDeviceId]);

  useEffect(() => {
    const brandChannel = supabase.channel('admin-db-brands').on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, () => {
      queryClient.invalidateQueries({ queryKey: ['db-brands'] });
    }).subscribe();
    const deviceChannel = supabase.channel('admin-db-devices').on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
      queryClient.invalidateQueries({ queryKey: ['db-devices'] });
    }).subscribe();
    const variantChannel = supabase.channel('admin-db-variants').on('postgres_changes', { event: '*', schema: 'public', table: 'variants' }, () => {
      queryClient.invalidateQueries({ queryKey: ['db-variants'] });
    }).subscribe();
    const warrantyChannel = supabase.channel('admin-db-warranty-prices').on('postgres_changes', { event: '*', schema: 'public', table: 'warranty_prices' }, () => {
      queryClient.invalidateQueries({ queryKey: ['db-warranty-prices'] });
    }).subscribe();

    return () => {
      supabase.removeChannel(brandChannel);
      supabase.removeChannel(deviceChannel);
      supabase.removeChannel(variantChannel);
      supabase.removeChannel(warrantyChannel);
    };
  }, [queryClient]);

  const updateMutation = useMutation({
    mutationFn: async ({ table, id, field, value }: { table: 'brands' | 'devices' | 'variants' | 'warranty_prices'; id: string; field: string; value: any }) => {
      const { error } = await supabase.from(table).update({ [field]: value }).eq('id', id);
      if (error) throw error;
      return { table, id, field, value };
    },
    onSuccess: async ({ table, id, field, value }) => {
      if (table === 'brands') {
        queryClient.setQueryData(['db-brands'], (old: BrandRow[] = []) => old.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
        await refetchBrands();
      }
      if (table === 'devices') {
        queryClient.setQueryData(['db-devices', selectedBrandId], (old: DeviceRow[] = []) => old.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
        await refetchDevices();
      }
      if (table === 'variants') {
        queryClient.setQueryData(['db-variants', selectedDeviceId], (old: VariantRow[] = []) => old.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
        await refetchVariants();
      }
      if (table === 'warranty_prices') {
        queryClient.setQueryData(['db-warranty-prices', selectedVariantId], (old: WarrantyPriceRow[] = []) => old.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
        await refetchWarranty();
      }
      setEditingCell(null);
      toast({ title: 'Saved', description: 'Database row updated successfully.' });
    },
    onError: (error: any) => {
      toast({ title: 'Update failed', description: error?.message || 'Could not save changes', variant: 'destructive' });
    },
  });

  const handleBrandSelect = (brandId: string) => {
    setSelectedBrandId(brandId);
    setSelectedDeviceId(null);
    setSelectedVariantId(null);
  };

  const handleDeviceSelect = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setSelectedVariantId(null);
  };

  const handleVariantSelect = (variantId: string) => setSelectedVariantId(variantId);

  const startEdit = (rowId: string, field: string, value: any) => {
    setEditingCell({ rowId, field, value: value === null || value === undefined ? '' : String(value) });
  };

  const saveEdit = async (table: 'brands' | 'devices' | 'variants' | 'warranty_prices', rowId: string, field: string, value: string, type: FieldDefinition['type']) => {
    let nextValue: any = value;
    if (type === 'number') nextValue = parseNumeric(value);
    if (type === 'boolean') nextValue = value === 'true' || value === '1';
    await updateMutation.mutateAsync({ table, id: rowId, field, value: nextValue });
  };

  const renderEditor = (table: 'brands' | 'devices' | 'variants' | 'warranty_prices', row: Record<string, any>, fields: FieldDefinition[]) => (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map((field) => {
        const isEditing = editingCell?.rowId === row.id && editingCell?.field === field.key;
        const value = row[field.key];
        return (
          <div key={field.key} className={cn('rounded-xl border border-slate-200 bg-white p-4', field.type === 'textarea' && 'md:col-span-2')}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{field.label}</Label>
              {!isEditing && (
                <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-500 hover:text-slate-900" onClick={() => startEdit(row.id, field.key, value)}>
                  Edit
                </Button>
              )}
            </div>
            {field.type === 'boolean' ? (
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                <span className="text-sm text-slate-700">{value ? 'Enabled' : 'Disabled'}</span>
                <Switch checked={Boolean(value)} onCheckedChange={(checked) => saveEdit(table, row.id, field.key, checked ? 'true' : 'false', 'boolean')} />
              </div>
            ) : isEditing ? (
              field.type === 'textarea' ? (
                <div className="space-y-3">
                  <Textarea autoFocus value={editingCell?.value ?? ''} onChange={(event) => setEditingCell((prev) => (prev ? { ...prev, value: event.target.value } : prev))} className="min-h-24" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(table, row.id, field.key, editingCell?.value ?? '', field.type)} disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingCell(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input autoFocus type={field.type === 'number' ? 'number' : 'text'} value={editingCell?.value ?? ''} onChange={(event) => setEditingCell((prev) => (prev ? { ...prev, value: event.target.value } : prev))} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => saveEdit(table, row.id, field.key, editingCell?.value ?? '', field.type)} disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingCell(null)}>Cancel</Button>
                  </div>
                </div>
              )
            ) : (
              <button type="button" onClick={() => startEdit(row.id, field.key, value)} className="w-full rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-100">
                {field.type === 'number' ? (value === null || value === undefined || value === '' ? '-' : Number(value).toLocaleString('en-IN')) : (value || '-')}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderList = <T extends { id: string }>(title: string, icon: ReactNode, items: T[], selectedId: string | null, loading: boolean, emptyLabel: string, renderRow: (item: T) => ReactNode, onSelect: (id: string) => void) => (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-base text-slate-900">{title}</CardTitle>
          </div>
          <Badge variant="outline" className="bg-white text-slate-700">{items.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-16 rounded-xl bg-slate-100" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-slate-500">{emptyLabel}</div>
        ) : (
          <div className="max-h-[26rem] overflow-auto divide-y divide-slate-100">
            {items.map((item) => (
              <button key={item.id} type="button" onClick={() => onSelect(item.id)} className={cn('w-full px-4 py-3 text-left transition hover:bg-slate-50', selectedId === item.id && 'bg-indigo-50/70')}>
                {renderRow(item)}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              <Database className="h-3.5 w-3.5" /> DB section
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Database editor</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/70">Select a brand, then a device, then a variant. Each level updates in realtime and only the business fields are editable.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-white/80">
            <Badge className="bg-white/10 text-white hover:bg-white/10">Realtime</Badge>
            <Badge className="bg-white/10 text-white hover:bg-white/10">IDs locked</Badge>
            <Badge className="bg-white/10 text-white hover:bg-white/10">Hierarchical</Badge>
          </div>
        </div>
      </div>

      {(brandsError || devicesError || variantsError || warrantyError) && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load one or more database levels. Please refresh and check Supabase permissions.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 xl:grid-cols-4">
        <div className="xl:col-span-1 space-y-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Level 1</p>
              <h2 className="text-lg font-bold text-slate-900">Brands</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchBrands()} className="gap-2"><RefreshCw className="h-4 w-4" />Reload</Button>
          </div>
          {renderList('Brands', <Tags className="h-4 w-4 text-indigo-600" />, brands, selectedBrandId, brandsLoading, 'No brands found', (brand) => (<div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-slate-900">{brand.name}</p><p className="text-xs text-slate-500">{brand.category}</p></div><ArrowRight className="h-4 w-4 text-slate-300" /></div>), handleBrandSelect)}
        </div>

        <div className="xl:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Level 2</p><h2 className="text-lg font-bold text-slate-900">Devices</h2><p className="mt-1 text-sm text-slate-500">{selectedBrand ? `Brand: ${selectedBrand.name}` : 'Pick a brand first'}</p></div>
          {renderList('Devices', <Smartphone className="h-4 w-4 text-indigo-600" />, devices, selectedDeviceId, devicesLoading, 'Select a brand to load devices', (device) => (<div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-slate-900">{device.model_name}</p><p className="text-xs text-slate-500">{device.series || 'No series'} • ID locked</p></div><ArrowRight className="h-4 w-4 text-slate-300" /></div>), handleDeviceSelect)}
        </div>

        <div className="xl:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Level 3</p><h2 className="text-lg font-bold text-slate-900">Variants</h2><p className="mt-1 text-sm text-slate-500">{selectedDevice ? `Device: ${selectedDevice.model_name}` : 'Pick a device first'}</p></div>
          {renderList('Variants', <Tablet className="h-4 w-4 text-indigo-600" />, variants, selectedVariantId, variantsLoading, 'Select a device to load variants', (variant) => (<div className="flex items-center justify-between gap-3"><div><p className="font-semibold text-slate-900">{variant.storage_gb} GB</p><p className="text-xs text-slate-500">Base price: ₹{Number(variant.base_price || 0).toLocaleString('en-IN')}</p></div><ArrowRight className="h-4 w-4 text-slate-300" /></div>), handleVariantSelect)}
        </div>

        <div className="xl:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Level 4</p><h2 className="text-lg font-bold text-slate-900">Warranty prices</h2><p className="mt-1 text-sm text-slate-500">{selectedVariant ? `Variant: ${selectedVariant.storage_gb} GB` : 'Pick a variant first'}</p></div>
          <Card className="border-slate-200 shadow-sm"><CardContent className="space-y-4 p-4">{warrantyLoading ? (<div className="space-y-3">{Array.from({ length: 4 }).map((_, index) => (<Skeleton key={index} className="h-16 rounded-xl bg-slate-100" />))}</div>) : selectedVariant && selectedWarranty ? (<><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Selected row</p><h3 className="text-lg font-bold text-slate-900">Warranty pricing</h3></div><Badge variant="outline" className="bg-white">IDs locked</Badge></div><p className="mt-2 text-sm text-slate-500">Only the pricing and deduction fields are editable here.</p></div>{renderEditor('warranty_prices', selectedWarranty, warrantyFields)}</>) : selectedVariant ? (<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No warranty price row exists for this variant yet.</div>) : (<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Select a variant to edit warranty prices.</div>)}</CardContent></Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-200 shadow-sm lg:col-span-1"><CardHeader className="border-b border-slate-100 bg-slate-50/70"><CardTitle className="text-base text-slate-900">Brand details</CardTitle></CardHeader><CardContent className="p-4">{selectedBrand ? (<div className="space-y-4"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"><div className="mb-2 flex items-center gap-2 text-slate-900"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="font-semibold">{selectedBrand.name}</span></div><p>ID: {selectedBrand.id}</p></div>{renderEditor('brands', selectedBrand, brandFields)}</div>) : (<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Select a brand to edit it.</div>)}</CardContent></Card>

        <Card className="border-slate-200 shadow-sm lg:col-span-1"><CardHeader className="border-b border-slate-100 bg-slate-50/70"><CardTitle className="text-base text-slate-900">Device details</CardTitle></CardHeader><CardContent className="p-4">{selectedDevice ? (<div className="space-y-4"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"><div className="mb-2 flex items-center gap-2 text-slate-900"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="font-semibold">{selectedDevice.model_name}</span></div><p>ID: {selectedDevice.id}</p></div>{renderEditor('devices', selectedDevice, deviceFields)}</div>) : (<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Select a device to edit it.</div>)}</CardContent></Card>

        <Card className="border-slate-200 shadow-sm lg:col-span-1"><CardHeader className="border-b border-slate-100 bg-slate-50/70"><CardTitle className="text-base text-slate-900">Variant details</CardTitle></CardHeader><CardContent className="p-4">{selectedVariant ? (<div className="space-y-4"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"><div className="mb-2 flex items-center gap-2 text-slate-900"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><span className="font-semibold">{selectedVariant.storage_gb} GB</span></div><p>ID: {selectedVariant.id}</p></div>{renderEditor('variants', selectedVariant, variantFields)}</div>) : (<div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">Select a variant to edit it.</div>)}</CardContent></Card>
      </div>
    </div>
  );
}