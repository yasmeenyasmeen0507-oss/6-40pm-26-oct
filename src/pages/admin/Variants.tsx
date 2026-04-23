import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Loader2,
  Package,
  Search,
  X,
  XCircle,
} from 'lucide-react';

interface VariantRow {
  id: string;
  device_id?: string | null;
  product_id?: string | null;
  variant_name?: string | null;
  name?: string | null;
  storage_gb?: string | null;
  base_price?: number | null;
  price?: number | null;
  selling_price?: number | null;
  discount?: number | null;
  stock?: number | null;
  created_at?: string | null;
  notes?: string | null;
  screen_size?: string | null;
  processor_id?: string | null;
  ram_id?: string | null;
  storage_id?: string | null;
  [key: string]: any;
}

interface EditingState {
  rowId: string;
  field: string;
  value: string;
}

interface RowState {
  rowId: string;
  isLoading: boolean;
  isSaved: boolean;
  error: string | null;
}

const ITEMS_PER_PAGE = 50;

const columnConfig: Array<{ key: string; label: string; editable: boolean }>
  = [
    { key: 'id', label: 'ID', editable: false },
    { key: 'device_id', label: 'Device ID', editable: false },
    { key: 'product_id', label: 'Product ID', editable: false },
    { key: 'variant_name', label: 'Variant Name', editable: false },
    { key: 'name', label: 'Variant Name', editable: false },
    { key: 'storage_gb', label: 'Storage', editable: false },
    { key: 'base_price', label: 'Best Price', editable: true },
    { key: 'notes', label: 'Notes', editable: false },
    { key: 'price', label: 'Price', editable: true },
    { key: 'selling_price', label: 'Selling Price', editable: true },
    { key: 'discount', label: 'Discount', editable: true },
    { key: 'stock', label: 'Stock', editable: true },
    { key: 'screen_size', label: 'Screen Size', editable: false },
    { key: 'processor_id', label: 'Processor ID', editable: false },
    { key: 'ram_id', label: 'RAM ID', editable: false },
    { key: 'storage_id', label: 'Storage ID', editable: false },
  ];

