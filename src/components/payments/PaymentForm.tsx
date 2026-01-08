
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { paymentService } from '@/lib/services/paymentService';
import { bookingService } from '@/lib/services/bookingService';
import type { Booking, PaymentMethod, CreatePaymentRequest } from '@/lib/types';
import { useState } from 'react';
import useAuthStore from '@/lib/stores/authStore';

const paymentMethods: PaymentMethod[] = ['CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'BANK_TRANSFER'];

const paymentSchema = z.object({
  bookingId: z.string().min(1, 'Booking is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  paymentMethod: z.enum(paymentMethods),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentForm({ onSuccess, onCancel }: PaymentFormProps) {
  const [bookingSearch, setBookingSearch] = useState('');
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const { data: bookings = [], isLoading: isLoadingBookings } = useQuery<Booking[]>({
    queryKey: ['bookings', { guest: bookingSearch }],
    queryFn: () => bookingService.getBookings({ guest: bookingSearch }),
  });

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      bookingId: '',
      amount: 0,
      paymentMethod: 'CREDIT_CARD',
      transactionId: '',
      notes: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentService.createPayment(data),
    onSuccess: () => {
      toast.success('Payment created successfully!');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['paymentSummary'] });
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create payment.');
    },
  });

  const onSubmit = (data: PaymentFormValues) => {
    if(!user) {
        toast.error("You must be logged in to create a payment.");
        return;
    }
    const requestData: CreatePaymentRequest = { ...data, createdBy: user.id };
    mutation.mutate(requestData);
  };

  const selectedBookingId = form.watch('bookingId');
  const selectedMethod = form.watch('paymentMethod');
  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <FormField
          control={form.control}
          name="bookingId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Booking</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                    >
                      {field.value && selectedBooking
                        ? `${selectedBooking?.guestName} - ${selectedBooking?.id}`
                        : "Select booking"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="Search by guest or booking ID..." onValueChange={setBookingSearch} />
                    <CommandList>
                      <CommandEmpty>{isLoadingBookings ? "Loading..." : "No booking found."}</CommandEmpty>
                      <CommandGroup>
                        {bookings.map((booking) => (
                          <CommandItem
                            value={`${booking.guestName} ${booking.id}`}
                            key={booking.id}
                            onSelect={() => {
                              form.setValue("bookingId", booking.id);
                              form.setValue("amount", booking.totalAmount);
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", booking.id === field.value ? "opacity-100" : "opacity-0")}
                            />
                            <div>
                                <p>{booking.guestName} ({booking.id})</p>
                                <p className="text-xs text-muted-foreground">
                                    Room {booking.roomNumber} - ${booking.totalAmount}
                                </p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter amount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method} value={method}>{method.replace(/_/g, ' ')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {selectedMethod !== 'CASH' && (
           <FormField
            control={form.control}
            name="transactionId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter transaction ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl><Textarea placeholder="Any payment-related notes..." {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Processing...' : 'Process Payment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
