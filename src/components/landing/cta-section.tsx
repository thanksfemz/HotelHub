import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';

export function CtaSection() {
  const ctaImage = getPlaceholderImage('cta-background');
  return (
    <section id="contact" className="relative w-full py-20 md:py-28">
      <Image
        src={ctaImage.imageUrl}
        alt={ctaImage.description}
        fill
        className="object-cover"
        data-ai-hint={ctaImage.imageHint}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center text-primary-foreground">
        <h2 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Ready to Experience True Luxury?
        </h2>
        <p className="mx-auto mt-4 max-w-[600px] text-lg text-primary-foreground/80">
          Your journey into unparalleled elegance and comfort begins with a single click. Reserve your stay at HotelHub today.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            asChild
            className="bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-accent/90 hover:shadow-accent/40"
          >
            <Link href="#booking">Make a Reservation</Link>
          </Button>
        </div>
        <div className="mt-12 text-center text-primary-foreground/70">
            <p>For inquiries, call us at <a href="tel:+1234567890" className="underline hover:text-accent">+1 (234) 567-890</a></p>
            <p>or email <a href="mailto:reservations@hotelhub.com" className="underline hover:text-accent">reservations@hotelhub.com</a></p>
        </div>
      </div>
    </section>
  );
}
