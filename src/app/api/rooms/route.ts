import { NextResponse } from 'next/server';
import type { Room, RoomStatus, RoomType } from '@/lib/types';
import { getPlaceholderImage } from '@/lib/placeholder-images';

const roomTypes: RoomType[] = ['Single', 'Double', 'Suite', 'Deluxe'];
const roomStatuses: RoomStatus[] = ['Available', 'Occupied', 'Maintenance', 'Cleaning'];
const allAmenities = ['Wifi', 'TV', 'Air Conditioning', 'Mini-bar', 'Safe', 'Coffee Maker', 'Ocean View', 'Balcony'];

const mockRooms: Room[] = Array.from({ length: 150 }, (_, i) => {
    const type = roomTypes[i % roomTypes.length];
    const status = roomStatuses[i % roomStatuses.length];
    const capacity = type === 'Single' ? 1 : type === 'Double' ? 2 : type === 'Suite' ? 3 : 4;
    const price = 100 + (roomTypes.indexOf(type) * 50) + Math.floor(Math.random() * 50);

    return {
        id: `R${101 + i}`,
        roomNumber: `${Math.floor(i / 10) + 1}0${i % 10 + 1}`,
        type,
        status,
        price,
        capacity,
        amenities: allAmenities.slice(0, Math.floor(Math.random() * allAmenities.length) + 1),
        image: getPlaceholderImage(`room-${(i % 3) + 1}` as 'room-1' | 'room-2' | 'room-3'),
    };
});


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const status = searchParams.get('status');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const search = searchParams.get('search');

  let data = [...mockRooms];

  if (search) {
    data = data.filter(room => room.roomNumber.toLowerCase().includes(search.toLowerCase()));
  }
  if (type && type !== 'all') {
    data = data.filter(room => room.type === type);
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
    const newRoom = {
        ...body,
        id: `R${Math.floor(Math.random() * 1000) + 200}`,
        image: getPlaceholderImage('room-1'),
    }
    mockRooms.push(newRoom);
    return NextResponse.json(newRoom, { status: 201 });
}
