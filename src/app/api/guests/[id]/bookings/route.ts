import { NextResponse } from 'next/server';
import { bookings as mockBookings } from '@/lib/mock-data-layer';


export async function GET(request: Request, { params }: { params: { id: string } }) {
    const guestBookings = mockBookings.filter(b => b.guestId === params.id)
        .sort((a,b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
    
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json(guestBookings);
}
