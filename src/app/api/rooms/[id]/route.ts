import { NextResponse } from 'next/server';
import { rooms as mockRooms } from '@/lib/mock-data-layer';
import type { Room } from '@/lib/types';


// In a real application, you would fetch this data from your database.
let rooms = [...mockRooms];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const room = rooms.find(r => r.id === params.id);
  if (room) {
    return NextResponse.json(room);
  }
  return NextResponse.json({ message: 'Room not found' }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const roomIndex = rooms.findIndex(r => r.id === params.id);
  if (roomIndex !== -1) {
    rooms[roomIndex] = { ...rooms[roomIndex], ...body };
    return NextResponse.json(rooms[roomIndex]);
  }
  return NextResponse.json({ message: 'Room not found' }, { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const roomIndex = rooms.findIndex(r => r.id === params.id);
  if (roomIndex !== -1) {
    rooms.splice(roomIndex, 1);
    return NextResponse.json({ message: 'Room deleted' });
  }
  return NextResponse.json({ message: 'Room not found' }, { status: 404 });
}
