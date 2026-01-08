'use client';

import { useQuery } from '@tanstack/react-query';
import { serviceService } from '@/lib/services/serviceService';
import type { Amenity } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, SquareParking, UtensilsCrossed, Waves, Dumbbell, Sparkles } from 'lucide-react';

// Map service names to icons
const iconMap: Record<string, React.ElementType> = {
    'High-Speed Wi-Fi': Wifi,
    'Valet Parking': SquareParking,
    'Fine Dining Restaurant': UtensilsCrossed,
    'Infinity Pool': Waves,
    '24/7 Fitness Center': Dumbbell,
    'Luxury Spa': Sparkles,
};

export function Amenities() {
  // A real implementation might fetch this from a 'features' or 'amenities' endpoint.
  // For now, we'll keep it as static content within the component.
   const amenities: Amenity[] = [
    {
      icon: Wifi,
      name: 'High-Speed Wi-Fi',
      description: 'Stay connected with complimentary ultra-fast internet access throughout the hotel.',
    },
    {
      icon: SquareParking,
      name: 'Valet Parking',
      description: 'Enjoy the convenience and security of our professional valet parking service.',
    },
    {
      icon: UtensilsCrossed,
      name: 'Fine Dining Restaurant',
      description: 'Indulge in culinary masterpieces at our award-winning on-site restaurant.',
    },
    {
      icon: Waves,
      name: 'Infinity Pool',
      description: 'Relax and unwind in our stunning rooftop infinity pool with panoramic city views.',
    },
    {
      icon: Dumbbell,
      name: '24/7 Fitness Center',
      description: 'Maintain your workout routine in our state-of-the-art fitness center, open 24/7.',
    },
    {
      icon: Sparkles,
      name: 'Luxury Spa',
      description: 'Rejuvenate your body and mind with a wide range of treatments at our serene spa.',
    },
  ];


  return (
    <section id="amenities" className="w-full py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-headline text-4xl font-bold text-primary md:text-5xl">World-Class Amenities</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We provide our guests with an array of premium services to ensure a truly memorable stay.
          </p>
          <div className="mt-6 mx-auto w-24 h-1 bg-accent"></div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((amenity) => (
            <div key={amenity.name} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
                <amenity.icon className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">{amenity.name}</h3>
                <p className="mt-1 text-muted-foreground">{amenity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
