import { NextResponse } from 'next/server';
import type { Guest } from '@/lib/types';
import { guests as mockGuests } from '@/lib/mock-data-layer';

let guests = [...mockGuests];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  
  let data = [...guests];

  if (search) {
    data = data.filter(g => 
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase())
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
    }
    guests.unshift(newGuest);
    return NextResponse.json(newGuest, { status: 201 });
}
