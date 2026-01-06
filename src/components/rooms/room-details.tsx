import Image from 'next/image';
import type { Room } from '@/lib/types';
import { amenities } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { Hero } from '@/components/landing/hero';

export function RoomDetails({ room }: { room: Room }) {
  return (
    <>
    <div className="w-full">
      <div className="relative h-[50vh] bg-background">
        <Image
          src={room.image.imageUrl}
          alt={room.image.description}
          fill
          className="object-cover"
          data-ai-hint={room.image.imageHint}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <h1 className="font-headline text-5xl font-bold">{room.name}</h1>
        </div>
      </div>

      <div className="container mx-auto -mt-20 px-4">
        <Card className="p-6 md:p-10">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="font-headline text-3xl font-bold text-primary">Room Description</h2>
              <div className="mt-4 h-1 w-20 bg-accent" />
              <p className="mt-6 text-lg text-muted-foreground">{room.description}</p>

              <h3 className="mt-10 font-headline text-2xl font-bold text-primary">Amenities</h3>
              <div className="mt-3 h-1 w-16 bg-accent" />
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {amenities.slice(0, 4).map((amenity) => (
                  <li key={amenity.name} className="flex items-center gap-3">
                    <amenity.icon className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">{amenity.name}</span>
                  </li>
                ))}
                 <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">King-sized Bed</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">Rainfall Shower</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">Minibar</span>
                  </li>
                   <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">Smart TV</span>
                  </li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <Card className="bg-secondary p-6">
                <CardContent className="p-0">
                  <h3 className="font-headline text-2xl font-bold text-primary">Reserve Your Stay</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-accent">${room.price}</span>
                    <span className="text-muted-foreground">/ night</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Includes taxes and fees.
                  </p>
                  <div className="mt-6">
                    <Hero />
                  </div>
                  <Button size="lg" className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </>
  );
}
