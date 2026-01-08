
'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import type { Testimonial } from '@/lib/types';


export function Testimonials() {

    // This data is typically static or comes from a CMS.
    // For this app, we'll keep it within the component.
    const testimonials: Testimonial[] = [
    {
        quote: 'An unforgettable experience of pure luxury and impeccable service. From the moment we arrived, we felt like royalty. We will definitely be back!',
        name: 'Emily & James Turner',
        location: 'London, UK',
        rating: 5,
        image: getPlaceholderImage('testimonial-1'),
    },
    {
        quote: 'The attention to detail at HotelHub is simply unparalleled. Every aspect of our stay was perfect. The best hotel I have ever stayed in.',
        name: 'Alexandra Chen',
        location: 'Singapore',
        rating: 5,
        image: getPlaceholderImage('testimonial-2'),
    },
    {
        quote: 'As a frequent business traveler, I can confidently say HotelHub sets the standard for luxury and comfort. The staff was incredibly attentive.',
        name: 'David Rodriguez',
        location: 'New York, USA',
        rating: 5,
        image: getPlaceholderImage('testimonial-3'),
    },
    ];


  return (
    <section id="testimonials" className="w-full py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-headline text-4xl font-bold text-primary md:text-5xl">Guest Experiences</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear what our esteemed guests have to say about their stay at HotelHub.
          </p>
          <div className="mt-6 mx-auto w-24 h-1 bg-accent"></div>
        </div>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full border-none bg-secondary shadow-lg flex flex-col">
                    <CardContent className="flex flex-col items-center p-8 text-center flex-1">
                      <Image
                        src={testimonial.image.imageUrl}
                        alt={testimonial.image.description}
                        width={80}
                        height={80}
                        className="mb-4 rounded-full"
                        data-ai-hint={testimonial.image.imageHint}
                      />
                      <p className="mb-4 font-headline text-lg italic text-primary flex-grow">
                        &quot;{testimonial.quote}&quot;
                      </p>
                      <div className="flex items-center gap-1">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                          ))}
                      </div>
                      <p className="mt-4 text-sm font-semibold text-primary">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
