'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Pencil, Trash2 } from 'lucide-react';
import type { Room } from '@/lib/types';
import { RoomStatusBadge } from './room-status-badge';

type RoomCardProps = {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
};

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const displayedAmenities = room.amenities.slice(0, 3);
  const remainingAmenities = room.amenities.length - displayedAmenities.length;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col">
      <CardHeader className="p-0 relative">
        <div className="aspect-[16/9] overflow-hidden">
            <Image
                src={room.image.imageUrl}
                alt={room.image.description}
                fill
                className="object-cover"
                data-ai-hint={room.image.imageHint}
            />
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={(e) => {e.stopPropagation(); onEdit(room)}}>
                <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={(e) => {e.stopPropagation(); onDelete(room)}}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
        <div className="absolute bottom-2 left-2">
            <RoomStatusBadge status={room.status} />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-lg font-bold text-primary">{room.type} Room</h3>
                <p className="text-sm text-muted-foreground">Room {room.roomNumber}</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-accent">${room.price}</p>
                <p className="text-xs text-muted-foreground">/ night</p>
            </div>
        </div>

        <div className="mt-4 pt-4 border-t flex-grow flex flex-col justify-end text-sm text-muted-foreground">
            <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4" />
                <span>{room.capacity} Guests</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                {displayedAmenities.map(amenity => (
                    <span key={amenity} className="text-xs bg-muted px-2 py-1 rounded-full">{amenity}</span>
                ))}
                {remainingAmenities > 0 && (
                    <span className="text-xs font-medium text-accent">+{remainingAmenities} more</span>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
