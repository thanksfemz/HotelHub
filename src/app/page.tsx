import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { RoomShowcase } from '@/components/landing/room-showcase';
import { Amenities } from '@/components/landing/amenities';
import { Testimonials } from '@/components/landing/testimonials';
import { Gallery } from '@/components/landing/gallery';
import { CtaSection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <RoomShowcase />
        <Amenities />
        <Testimonials />
        <Gallery />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
