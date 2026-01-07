
import type { LucideIcon } from 'lucide-react';

export interface ImagePlaceholder {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
}

export interface Amenity {
  icon: LucideIcon;
  name: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  rating: number;
  image: ImagePlaceholder;
}
