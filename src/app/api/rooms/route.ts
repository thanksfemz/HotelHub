import { NextResponse } from 'next/server';
import type { Room } from '@/lib/types';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { rooms as mockRooms } from '@/lib/mock-data-layer';

let rooms = [...mockRooms];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const search = searchParams.get('search');

  let data = [...rooms];

  if (search) {
    data = data.filter(room => room.roomNumber.toLowerCase().includes(search.toLowerCase()));
  }
  if (type && type !== 'all') {
    data = data.filter(room => room.roomType === type);
  }
  if (status && status !== 'all') {
    data = data.filter(room => room.status === status);
  }
  if (minPrice) {
    data = data.filter(room => room.price >= Number(minPrice));
  }
  if (maxPrice) {
    data = data.filter(room => room.price <= Number(maxPrice));
  }
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newRoom: Room = {
        ...body,
        id: `R${Math.floor(Math.random() * 1000) + 200}`,
        image: getPlaceholderImage('room-1'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
    rooms.unshift(newRoom); // Add to the beginning
    return NextResponse.json(newRoom, { status: 201 });
}
