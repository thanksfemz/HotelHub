import type { Amenity, Room, Testimonial } from '@/lib/types';
import { getPlaceholderImage } from './placeholder-images';
import { Wifi, SquareParking, UtensilsCrossed, Waves, Dumbbell, Sparkles } from 'lucide-react';

export const rooms: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: ReturnType<typeof getPlaceholderImage>;
}[] = [
  {
    id: 'deluxe-king-suite',
    name: 'Deluxe King Suite',
    description: 'A spacious and elegant suite with a stunning city view, perfect for a luxurious getaway.',
    price: 350,
    image: getPlaceholderImage('room-1'),
  },
  {
    id: 'executive-double-room',
    name: 'Executive Double Room',
    description: 'Comfort and style meet in this well-appointed room, ideal for business and leisure travelers.',
    price: 250,
    image: getPlaceholderImage('room-2'),
  },
  {
    id: 'classic-single-room',
    name: 'Classic Single Room',
    description: 'A cozy and modern room designed for solo travelers seeking comfort and convenience.',
    price: 180,
    image: getPlaceholderImage('room-3'),
  },
];

export const allAmenities = ['Wifi', 'TV', 'Air Conditioning', 'Mini-bar', 'Safe', 'Coffee Maker', 'Ocean View', 'Balcony'];


export const amenities: Amenity[] = [
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

export const testimonials: Testimonial[] = [
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
