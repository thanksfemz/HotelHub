
import { NextResponse } from 'next/server';
import { bookings } from '@/lib/mock-data-layer';
import { parseISO, isWithinInterval } from 'date-fns';
import type { Booking } from '@/lib/types';


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Filtering
  const status = searchParams.get('status');
  const guest = searchParams.get('guest');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const limit = searchParams.get('limit');


  let data: Booking[] = [...bookings];

  // Apply filters
  if (status && status !== 'all') {
    data = data.filter(booking => booking.status === status);
  }
  if (guest) {
    data = data.filter(booking => 
      (booking.guestName && booking.guestName.toLowerCase().includes(guest.toLowerCase())) ||
      booking.id.toLowerCase().includes(guest.toLowerCase())
    );
  }
  if (from && to) {
    const fromDate = parseISO(from);
    const toDate = parseISO(to);
    data = data.filter(booking => {
        const checkInDate = parseISO(booking.checkInDate);
        return isWithinInterval(checkInDate, { start: fromDate, end: toDate });
    });
  }
  
    // Default sort by check-in date descending
    data.sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime());

    if(limit) {
      data = data.slice(0, parseInt(limit));
    }


  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newBooking: Booking = {
        id: `BK${Math.floor(Math.random() * 1000) + 2000}`,
        guestName: body.guest.name,
        guestId: body.guest.id,
        roomNumber: body.room.roomNumber,
        roomId: body.room.id,
        checkInDate: body.dates.from,
        checkOutDate: body.dates.to,
        status: 'CONFIRMED', // Default status for new bookings
        totalAmount: body.total,
        numberOfGuests: 2, // Example
        createdBy: 'user-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    return NextResponse.json(newBooking, { status: 201 });
}
