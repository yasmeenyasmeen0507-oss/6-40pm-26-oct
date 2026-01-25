import { useEffect, useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertCircle,
  DollarSign,
  Loader2,
  CheckCircle,
  XCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Edit3,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface WarrantyPrice {
  id: string;
  variant_id: string;
  price_0_3_months: number;
  price_3_6_months: number;
  price_6_11_months: number;
  price_11_plus_months: number;
  charger_deduction_amount: number;
  box_deduction_amount: number;
  bill_deduction_amount: number;
  notes: string | null;
  phoneconditiondeduction_good: number | null;
  phoneconditiondeduction_average: number | null;
  phoneconditiondeduction_belowaverage: number | null;
  call_deduction_percentage: number | null;
  touch_deduction_percentage: number | null;
  screen_deduction_percentage: number | null;
  battery_deduction_percentage: number | null;
}

interface EditingState {
  rowId: string;
  field: keyof Omit<WarrantyPrice, 'id' | 'variant_id'>;
  value: string;
}

interface RowState {
  rowId: string;
  isLoading: boolean;
  isSaved: boolean;
  error: string | null;
}

const ITEMS_PER_PAGE = 50;

export default function AdminWarrantyPrices() {
  const queryClient = useQueryClient();
  const [editingCell, setEditingCell] = useState<EditingState | null>(null);
  const [rowStates, setRowStates] = useState<Map<string, RowState>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<WarrantyPrice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalOriginalRow, setModalOriginalRow] = useState<WarrantyPrice | null>(null);
  const [isModalSaving, setIsModalSaving] = useState(false);

  // Fetch warranty prices
  const { data: warrantPrices = [], isLoading, error, refetch } = useQuery({
    queryKey: ['warranty-prices'],
    queryFn: async () => {
      let allData: WarrantyPrice[] = [];
      const chunkSize = 1000;
      let offset = 0;

      // Fetch in chunks of 1000 rows until all data is retrieved
      while (true) {
        const { data, error } = await supabase
          .from('warranty_prices')
          .select('*')
          .order('created_at', { ascending: false })
          .range(offset, offset + chunkSize - 1);

        if (error) {
          console.error('❌ Supabase Error:', error);
          throw error;
        }

        if (!data || data.length === 0) break;
        
        allData = [...allData, ...data];
        console.log(`📦 Fetched chunk: rows ${offset}-${offset + data.length - 1}`);
        
        if (data.length < chunkSize) break;
        offset += chunkSize;
      }

      console.log('📊 Loaded:', allData.length, 'rows total');
      return allData as WarrantyPrice[];
    },
  });

  // Search and filter - super fast with useMemo
  const filteredPrices = useMemo(() => {
    if (!searchTerm.trim()) return warrantPrices;

    // Normalize search term: lowercase + remove spaces for flexible matching
    const normalizeText = (text: string) => text.toLowerCase().replace(/\s+/g, '');
    const normalizedSearch = normalizeText(searchTerm);

    const results = warrantPrices.filter(
      (item) =>
        normalizeText(item.variant_id || '') .includes(normalizedSearch) ||
        normalizeText(item.id || '').includes(normalizedSearch) ||
        normalizeText(item.notes || '').includes(normalizedSearch) ||
        // Also search in field values just in case
        String(item.price_0_3_months).includes(normalizedSearch) ||
        String(item.price_3_6_months).includes(normalizedSearch)
    );
    return results;
  }, [warrantPrices, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredPrices.length / ITEMS_PER_PAGE);
  const paginatedPrices = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    return filteredPrices.slice(startIdx, endIdx);
  }, [filteredPrices, currentPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Mutation for updating warranty price
  const updateMutation = useMutation({
    mutationFn: async (params: { id: string; field: string; value: any }) => {
      const { id, field, value } = params;

      if (value === '' || value === null || value === undefined) {
        throw new Error('Value cannot be empty');
      }

      const numericFields = new Set([
        'price_0_3_months',
        'price_3_6_months',
        'price_6_11_months',
        'price_11_plus_months',
        'charger_deduction_amount',
        'box_deduction_amount',
        'bill_deduction_amount',
        'phoneconditiondeduction_good',
        'phoneconditiondeduction_average',
        'phoneconditiondeduction_belowaverage',
        'call_deduction_percentage',
        'touch_deduction_percentage',
        'screen_deduction_percentage',
        'battery_deduction_percentage',
      ]);

      const isNumericField = numericFields.has(field);

      if (isNumericField) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
          throw new Error('Value must be a valid number');
        }

        if (numValue < 0) {
          throw new Error('Value cannot be negative');
        }

        const { error } = await supabase
          .from('warranty_prices')
          .update({ [field]: numValue })
          .eq('id', id);

        if (error) throw error;

        return { id, field, value: numValue };
      }

      // String fields (e.g., notes)
      const stringValue = String(value);
      const { error } = await supabase
        .from('warranty_prices')
        .update({ [field]: stringValue })
        .eq('id', id);

      if (error) throw error;

      return { id, field, value: stringValue };
    },
    onSuccess: (data) => {
      console.log('✅ Supabase update success:', data);
      queryClient.setQueryData(['warranty-prices'], (old: WarrantyPrice[]) => {
        return old.map((item) =>
          item.id === data.id
            ? { ...item, [data.field]: data.value }
            : item
        );
      });

      // Ensure UI matches server (in case of triggers/defaults)
      refetch();

      setRowStates((prev) => {
        const newStates = new Map(prev);
        newStates.set(data.id, { rowId: data.id, isLoading: false, isSaved: true, error: null });
        return newStates;
      });

      setTimeout(() => {
        setRowStates((prev) => {
          const newStates = new Map(prev);
          newStates.delete(data.id);
          return newStates;
        });
      }, 1200);

      setEditingCell(null);

      // Update modal if open
      if (selectedRow?.id === data.id) {
        setSelectedRow((prev) =>
          prev ? { ...prev, [data.field]: data.value } : null
        );
      }
    },
    onMutate: (params) => {
      setRowStates((prev) => {
        const newStates = new Map(prev);
        newStates.set(params.id, { rowId: params.id, isLoading: true, isSaved: false, error: null });
        return newStates;
      });
    },
    onError: (error: any) => {
      const errorMsg = error.message || 'Failed to update price';
      console.error('❌ Supabase update error:', errorMsg);
      alert(errorMsg);

      if (editingCell) {
        setRowStates((prev) => {
          const newStates = new Map(prev);
          newStates.set(editingCell.rowId, {
            rowId: editingCell.rowId,
            isLoading: false,
            isSaved: false,
            error: errorMsg,
          });
          return newStates;
        });
      }
    },
  });

  const handleCellClick = (rowId: string, field: keyof Omit<WarrantyPrice, 'id' | 'variant_id'>, value: any) => {
    setEditingCell({
      rowId,
      field,
      value: String(value ?? ''),
    });
  };

  const handleSave = async () => {
    if (!editingCell) return;

    await updateMutation.mutateAsync({
      id: editingCell.rowId,
      field: editingCell.field,
      value: editingCell.value,
    });
  };

  const handleCancel = () => {
    setEditingCell(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCell) return;
    setEditingCell({
      ...editingCell,
      value: e.target.value,
    });
  };

  const getRowState = (rowId: string) => {
    return rowStates.get(rowId) || { rowId, isLoading: false, isSaved: false, error: null };
  };

  const openModal = (row: WarrantyPrice) => {
    setSelectedRow(row);
    setModalOriginalRow(row);
    setIsModalSaving(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRow(null);
    setModalOriginalRow(null);
    setIsModalSaving(false);
  };

  const handleModalFieldChange = (field: keyof Omit<WarrantyPrice, 'id' | 'variant_id'>, value: any) => {
    if (!selectedRow) return;

    if (value === '' || value === null) {
      alert('Value cannot be empty');
      return;
    }

    let newValue: any = value;
    if (field !== 'notes') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        alert('Value must be a valid number');
        return;
      }
      if (numValue < 0) {
        alert('Value cannot be negative');
        return;
      }
      newValue = numValue;
    }

    setSelectedRow((prev) => (prev ? { ...prev, [field]: newValue } : prev));
  };

  const handleModalSave = async () => {
    if (!selectedRow || !modalOriginalRow) return;

    const fieldsToCheck: Array<keyof Omit<WarrantyPrice, 'id' | 'variant_id'>> = [
      'price_0_3_months',
      'price_3_6_months',
      'price_6_11_months',
      'price_11_plus_months',
      'charger_deduction_amount',
      'box_deduction_amount',
      'bill_deduction_amount',
      'notes',
      'phoneconditiondeduction_good',
      'phoneconditiondeduction_average',
      'phoneconditiondeduction_belowaverage',
      'call_deduction_percentage',
      'touch_deduction_percentage',
      'screen_deduction_percentage',
      'battery_deduction_percentage',
    ];

    const changedFields = fieldsToCheck.filter((field) => selectedRow[field] !== modalOriginalRow[field]);

    if (changedFields.length === 0) {
      alert('No changes to save');
      return;
    }

    setIsModalSaving(true);
    try {
      for (const field of changedFields) {
        await updateMutation.mutateAsync({
          id: selectedRow.id,
          field,
          value: selectedRow[field],
        });
      }
      await refetch();
      setModalOriginalRow(selectedRow);
      alert('Saved to Supabase');
    } catch (err: any) {
      alert(err?.message || 'Failed to save changes');
    } finally {
      setIsModalSaving(false);
    }
  };

  // Render table cell with inline editing
  const renderTableCell = (row: WarrantyPrice, field: keyof Omit<WarrantyPrice, 'id' | 'variant_id'>) => {
    const value = row[field];
    const isEditing = editingCell?.rowId === row.id && editingCell?.field === field;
    const rowState = getRowState(row.id);

    if (isEditing) {
      return (
        <div className="flex gap-2 items-center">
          <input
            type={field === 'notes' ? 'text' : 'number'}
            value={editingCell.value}
            onChange={handleInputChange}
            className="w-20 px-2 py-1 bg-white border border-blue-500 rounded text-gray-900 text-sm focus:outline-none"
            autoFocus
            step="0.01"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            disabled={rowState.isLoading}
            className="p-1 hover:bg-green-100 rounded text-green-600 disabled:opacity-50"
            title="Save"
          >
            {rowState.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCancel();
            }}
            disabled={rowState.isLoading}
            className="p-1 hover:bg-red-100 rounded text-red-600 disabled:opacity-50"
            title="Cancel"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'px-2 py-1 rounded cursor-pointer transition-colors inline-block max-w-xs truncate',
            rowState.isLoading
              ? 'bg-gray-100 text-gray-400'
              : 'bg-white border border-gray-200 text-gray-900 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-200'
          )}
          onClick={() => !rowState.isLoading && handleCellClick(row.id, field, value)}
        >
          {field === 'notes'
            ? value || '-'
            : value !== null && value !== undefined
              ? Number(value).toFixed(2)
              : '-'}
        </span>
        {rowState.isSaved && (
          <CheckCircle className="h-3 w-3 text-green-600 animate-pulse" />
        )}
        {rowState.error && (
          <AlertCircle className="h-3 w-3 text-red-600" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warranty Prices</h1>
          <p className="text-gray-500 mt-1">Manage warranty pricing for all device variants</p>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <Badge variant="outline" className="text-gray-600 bg-white border-gray-200">
            {filteredPrices.length} / {warrantPrices.length} variants
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* Search Box - Super Fast */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="🔍 Search by variant ID, ID, or notes... (super fast search)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
          <AlertCircle className="h-4 w-4 text-red-900" />
          <AlertDescription>Failed to load warranty prices. Please try again.</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-500">Loading warranty prices...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 bg-gray-100" />
            ))}
          </CardContent>
        </Card>
      ) : filteredPrices.length === 0 ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">
              {searchTerm ? 'No results found for your search' : 'No warranty prices found'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Notes</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Variant ID</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">0-3 Mo</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">3-6 Mo</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">6-11 Mo</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">11+ Mo</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Charger</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Box</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Bill</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Cond Good</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Cond Avg</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Cond Below</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Call %</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Touch %</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Screen %</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Battery %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedPrices.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal(row)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit all fields in detail view"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </td>
                        <td className="px-4 py-3">{renderTableCell(row, 'notes')}</td>
                        <td className="px-4 py-3">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                            {row.variant_id.substring(0, 8)}...
                          </code>
                        </td>
                        <td className="px-4 py-3">{renderTableCell(row, 'price_0_3_months')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'price_3_6_months')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'price_6_11_months')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'price_11_plus_months')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'charger_deduction_amount')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'box_deduction_amount')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'bill_deduction_amount')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'phoneconditiondeduction_good')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'phoneconditiondeduction_average')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'phoneconditiondeduction_belowaverage')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'call_deduction_percentage')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'touch_deduction_percentage')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'screen_deduction_percentage')}</td>
                        <td className="px-4 py-3">{renderTableCell(row, 'battery_deduction_percentage')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination - Google Style */}
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                  <span className="font-semibold text-gray-900">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredPrices.length)}
                  </span>{' '}
                  of <span className="font-semibold text-gray-900">{filteredPrices.length}</span> results
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  {/* Page Numbers - Google Style */}
                  <div className="flex items-center space-x-1">
                    {totalPages <= 7 ? (
                      // Show all pages if 7 or fewer
                      [...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className={cn(
                              'w-10',
                              currentPage === pageNum
                                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                : 'border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                            )}
                          >
                            {pageNum}
                          </Button>
                        );
                      })
                    ) : (
                      // Show smart pagination for many pages
                      <>
                        {/* First page */}
                        <Button
                          variant={currentPage === 1 ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                          className={cn(
                            'w-10',
                            currentPage === 1
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          )}
                        >
                          1
                        </Button>

                        {/* Ellipsis if needed */}
                        {currentPage > 4 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}

                        {/* Middle pages */}
                        {[...Array(3)].map((_, i) => {
                          const pageNum = currentPage - 1 + i;
                          if (pageNum > 1 && pageNum < totalPages) {
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className={cn(
                                  'w-10',
                                  currentPage === pageNum
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                    : 'border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                                )}
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                          return null;
                        })}

                        {/* Ellipsis if needed */}
                        {currentPage < totalPages - 3 && (
                          <span className="px-2 text-gray-400">...</span>
                        )}

                        {/* Last page */}
                        <Button
                          variant={currentPage === totalPages ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          className={cn(
                            'w-10',
                            currentPage === totalPages
                              ? 'bg-blue-600 hover:bg-blue-500 text-white'
                              : 'border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          )}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal for Full Row Edit */}
      {isModalOpen && selectedRow && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-white border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-white border-b border-gray-200 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-gray-900">Edit Warranty Price Details</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Variant: {selectedRow.variant_id.substring(0, 12)}...
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-900 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Price Columns */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Price 0-3 Months</label>
                  <input
                    type="number"
                    value={selectedRow.price_0_3_months || ''}
                    onChange={(e) =>
                      handleModalFieldChange('price_0_3_months', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Price 3-6 Months</label>
                  <input
                    type="number"
                    value={selectedRow.price_3_6_months || ''}
                    onChange={(e) =>
                      handleModalFieldChange('price_3_6_months', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Price 6-11 Months</label>
                  <input
                    type="number"
                    value={selectedRow.price_6_11_months || ''}
                    onChange={(e) =>
                      handleModalFieldChange('price_6_11_months', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Price 11+ Months</label>
                  <input
                    type="number"
                    value={selectedRow.price_11_plus_months || ''}
                    onChange={(e) =>
                      handleModalFieldChange('price_11_plus_months', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                {/* Deduction Amounts */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Charger Deduction</label>
                  <input
                    type="number"
                    value={selectedRow.charger_deduction_amount || ''}
                    onChange={(e) =>
                      handleModalFieldChange('charger_deduction_amount', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Box Deduction</label>
                  <input
                    type="number"
                    value={selectedRow.box_deduction_amount || ''}
                    onChange={(e) =>
                      handleModalFieldChange('box_deduction_amount', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Bill Deduction</label>
                  <input
                    type="number"
                    value={selectedRow.bill_deduction_amount || ''}
                    onChange={(e) =>
                      handleModalFieldChange('bill_deduction_amount', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                {/* Condition Deductions */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Condition - Good</label>
                  <input
                    type="number"
                    value={selectedRow.phoneconditiondeduction_good || ''}
                    onChange={(e) =>
                      handleModalFieldChange('phoneconditiondeduction_good', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Condition - Average</label>
                  <input
                    type="number"
                    value={selectedRow.phoneconditiondeduction_average || ''}
                    onChange={(e) =>
                      handleModalFieldChange('phoneconditiondeduction_average', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Condition - Below Average</label>
                  <input
                    type="number"
                    value={selectedRow.phoneconditiondeduction_belowaverage || ''}
                    onChange={(e) =>
                      handleModalFieldChange('phoneconditiondeduction_belowaverage', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                {/* Percentages */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Call Deduction %</label>
                  <input
                    type="number"
                    value={selectedRow.call_deduction_percentage || ''}
                    onChange={(e) =>
                      handleModalFieldChange('call_deduction_percentage', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Touch Deduction %</label>
                  <input
                    type="number"
                    value={selectedRow.touch_deduction_percentage || ''}
                    onChange={(e) =>
                      handleModalFieldChange('touch_deduction_percentage', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Screen Deduction %</label>
                  <input
                    type="number"
                    value={selectedRow.screen_deduction_percentage || ''}
                    onChange={(e) =>
                      handleModalFieldChange('screen_deduction_percentage', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">Battery Deduction %</label>
                  <input
                    type="number"
                    value={selectedRow.battery_deduction_percentage || ''}
                    onChange={(e) =>
                      handleModalFieldChange('battery_deduction_percentage', parseFloat(e.target.value) || 0)
                    }
                    className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Notes - Full Width */}
              <div className="mt-6">
                <label className="text-sm font-semibold text-gray-700">Notes</label>
                <textarea
                  value={selectedRow.notes || ''}
                  onChange={(e) =>
                    handleModalFieldChange('notes', e.target.value)
                  }
                  className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded text-gray-900 focus:border-blue-500 focus:outline-none resize-none h-24 focus:ring-1 focus:ring-blue-500"
                  placeholder="Add any notes..."
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  onClick={handleModalSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isModalSaving}
                >
                  {isModalSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  onClick={closeModal}
                  className="border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
