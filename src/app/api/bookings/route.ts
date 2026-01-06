import { NextResponse } from 'next/server';
import { format, addDays, subDays } from 'date-fns';
import type { Booking, BookingStatus } from '@/lib/types';

// In a real application, you would fetch this data from your database.
// Here, we're generating mock data for demonstration purposes.

const statuses: BookingStatus[] = ['Confirmed', 'Checked-in', 'Checked-out', 'Pending', 'Cancelled'];

const mockBookings: Booking[] = Array.from({ length: 50 }, (_, i) => {
  const checkInDate = subDays(new Date(), Math.floor(Math.random() * 60) - 15);
  const checkOutDate = addDays(checkInDate, Math.floor(Math.random() * 7) + 1);
  const status = statuses[i % statuses.length];

  return {
    id: `BK${1001 + i}`,
    guestName: ['John Doe', 'Jane Smith', 'Peter Jones', 'Susan Williams', 'Michael Brown'][i % 5],
    roomNumber: `${Math.floor(i / 5) + 101}`,
    checkIn: format(checkInDate, 'yyyy-MM-dd'),
    checkOut: format(checkOutDate, 'yyyy-MM-dd'),
    status: status,
    amount: Math.floor(Math.random() * 500) + 150,
  };
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('_limit');
  const sort = searchParams.get('_sort');
  const order = searchParams.get('_order');

  let data = [...mockBookings];

  if (sort) {
    data.sort((a, b) => {
      const aValue = a[sort as keyof Booking];
      const bValue = b[sort as keyof Booking];

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  if (limit) {
    data = data.slice(0, parseInt(limit, 10));
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json(data);
}
