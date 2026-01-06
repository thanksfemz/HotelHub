import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';

const galleryImages = [
  'gallery-1',
  'gallery-2',
  'gallery-3',
  'gallery-4',
  'gallery-5',
  'gallery-6',
].map(getPlaceholderImage);

export function Gallery() {
  return (
    <section id="gallery" className="w-full py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-headline text-4xl font-bold text-primary md:text-5xl">Our Gallery</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A glimpse into the world of luxury that awaits you at Grandeur Suites.
          </p>
          <div className="mt-6 mx-auto w-24 h-1 bg-accent"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="grid gap-4">
            <div className="group overflow-hidden rounded-lg">
              <Image
                src={galleryImages[0].imageUrl}
                alt={galleryImages[0].description}
                width={600}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={galleryImages[0].imageHint}
              />
            </div>
            <div className="group overflow-hidden rounded-lg">
              <Image
                src={galleryImages[1].imageUrl}
                alt={galleryImages[1].description}
                width={800}
                height={600}
                className="h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={galleryImages[1].imageHint}
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="group overflow-hidden rounded-lg">
              <Image
                src={galleryImages[2].imageUrl}
                alt={galleryImages[2].description}
                width={800}
                height={600}
                className="h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={galleryImages[2].imageHint}
              />
            </div>
            <div className="group overflow-hidden rounded-lg">
              <Image
                src={galleryImages[3].imageUrl}
                alt={galleryImages[3].description}
                width={600}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={galleryImages[3].imageHint}
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="group overflow-hidden rounded-lg">
              <Image
                src={galleryImages[4].imageUrl}
                alt={galleryImages[4].description}
                width={600}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={galleryImages[4].imageHint}
              />
            </div>
            <div className="group overflow-hidden rounded-lg">
              <Image
                src={galleryImages[5].imageUrl}
                alt={galleryImages[5].description}
                width={800}
                height={600}
                className="h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={galleryImages[5].imageHint}
              />
            </div>
          </div>
           <div className="grid gap-4">
            <div className="group overflow-hidden rounded-lg">
              <Image
                src={getPlaceholderImage('room-1').imageUrl}
                alt={getPlaceholderImage('room-1').description}
                width={800}
                height={600}
                className="h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={getPlaceholderImage('room-1').imageHint}
              />
            </div>
            <div className="group overflow-hidden rounded-lg">
              <Image
                src={getPlaceholderImage('room-2').imageUrl}
                alt={getPlaceholderImage('room-2').description}
                width={600}
                height={800}
                className="h-auto w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                data-ai-hint={getPlaceholderImage('room-2').imageHint}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
