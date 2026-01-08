
'use client';

import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, LogIn, LogOut, XCircle } from 'lucide-react';
import type { Booking, BookingStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  CONFIRMED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  CHECKED_IN: 'bg-green-500/10 text-green-600 border-green-500/20',
  CHECKED_OUT: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  CANCELLED: 'bg-red-500/10 text-red-600 border-red-500/20',
};

type BookingTableProps = {
  bookings: Booking[];
};

export function BookingTable({ bookings }: BookingTableProps) {
  const router = useRouter();

  const handleAction = (bookingId: string, action: string) => {
    toast.info(`Performing ${action} for booking ${bookingId}`);
    // In a real app, you'd call a mutation here
  };

  const handleRowClick = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  };

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead className="hidden md:table-cell">Room</TableHead>
            <TableHead className="hidden lg:table-cell">Dates</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Amount</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking.id}
              onClick={() => handleRowClick(booking.id)}
              className="cursor-pointer"
            >
              <TableCell>
                <div className="font-medium">{booking.guestName}</div>
                <div className="text-xs text-muted-foreground">{booking.id}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">{booking.roomNumber}</TableCell>
              <TableCell className="hidden lg:table-cell">
                {format(parseISO(booking.checkInDate), 'PP')} - {format(parseISO(booking.checkOutDate), 'PP')}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={cn('whitespace-nowrap', statusColors[booking.status])}>
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-right font-medium">${booking.totalAmount.toFixed(2)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-haspopup="true"
                      size="icon"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => router.push(`/bookings/${booking.id}`)}>
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAction(booking.id, 'Check-in')}>
                      <LogIn className="mr-2 h-4 w-4" /> Check In
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAction(booking.id, 'Check-out')}>
                      <LogOut className="mr-2 h-4 w-4" /> Check Out
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleAction(booking.id, 'Cancel')} className="text-destructive">
                      <XCircle className="mr-2 h-4 w-4" /> Cancel Booking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

    