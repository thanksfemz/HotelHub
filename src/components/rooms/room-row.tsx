
'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Pencil, Trash2 } from 'lucide-react';
import type { Room } from '@/lib/types';
import { RoomStatusBadge } from './room-status-badge';
import { useRouter } from 'next/navigation';

type RoomRowProps = {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
};

export function RoomRow({ room, onEdit, onDelete }: RoomRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    // router.push(`/rooms/${room.id}`);
    console.log('Navigate to room details');
  };

  return (
    <Card
      onClick={handleRowClick}
      className="p-4 grid grid-cols-[60px_1fr_auto] sm:grid-cols-[80px_3fr_1.5fr_1fr_1fr_auto] items-center gap-4 cursor-pointer hover:bg-muted/50 transition-colors"
    >
      <div className="relative aspect-square rounded-md overflow-hidden">
        <Image
          src={room.imageUrl}
          alt={room.description}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 60px, 80px"
        />
      </div>

      <div>
        <p className="font-bold text-primary">Room {room.roomNumber}</p>
        <p className="text-sm text-muted-foreground">{room.roomType}</p>
      </div>

      <div className="hidden sm:block">
        <RoomStatusBadge status={room.status} />
      </div>

      <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{room.capacity}</span>
      </div>

      <div className="hidden sm:block text-right">
        <p className="font-semibold text-accent">${room.price.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">/ night</p>
      </div>
      
      <div className="flex items-center gap-2 justify-end">
         <RoomStatusBadge status={room.status} className="sm:hidden" />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => {e.stopPropagation(); onEdit(room)}}>
            <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => {e.stopPropagation(); onDelete(room)}}>
            <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
