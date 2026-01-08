
'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Search, Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { paymentService } from '@/lib/services/paymentService';
import type { Payment, PaymentFilters as PaymentFiltersType, PaymentMethod, PaymentStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileText, Undo2 } from 'lucide-react';

import { PaymentSummary } from '@/components/payments/PaymentSummary';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { Invoice } from '@/components/payments/Invoice';
import { RefundDialog } from '@/components/payments/RefundDialog';
import { cn } from '@/lib/utils';

const paymentMethods: ('all' | PaymentMethod)[] = ['all', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'BANK_TRANSFER'];
const paymentStatuses: ('all' | PaymentStatus)[] = ['all', 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];

const statusColors: Record<PaymentStatus, string> = {
  COMPLETED: 'bg-green-500/10 text-green-600 border-green-500/20',
  PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  REFUNDED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  FAILED: 'bg-red-500/10 text-red-600 border-red-500/20',
};


export default function PaymentsPage() {
  const [filters, setFilters] = useState<PaymentFiltersType>({ method: 'all', status: 'all', dateRange: {} });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Payment | null>(null);
  const [refundingPayment, setRefundingPayment] = useState<Payment | null>(null);

  const queryClient = useQueryClient();

  const { data: payments = [], isLoading, error } = useQuery<Payment[]>({
    queryKey: ['payments', filters],
    queryFn: () => paymentService.getPayments(filters),
  });

  const handleFilterChange = <K extends keyof PaymentFiltersType>(key: K, value: PaymentFiltersType[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    handleFilterChange('dateRange', { from: range?.from, to: range?.to });
  };
  
  const clearFilters = () => {
    setFilters({ method: 'all', status: 'all', dateRange: {} });
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['payments'] });
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      );
    }
    if (error) {
      return <div className="text-center py-16 text-destructive">Failed to load payments. Please try again.</div>;
    }
    if (payments.length === 0) {
        return (
            <div className="text-center py-16 text-muted-foreground">
                <h3 className="text-lg font-semibold">No payments found</h3>
                <p>There are no payments matching your search.</p>
                <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Payment
                </Button>
            </div>
        );
    }
    return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead className="hidden md:table-cell">Booking ID</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden sm:table-cell">Method</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map(payment => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-xs">{payment.id}</TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs">{payment.bookingId}</TableCell>
                <TableCell>{payment.guestName}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell className="hidden sm:table-cell">{payment.paymentMethod.replace('_', ' ')}</TableCell>
                <TableCell className="hidden sm:table-cell">{format(new Date(payment.paymentDate), 'PP')}</TableCell>
                <TableCell><Badge variant="outline" className={cn(statusColors[payment.paymentStatus])}>{payment.paymentStatus}</Badge></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onSelect={() => setViewingInvoice(payment)}><FileText className="mr-2"/>View Invoice</DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setRefundingPayment(payment)} disabled={payment.paymentStatus !== 'COMPLETED'}><Undo2 className="mr-2"/>Refund</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    );
  };


  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-headline text-primary">Payments</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2" />
          Add Payment
        </Button>
      </div>

      <PaymentSummary />

      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={filters.status} onValueChange={(v) => handleFilterChange('status', v as any)}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>{paymentStatuses.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.method} onValueChange={(v) => handleFilterChange('method', v as any)}>
              <SelectTrigger><SelectValue placeholder="Method" /></SelectTrigger>
              <SelectContent>{paymentMethods.map(m => <SelectItem key={m} value={m}>{m === 'all' ? 'All Methods' : m.replace('_', ' ')}</SelectItem>)}</SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button id="date" variant={"outline"} className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange?.from ? (
                    filters.dateRange.to ? (
                      <>{format(filters.dateRange.from, "LLL dd, y")} - {format(filters.dateRange.to, "LLL dd, y")}</>
                    ) : (format(filters.dateRange.from, "LLL dd, y"))
                  ) : (<span>Pick a date range</span>)}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar initialFocus mode="range" selected={{ from: filters.dateRange.from, to: filters.dateRange.to }} onSelect={handleDateRangeChange} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" onClick={clearFilters}><X className="mr-2" />Clear Filters</Button>
        </div>
      </div>
      
      <div className="rounded-lg border">
        {renderContent()}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>New Payment</DialogTitle></DialogHeader>
            <PaymentForm onSuccess={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!viewingInvoice} onOpenChange={(isOpen) => !isOpen && setViewingInvoice(null)}>
        {viewingInvoice && <Invoice payment={viewingInvoice} />}
      </Dialog>

      {refundingPayment && (
          <RefundDialog 
            payment={refundingPayment}
            isOpen={!!refundingPayment}
            onOpenChange={(isOpen) => !isOpen && setRefundingPayment(null)}
            onSuccess={() => {
                setRefundingPayment(null);
                queryClient.invalidateQueries({queryKey: ['payments']});
            }}
          />
      )}

    </div>
  );
}
