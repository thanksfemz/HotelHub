'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { guestService } from '@/lib/services/guestService';
import type { Guest, Booking } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, Info } from 'lucide-react';
import { BookingTable } from '../bookings/booking-table';
import { format } from 'date-fns';

interface GuestProfileProps {
    guestId: string;
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) {
    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}

export function GuestProfile({ guestId }: GuestProfileProps) {
    const { data: guest, isLoading, error } = useQuery<Guest>({
        queryKey: ['guest', guestId],
        queryFn: () => guestService.getGuest(guestId),
    });

    const { data: bookings = [], isLoading: isLoadingBookings } = useQuery<Booking[]>({
        queryKey: ['guestBookings', guestId],
        queryFn: () => guestService.getGuestBookings(guestId),
    })

    if (isLoading) return <GuestProfileSkeleton />;
    if (error || !guest) return <div>Error loading guest profile.</div>;
    
    return (
        <div className="space-y-6 p-1 max-h-[80vh] overflow-y-auto pr-4">
            <Card>
                <CardContent className="p-6 flex flex-col sm:flex-row items-start gap-6">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                        <AvatarImage src={`https://avatar.vercel.sh/${guest.email}.png`} alt={guest.name} />
                        <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold font-headline text-primary">{guest.name}</h2>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2"><Mail className="h-4 w-4"/> {guest.email}</p>
                            <p className="flex items-center gap-2"><Phone className="h-4 w-4"/> {guest.phone}</p>
                            <p className="flex items-center gap-2"><MapPin className="h-4 w-4"/> {guest.address}</p>
                            {guest.idProofNumber && <p className="flex items-center gap-2"><Info className="h-4 w-4"/> {guest.idProofType}: {guest.idProofNumber}</p>}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
                <StatCard icon={Briefcase} label="Total Bookings" value={guest.totalBookings ?? bookings.length} />
                <StatCard icon={DollarSign} label="Total Spent" value={`$${(guest.totalSpent ?? 0).toLocaleString()}`} />
                <StatCard icon={Calendar} label="Last Visit" value={guest.lastVisit ? format(new Date(guest.lastVisit), 'PP') : 'N/A'} />
            </div>

            <Card>
                <CardHeader><CardTitle>Booking History</CardTitle></CardHeader>
                <CardContent>
                    {isLoadingBookings ? <Skeleton className="h-40 w-full" /> : <BookingTable bookings={bookings} />}
                </CardContent>
            </Card>
        </div>
    )
}

function GuestProfileSkeleton() {
    return (
         <div className="space-y-6 p-1">
            <Card>
                <CardContent className="p-6 flex flex-col sm:flex-row items-start gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-64" />
                        <Skeleton className="h-5 w-56" />
                        <Skeleton className="h-5 w-72" />
                    </div>
                </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4">
                <Skeleton className="h-24 flex-1" />
                <Skeleton className="h-24 flex-1" />
                <Skeleton className="h-24 flex-1" />
            </div>
            <Card>
                <CardHeader><Skeleton className="h-7 w-40" /></CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}
