import { NextResponse } from 'next/server';
import { bookings as mockBookings } from '@/lib/mock-data-layer';


export async function GET(request: Request, { params }: { params: { id: string } }) {
    const guestBookings = mockBookings.filter(b => b.guestId === params.id)
        .sort((a,b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());
    
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json(guestBookings);
}
