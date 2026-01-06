import { Hotel } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2 text-primary-foreground', className)}
      prefetch={false}
    >
      <Hotel className="h-7 w-7 text-accent" />
      <span className="font-headline text-2xl font-bold tracking-tight">
        Grandeur Suites
      </span>
    </Link>
  );
}
