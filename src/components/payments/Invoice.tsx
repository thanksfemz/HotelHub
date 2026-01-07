
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { bookingService } from '@/lib/services/bookingService';
import { guestService } from '@/lib/services/guestService';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo';
import { format, differenceInDays } from 'date-fns';
import type { Payment, Booking, Guest } from '@/lib/types';
import { Printer } from 'lucide-react';

interface InvoiceProps {
  payment: Payment;
}

export function Invoice({ payment }: InvoiceProps) {
  const { data: booking, isLoading: isLoadingBooking } = useQuery<Booking>({
    queryKey: ['booking', payment.bookingId],
    queryFn: () => bookingService.getBooking(payment.bookingId),
    enabled: !!payment.bookingId,
  });

  const { data: guest, isLoading: isLoadingGuest } = useQuery<Guest>({
    queryKey: ['guest', booking?.guestId],
    queryFn: () => guestService.getGuest(booking!.guestId),
    enabled: !!booking?.guestId,
  });

  const isLoading = isLoadingBooking || isLoadingGuest;

  const handlePrint = () => {
    window.print();
  };
  
  if (isLoading || !booking || !guest) {
      return (
          <DialogContent className="sm:max-w-3xl">
              <Skeleton className="h-[600px] w-full" />
          </DialogContent>
      )
  }
  
  const nights = differenceInDays(new Date(booking.checkOut), new Date(booking.checkIn));
  const roomCost = booking.totalAmount / (nights || 1); // Avoid division by zero
  const taxRate = 0.1; // 10%
  const subTotal = booking.totalAmount;
  const tax = subTotal * taxRate;
  const total = subTotal + tax;


  return (
    <DialogContent className="sm:max-w-3xl print:max-w-full print:border-none print:shadow-none">
      <div id="invoice-content" className="p-8">
        <header className="flex justify-between items-start pb-6 border-b">
            <div className="space-y-1">
                <Logo />
                <p className="text-sm text-muted-foreground">123 Luxury Ave, Metropolis</p>
                <p className="text-sm text-muted-foreground">contact@hotelhub.com</p>
            </div>
            <div className="text-right">
                <h2 className="text-3xl font-bold font-headline text-primary">Invoice</h2>
                <p className="text-muted-foreground">#{payment.id}</p>
                <p className="text-sm text-muted-foreground">Date: {format(new Date(payment.date), 'PPP')}</p>
            </div>
        </header>

        <section className="grid grid-cols-2 gap-8 my-8">
            <div>
                <h3 className="font-semibold text-muted-foreground mb-2">Bill To</h3>
                <p className="font-bold">{guest.name}</p>
                <p>{guest.address}</p>
                <p>{guest.email}</p>
                <p>{guest.phone}</p>
            </div>
             <div className="text-right">
                <h3 className="font-semibold text-muted-foreground mb-2">Booking Details</h3>
                <p><span className="font-semibold">Booking ID:</span> {booking.id}</p>
                <p><span className="font-semibold">Room:</span> {booking.roomNumber}</p>
                <p><span className="font-semibold">Check-in:</span> {format(new Date(booking.checkIn), 'PPP')}</p>
                <p><span className="font-semibold">Check-out:</span> {format(new Date(booking.checkOut), 'PPP')}</p>
             </div>
        </section>

        <section>
            <table className="w-full text-sm">
                <thead className="bg-muted">
                    <tr>
                        <th className="p-2 text-left font-semibold">Description</th>
                        <th className="p-2 text-center font-semibold">Quantity</th>
                        <th className="p-2 text-right font-semibold">Unit Price</th>
                        <th className="p-2 text-right font-semibold">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b">
                        <td className="p-2">Room Charges ({booking.roomNumber})</td>
                        <td className="p-2 text-center">{nights} night(s)</td>
                        <td className="p-2 text-right">${roomCost.toFixed(2)}</td>
                        <td className="p-2 text-right">${subTotal.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section className="flex justify-end mt-8">
            <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between font-bold text-lg text-green-600">
                    <span>Amount Paid</span>
                    <span>${payment.amount.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between font-bold">
                    <span>Balance Due</span>
                    <span>${(total - payment.amount).toFixed(2)}</span>
                </div>
            </div>
        </section>

        <footer className="mt-12 pt-6 border-t text-center text-xs text-muted-foreground">
            <p>Thank you for choosing HotelHub!</p>
            <p>Payment is due within 30 days. Please contact us for any questions.</p>
        </footer>
      </div>

      <DialogFooter className="print:hidden">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
