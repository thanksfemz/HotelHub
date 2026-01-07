'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RoomStatus } from '@/lib/types';

const statusColors: Record<RoomStatus, string> = {
  AVAILABLE: 'bg-green-500/10 text-green-600 border-green-500/20',
  OCCUPIED: 'bg-red-500/10 text-red-600 border-red-500/20',
  MAINTENANCE: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  CLEANING: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

type RoomStatusBadgeProps = {
  status: RoomStatus;
  className?: string;
};

export function RoomStatusBadge({ status, className }: RoomStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('whitespace-nowrap', statusColors[status], className)}>
      {status}
    </Badge>
  );
}
