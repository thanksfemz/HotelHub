import { NextResponse } from 'next/server';
import { format, addDays, subDays, parseISO, isWithinInterval } from 'date-fns';
import type { Booking, BookingStatus, PaymentStatus } from '@/lib/types';

// In a real application, you would fetch this data from your database.
// Here, we're generating mock data for demonstration purposes.

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Sorting
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  // Filtering
  const status = searchParams.get('status');
  const guest = searchParams.get('guest');
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  let data = [...mockBookings];

  // Apply filters
  if (status && status !== 'all') {
    data = data.filter(booking => booking.status === status);
  }
  if (guest) {
    data = data.filter(booking => 
      booking.guestName.toLowerCase().includes(guest.toLowerCase()) ||
      booking.id.toLowerCase().includes(guest.toLowerCase())
    );
  }
  if (from && to) {
    const fromDate = parseISO(from);
    const toDate = parseISO(to);
    data = data.filter(booking => {
        const checkInDate = parseISO(booking.checkIn);
        return isWithinInterval(checkInDate, { start: fromDate, end: toDate });
    });
  }


  // Apply sorting
  if (sort) {
    data.sort((a, b) => {
      const aValue = a[sort as keyof Booking];
      const bValue = b[sort as keyof Booking];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  } else {
    // Default sort by check-in date descending
     data.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json(data);
}
