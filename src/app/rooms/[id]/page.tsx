import { rooms } from '@/lib/placeholder-data';
import { RoomDetails } from '@/components/rooms/room-details';

export default function RoomDetailsPage({ params }: { params: { id: string } }) {
  const room = rooms.find((r) => r.id === params.id);

  if (!room) {
    return <div className="flex h-screen w-full items-center justify-center">Room not found</div>;
  }

  return <RoomDetails room={room} />;
}
