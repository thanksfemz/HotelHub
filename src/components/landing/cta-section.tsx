import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CtaSection() {
  return (
    <section id="contact" className="w-full bg-primary text-primary-foreground py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">
          Ready to Experience True Luxury?
        </h2>
        <p className="mx-auto mt-4 max-w-[600px] text-lg text-primary-foreground/80">
          Your journey into unparalleled elegance and comfort begins with a single click. Reserve your stay at Grandeur Suites today.
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
            <p>or email <a href="mailto:reservations@grandeursuites.com" className="underline hover:text-accent">reservations@grandeursuites.com</a></p>
        </div>
      </div>
    </section>
  );
}
