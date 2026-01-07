'use client';

import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/lib/services/bookingService';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, BedDouble, Calendar, DollarSign, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { BookingStatus } from '@/lib/types';
import { useRouter } from 'next/navigation';

const statusColors: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  CONFIRMED: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  CHECKED_IN: 'bg-green-500/10 text-green-600 border-green-500/20',
  CHECKED_OUT: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
  CANCELLED: 'bg-red-500/10 text-red-600 border-red-500/20',
};

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) {
    return (
        <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    )
}

export default function BookingDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', params.id],
    queryFn: () => bookingService.getBooking(params.id),
  });

  if (isLoading) {
    return <BookingDetailsSkeleton />;
  }

  if (error || !booking) {
    // In a real app, you might show a more specific error page
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-3xl font-bold font-headline text-primary">Booking Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-2xl">Booking ID: {booking.id}</CardTitle>
                            <CardDescription>
                                Booked on {format(new Date(booking.createdAt), 'PP')}
                            </CardDescription>
                        </div>
                        <Badge className={cn('text-base', statusColors[booking.status])} variant="outline">{booking.status}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                   <DetailItem icon={User} label="Guest" value={
                        <Link href={`/guests/${booking.guestId}`} className="text-primary hover:underline font-semibold">
                            {booking.guestName}
                        </Link>
                   } />
                   <DetailItem icon={BedDouble} label="Room" value={
                        <Link href={`/rooms/${booking.roomId}`} className="text-primary hover:underline font-semibold">
                            Room {booking.roomNumber}
                        </Link>
                   } />
                   <DetailItem icon={Calendar} label="Check-in" value={format(new Date(booking.checkInDate), 'EEEE, MMMM d, yyyy')} />
                   <DetailItem icon={Calendar} label="Check-out" value={format(new Date(booking.checkOutDate), 'EEEE, MMMM d, yyyy')} />
                   <DetailItem icon={DollarSign} label="Total Amount" value={`$${booking.totalAmount.toFixed(2)}`} />
                   <DetailItem icon={CreditCard} label="Payment Status" value={
                    <Badge variant={booking.paymentStatus === 'PAID' ? 'default' : 'secondary'} className={booking.paymentStatus === 'PAID' ? 'bg-green-600' : ''}>
                        {booking.paymentStatus}
                    </Badge>
                   } />
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button className="w-full">Check In</Button>
                    <Button variant="outline" className="w-full">Check Out</Button>
                    <Button variant="outline" className="w-full">Send Confirmation</Button>
                    <Button variant="destructive" className="w-full">Cancel Booking</Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}


function BookingDetailsSkeleton() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6 flex items-center gap-4">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-9 w-64" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Skeleton className="h-8 w-48 mb-2" />
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <Skeleton className="h-10 w-10" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-5 w-32" />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-7 w-24" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
