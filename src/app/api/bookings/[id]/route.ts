import { NextResponse } from 'next/server';
import { format, addDays, subDays } from 'date-fns';
import type { Booking, BookingStatus, PaymentStatus } from '@/lib/types';

// This is the same mock data generation as in the main bookings route
const statuses: BookingStatus[] = ['Confirmed', 'Checked-in', 'Checked-out', 'Pending', 'Cancelled'];
const paymentStatuses: PaymentStatus[] = ['Paid', 'Pending', 'Refunded'];
const guestNames = ['John Doe', 'Jane Smith', 'Peter Jones', 'Susan Williams', 'Michael Brown', 'Emily Davis', 'Chris Wilson', 'Patricia Taylor'];

const mockBookings: Booking[] = Array.from({ length: 150 }, (_, i) => {
  const checkInDate = subDays(new Date(), Math.floor(Math.random() * 90) - 30);
  const checkOutDate = addDays(checkInDate, Math.floor(Math.random() * 10) + 1);
  const status = statuses[i % statuses.length];

  return {
    id: `BK${1001 + i}`,
    guestName: guestNames[i % guestNames.length],
    guestId: `G${101 + (i % guestNames.length)}`,
    roomNumber: `${Math.floor(i / 10) + 101}`,
    roomId: `R${101 + Math.floor(i/10)}`,
    checkIn: format(checkInDate, 'yyyy-MM-dd'),
    checkOut: format(checkOutDate, 'yyyy-MM-dd'),
    status: status,
    paymentStatus: paymentStatuses[i % paymentStatuses.length],
    totalAmount: Math.floor(Math.random() * 800) + 150,
  };
});


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const booking = mockBookings.find(b => b.id === params.id);

  if (booking) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(booking);
  }
  
  return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const index = mockBookings.findIndex(b => b.id === params.id);
    if (index !== -1) {
        const body = await request.json();
        mockBookings[index] = { ...mockBookings[index], ...body };
        await new Promise(resolve => setTimeout(resolve, 500));
        return NextResponse.json(mockBookings[index]);
    }
    return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
}
