
'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { format } from 'date-fns';
import { bookingService } from '@/lib/services/bookingService';
import type { Booking, BookingStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const statusColors: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  CONFIRMED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  CHECKED_IN: 'bg-green-500/10 text-green-600 border-green-500/20',
  CHECKED_OUT: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  CANCELLED: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export function RecentBookings() {
  const router = useRouter();

  const { data: bookings = [], isLoading, error } = useQuery<Booking[]>({
    queryKey: ['recentBookings'],
    queryFn: () => bookingService.getBookings({ limit: 5 }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Bookings</CardTitle>
        <CardDescription>An overview of the last 5 bookings.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            ))}
          </div>
        ) : error ? (
            <div className="text-center text-destructive">Failed to fetch recent bookings.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead className="hidden sm:table-cell">Room</TableHead>
                    <TableHead className="hidden md:table-cell">Check-in</TableHead>
                    <TableHead className="hidden md:table-cell">Check-out</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {bookings.map((booking) => (
                    <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/bookings/${booking.id}`)}>
                    <TableCell>
                        <div className="font-medium">{booking.guestName}</div>
                        <div className="text-xs text-muted-foreground">{booking.id}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{booking.roomNumber}</TableCell>
                    <TableCell className="hidden md:table-cell">{format(new Date(booking.checkInDate), 'PP')}</TableCell>
                    <TableCell className="hidden md:table-cell">{format(new Date(booking.checkOutDate), 'PP')}</TableCell>
                    <TableCell>
                        <Badge variant="outline" className={cn('whitespace-nowrap', statusColors[booking.status])}>
                        {booking.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">${booking.totalAmount.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        <Button asChild variant="ghost" size="sm">
            <Link href="/bookings">View All Bookings</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
