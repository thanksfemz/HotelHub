'use client';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/lib/services/roomService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Room } from '@/lib/types';
import Link from 'next/link';

export function RoomShowcase() {
  const { data: rooms = [], isLoading } = useQuery<Room[]>({
    queryKey: ['featuredRooms'],
    queryFn: () => roomService.getRooms({ limit: 3 }), // Assuming the backend supports a limit
  });

  return (
    <section id="rooms" className="w-full py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-headline text-4xl font-bold text-primary md:text-5xl">Our Exclusive Rooms</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Each of our rooms is a masterpiece of design, offering unparalleled comfort and breathtaking views.
          </p>
          <div className="mt-6 mx-auto w-24 h-1 bg-accent"></div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-lg">
                <CardHeader className="p-0">
                  <div className="aspect-[4/3] overflow-hidden">
                    <Skeleton className="h-full w-full" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                </CardContent>
                <CardFooter className="flex items-center justify-between p-6 pt-0">
                   <Skeleton className="h-8 w-24" />
                   <Skeleton className="h-10 w-28" />
                </CardFooter>
              </Card>
            ))
          ) : (
            rooms.map((room) => (
            <Card
              key={room.id}
              className="overflow-hidden border-none shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <CardHeader className="p-0">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Image
                    src={room.image.imageUrl}
                    alt={room.image.description}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-ai-hint={room.image.imageHint}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="font-headline text-2xl text-primary">{room.roomType}</CardTitle>
                <CardDescription className="mt-2 text-base line-clamp-3">{room.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex items-center justify-between p-6 pt-0">
                <div>
                  <span className="text-2xl font-bold text-accent">${room.price}</span>
                  <span className="text-sm text-muted-foreground">/night</span>
                </div>
                <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors">
                  <Link href={`/rooms/${room.id}`}>View Details</Link>
                </Button>
              </CardFooter>
              <div className="h-1 bg-accent" />
            </Card>
          ))
          )}
        </div>
      </div>
    </section>
  );
}
