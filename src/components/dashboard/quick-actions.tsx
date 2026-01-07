'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, LogIn, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function QuickActions() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <Button size="lg" onClick={() => router.push('/bookings?new=true')}>
          <Plus className="mr-2 h-5 w-5" />
          New Booking
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/bookings?status=CHECKED_IN">
            <LogIn className="mr-2 h-5 w-5" />
            Check In
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/bookings?status=CHECKED_OUT">
            <LogOut className="mr-2 h-5 w-5" />
            Check Out
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
