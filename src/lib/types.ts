import type { LucideIcon } from 'lucide-react';
import type { ImagePlaceholder } from './placeholder-images';

export type Room = {
  name: string;
  description: string;
  price: number;
  image: ImagePlaceholder;
};

export type Amenity = {
  icon: LucideIcon;
  name: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  rating: number;
  image: ImagePlaceholder;
};

export type OccupancyData = {
  date: string;
  occupancy: number;
};

export type RevenueData = {
  date: string;
  revenue: number;
};
