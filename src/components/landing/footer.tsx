import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { Logo } from '@/components/logo';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-16 md:grid-cols-3 md:px-6">
        <div className="space-y-4">
          <Logo className="text-primary-foreground" />
          <p className="max-w-xs text-sm text-primary-foreground/70">
            Experience an oasis of luxury and comfort at Grandeur Suites, where every stay is a memorable journey.
          </p>
        </div>
        <div className="space-y-4">
          <h4 className="font-headline text-lg font-semibold tracking-tight">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#home" className="text-primary-foreground/70 transition-colors hover:text-accent" prefetch={false}>Home</Link></li>
            <li><Link href="#rooms" className="text-primary-foreground/70 transition-colors hover:text-accent" prefetch={false}>Rooms</Link></li>
            <li><Link href="#amenities" className="text-primary-foreground/70 transition-colors hover:text-accent" prefetch={false}>Amenities</Link></li>
            <li><Link href="#gallery" className="text-primary-foreground/70 transition-colors hover:text-accent" prefetch={false}>Gallery</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="font-headline text-lg font-semibold tracking-tight">Contact Us</h4>
          <div className="space-y-2 text-sm text-primary-foreground/70">
            <p>123 Luxury Avenue, Metropolis, 12345</p>
            <p>Email: <a href="mailto:info@grandeursuites.com" className="hover:text-accent hover:underline">info@grandeursuites.com</a></p>
            <p>Phone: <a href="tel:+1234567890" className="hover:text-accent hover:underline">+1 (234) 567-890</a></p>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            <Link href="#" aria-label="Facebook" className="text-primary-foreground/70 transition-colors hover:text-accent" prefetch={false}><Facebook className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Twitter" className="text-primary-foreground/70 transition-colors hover:text-accent" prefetch={false}><Twitter className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Instagram" className="text-primaryforeground/70 transition-colors hover:text-accent" prefetch={false}><Instagram className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between px-4 text-sm text-primary-foreground/50 md:flex-row md:px-6">
          <p>&copy; {new Date().getFullYear()} Grandeur Suites. All rights reserved.</p>
          <div className="mt-4 flex gap-4 md:mt-0">
            <Link href="#" className="hover:text-accent hover:underline" prefetch={false}>Privacy Policy</Link>
            <Link href="#" className="hover:text-accent hover:underline" prefetch={false}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