export default function AdminVariants() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingCell, setEditingCell] = useState<EditingState | null>(null);
  const [rowStates, setRowStates] = useState<Map<string, RowState>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: variants = [], isLoading, error, refetch } = useQuery({
    queryKey: ['variants-table'],
    queryFn: async () => {
      const chunkSize = 1000;
      let offset = 0;
      let allRows: VariantRow[] = [];

      while (true) {
        const { data, error: fetchError } = await supabase
          .from('variants')
          .select('*')
          .order('created_at', { ascending: false })
          .range(offset, offset + chunkSize - 1);

        if (fetchError) {
          throw fetchError;
        }

        if (!data || data.length === 0) break;

        allRows = allRows.concat(data as VariantRow[]);

        if (data.length < chunkSize) break;
        offset += chunkSize;
      }

      return allRows;
    },
  });

  const visibleColumns = useMemo(() => {
    if (variants.length === 0) return columnConfig.filter((col) => col.key === 'id');

    return columnConfig.filter((col) => {
      if (col.key === 'id') return true;
      return variants.some((row) => Object.prototype.hasOwnProperty.call(row, col.key));
    });
  }, [variants]);

  const editableColumns = useMemo(
    () => visibleColumns.filter((c) => c.editable).map((c) => c.key),
    [visibleColumns]
  );

  const filteredVariants = useMemo(() => {
    if (!searchTerm.trim()) return variants;

    const normalize = (val: any) =>
      (val === null || val === undefined ? '' : String(val))
        .toLowerCase()
        .replace(/\s+/g, '');

    const term = normalize(searchTerm);

    return variants.filter((row) => {
      const fieldsToSearch = [
        row.id,
        row.device_id,
        row.product_id,
        row.variant_name,
        row.name,
        row.storage_gb,
        row.notes,
        row.screen_size,
        row.processor_id,
        row.ram_id,
        row.storage_id,
        row.base_price,
        row.price,
        row.selling_price,
        row.discount,
        row.stock,
      ];

      return fieldsToSearch.some((field) => normalize(field).includes(term));
    });
  }, [variants, searchTerm]);

  const totalPages = Math.ceil(filteredVariants.length / ITEMS_PER_PAGE) || 1;
  const paginatedVariants = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredVariants.slice(start, end);
  }, [filteredVariants, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const updateMutation = useMutation({
    mutationFn: async (params: { id: string; field: string; value: string }) => {
      const { id, field, value } = params;

      if (!editableColumns.includes(field)) {
        throw new Error('This field is read-only');
      }

      const numValue = parseFloat(value);
      if (Number.isNaN(numValue)) {
        throw new Error('Please enter a valid number');
      }
      if (numValue < 0) {
        throw new Error('Value cannot be negative');
      }

      const { data, error: updateError } = await supabase
        .from('variants')
        .update({ [field]: numValue })
        .eq('id', id)
        .select('id');

      if (updateError) {
        throw updateError;
      }

      if (!data || data.length === 0) {
        throw new Error('Update did not affect any rows. Check ID and permissions.');
      }

      return { id, field, value: numValue };
    },
    onMutate: (params) => {
      setRowStates((prev) => {
        const next = new Map(prev);
        next.set(params.id, {
          rowId: params.id,
          isLoading: true,
          isSaved: false,
          error: null,
        });
        return next;
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['variants-table'], (old: VariantRow[] = []) =>
        old.map((row) => (row.id === data.id ? { ...row, [data.field]: data.value } : row))
      );

      // Ensure we re-sync with server in case of triggers/defaults
      refetch();

      setRowStates((prev) => {
        const next = new Map(prev);
        next.set(data.id, { rowId: data.id, isLoading: false, isSaved: true, error: null });
        return next;
      });

      toast({ title: 'Saved', description: 'Variant updated successfully.' });

      setTimeout(() => {
        setRowStates((prev) => {
          const next = new Map(prev);
          next.delete(data.id);
          return next;
        });
      }, 1200);

      setEditingCell(null);
    },
    onError: (mutationError) => {
      const message = (mutationError as Error)?.message || 'Failed to update variant';
      if (editingCell) {
        setRowStates((prev) => {
          const next = new Map(prev);
          next.set(editingCell.rowId, {
            rowId: editingCell.rowId,
            isLoading: false,
            isSaved: false,
            error: message,
          });
          return next;
        });
      }
      toast({ title: 'Update failed', description: message, variant: 'destructive' });
    },
  });

  const handleCellClick = (rowId: string, field: string, value: any) => {
    if (!editableColumns.includes(field)) return;
    setEditingCell({ rowId, field, value: String(value ?? '') });
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
    setEditingCell({ ...editingCell, value: e.target.value });
  };

  const getRowState = (rowId: string) => rowStates.get(rowId) || { rowId, isLoading: false, isSaved: false, error: null };

  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') return '-';
    if (typeof value === 'number') return value.toFixed(2);
    return String(value);
  };

  const renderTableCell = (row: VariantRow, field: string) => {
    const value = row[field];
    const isEditing = editingCell?.rowId === row.id && editingCell?.field === field;
    const rowState = getRowState(row.id);
    const isEditable = editableColumns.includes(field);

    if (isEditing) {
      return (
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={editingCell.value}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                handleCancel();
              }
            }}
            className="w-24 px-2 py-1 bg-white border border-blue-500 rounded text-gray-900 text-sm focus:outline-none"
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
            {rowState.isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
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
            'px-2 py-1 rounded inline-block max-w-xs truncate',
            isEditable
              ? rowState.isLoading
                ? 'bg-gray-100 text-gray-400'
                : 'bg-white border border-gray-200 text-gray-900 cursor-pointer hover:bg-blue-50 hover:text-blue-900 hover:border-blue-200'
              : 'bg-gray-50 text-gray-600'
          )}
          onClick={() => {
            if (!rowState.isLoading && isEditable) {
              handleCellClick(row.id, field, value);
            }
          }}
        >
          {formatValue(value)}
        </span>
        {rowState.isSaved && <CheckCircle className="h-3 w-3 text-green-600 animate-pulse" />}
        {rowState.error && <AlertCircle className="h-3 w-3 text-red-600" />}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Variants</h1>
          <p className="text-gray-500 mt-1">Manage variant pricing and stock in real-time</p>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-blue-600" />
          <Badge variant="outline" className="text-gray-600 bg-white border-gray-200">
            {filteredVariants.length} / {variants.length} rows
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

      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex justify-end">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by ID, product, name, storage, price, notes, etc."
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
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
          <AlertCircle className="h-4 w-4 text-red-900" />
          <AlertDescription>Failed to load variants. Please try again.</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-500">Loading variants...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 bg-gray-100" />
            ))}
          </CardContent>
        </Card>
      ) : filteredVariants.length === 0 ? (
        <Card className="bg-white border-gray-200 shadow-sm">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-500">{searchTerm ? 'No results found' : 'No variants found'}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                      {visibleColumns.map((col) => (
                        <th key={col.key} className="px-4 py-3 text-left font-semibold text-gray-600">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedVariants.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const preferredField = editableColumns.find((f) => row[f] !== undefined);
                              if (preferredField) {
                                handleCellClick(row.id, preferredField, row[preferredField]);
                              }
                            }}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Edit first editable field"
                            disabled={editableColumns.length === 0}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </td>
                        {visibleColumns.map((col) => (
                          <td key={col.key} className="px-4 py-3">
                            {renderTableCell(row, col.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                  <span className="font-semibold text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredVariants.length)}</span> of{' '}
                  <span className="font-semibold text-gray-900">{filteredVariants.length}</span> results
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

                  <div className="flex items-center space-x-1">
                    {totalPages <= 7 ? (
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
                      <>
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

                        {currentPage > 4 && <span className="px-2 text-gray-400">...</span>}

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

                        {currentPage < totalPages - 3 && <span className="px-2 text-gray-400">...</span>}

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
    </div>
  );
}
