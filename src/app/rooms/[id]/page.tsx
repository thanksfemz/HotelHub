'use client';

import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/lib/services/roomService';
import { notFound } from 'next/navigation';
import { RoomDetails } from '@/components/rooms/room-details';
import { Skeleton } from '@/components/ui/skeleton';

function RoomDetailsPageSkeleton() {
    return (
        <div className="w-full pb-20">
            <Skeleton className="h-[50vh] w-full" />
            <div className="container mx-auto -mt-20 px-4">
                <Card className="p-6 md:p-10">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-1 w-20" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-5/6" />

                            <Skeleton className="h-8 w-1/3 mt-10" />
                            <Skeleton className="h-1 w-16" />
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <Skeleton key={i} className="h-6 w-full" />
                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-1">
                            <Skeleton className="h-full w-full min-h-[400px]" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

import { Card } from '@/components/ui/card';

export default function RoomDetailsPage({ params }: { params: { id: string } }) {
  const { data: room, isLoading, error } = useQuery({
      queryKey: ['room', params.id],
      queryFn: () => roomService.getRoom(params.id)
  });

  if (isLoading) {
    return <RoomDetailsPageSkeleton />;
  }

  if (error || !room) {
    notFound();
  }

  return <RoomDetails room={room} />;
}
