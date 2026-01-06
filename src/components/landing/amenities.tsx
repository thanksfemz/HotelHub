import { amenities } from '@/lib/placeholder-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Amenities() {
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
