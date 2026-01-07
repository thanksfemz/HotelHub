
import { NextResponse } from 'next/server';
import { bookings } from '@/lib/mock-data-layer';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const booking = bookings.find(b => b.id === params.id);

  if (booking) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(booking);
  }
  
  return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const index = bookings.findIndex(b => b.id === params.id);
    if (index !== -1) {
        const body = await request.json();
        const updatedBooking = { ...bookings[index], ...body };
        bookings[index] = updatedBooking;
        await new Promise(resolve => setTimeout(resolve, 500));
        return NextResponse.json(updatedBooking);
    }
    return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
}
