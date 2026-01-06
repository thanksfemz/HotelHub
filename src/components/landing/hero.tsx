'use client';

import Image from 'next/image';
import { z } from 'zod';
import { format } from 'date-fns';

import { getPlaceholderImage } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BookingForm } from '../booking-form';

const bookingFormSchema = z.object({
  checkIn: z.date({
    required_error: 'Check-in date is required.',
  }),
  checkOut: z.date({
    required_error: 'Check-out date is required.',
  }),
  guests: z.coerce.number().min(1, { message: 'Must have at least 1 guest.' }),
});

export function Hero() {
  const heroImage = getPlaceholderImage('hero-background');

  function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    toast.info('Searching for rooms...', {
      description: `Checking availability for ${format(values.checkIn, 'PPP')} to ${format(
        values.checkOut,
        'PPP'
      )} for ${values.guests} guest(s).`,
    });
  }

  return (
    <section id="home" className="relative h-[80vh] min-h-[500px] md:h-screen">
      <Image
        src={heroImage.imageUrl}
        alt={heroImage.description}
        fill
        className="object-cover"
        priority
        data-ai-hint={heroImage.imageHint}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
        <div className="container px-4 md:px-6">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            Experience Luxury Beyond Compare
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-lg text-primary-foreground/90 md:text-xl">
            Discover a world of elegance and unmatched hospitality. Your unforgettable stay awaits.
          </p>
          <div className="mt-8">
            <a href="#booking">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-accent/90 hover:shadow-accent/40"
              >
                Book Your Stay
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div id="booking" className="absolute -bottom-24 md:-bottom-16 left-1/2 w-full max-w-6xl -translate-x-1/2 px-4">
        <div className="rounded-lg bg-background p-6 shadow-2xl">
          <BookingForm onSearch={onSubmit} className="md:grid-cols-4" />
        </div>
      </div>
    </section>
  );
}
