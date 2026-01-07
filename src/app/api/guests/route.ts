import { NextResponse } from 'next/server';
import type { Guest } from '@/lib/types';
import { guests as mockGuests } from '@/lib/mock-data-layer';
import { bookings as mockBookings } from '@/lib/mock-data-layer';
import { format } from 'date-fns';

let guests: Guest[] = [...mockGuests].map(g => {
    const guestBookings = mockBookings.filter(b => b.guestId === g.id);
    const totalSpent = guestBookings.reduce((acc, b) => acc + b.totalAmount, 0);
    const lastVisit = guestBookings.length > 0
        ? format(new Date(Math.max(...guestBookings.map(b => new Date(b.checkInDate).getTime()))), 'yyyy-MM-dd')
        : undefined;

    return {
        ...g
    }
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  
  let data = [...guests];

  if (search) {
    data = data.filter(g => 
      `${g.firstName} ${g.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search)
    );
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newGuest: Guest = {
        ...body,
        id: `G${Math.floor(Math.random() * 1000) + 200}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
    guests.unshift(newGuest);
    return NextResponse.json(newGuest, { status: 201 });
}
