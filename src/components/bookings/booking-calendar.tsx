'use client';

import React, { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isSameMonth,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
  startOfWeek,
  endOfWeek,
  differenceInDays,
  addDays
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Booking, BookingStatus } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

const statusColors: Record<BookingStatus, string> = {
  Pending: 'bg-yellow-500/80 border-yellow-700/50 hover:bg-yellow-500 text-white',
  Confirmed: 'bg-blue-500/80 border-blue-700/50 hover:bg-blue-500 text-white',
  'Checked-in': 'bg-green-500/80 border-green-700/50 hover:bg-green-500 text-white',
  'Checked-out': 'bg-gray-500/80 border-gray-700/50 hover:bg-gray-500 text-white',
  Cancelled: 'bg-red-500/80 border-red-700/50 hover:bg-red-500 text-white',
};

type BookingCalendarProps = {
  bookings: Booking[];
  onBookingClick: (bookingId: string) => void;
  isLoading: boolean;
};

type CalendarBooking = Booking & {
  start: Date;
  end: Date;
  duration: number;
  offset: number;
};

export function BookingCalendar({ bookings, onBookingClick, isLoading }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekStartsOn = 1; // Monday

  const calendarBookings = useMemo(() => {
    return bookings.map(booking => {
      const start = new Date(booking.checkIn);
      const end = new Date(booking.checkOut);
      return {
        ...booking,
        start,
        end,
        duration: differenceInDays(end, start) + 1,
        offset: 0,
      };
    });
  }, [bookings]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: startOfWeek(monthStart, { weekStartsOn }), end: endOfWeek(monthEnd, { weekStartsOn }) });
  
  const calendarGrid = useMemo(() => {
    return daysInMonth.map(day => {
        const bookingsOnDay = calendarBookings
            .filter(b => day >= b.start && day <= b.end)
            .sort((a,b) => a.start.getTime() - b.start.getTime());
        
        // Simple stacking logic
        const dayWithOffsets = bookingsOnDay.map((booking, index) => ({...booking, offset: index}));
        
        return { day, bookings: dayWithOffsets };
    });
  }, [daysInMonth, calendarBookings]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const weekdays = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn });
    return Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), 'EEE'));
  }, [weekStartsOn]);


  if (isLoading) {
    return <Skeleton className="h-[600px] w-full" />;
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
            <h2 className="text-xl font-bold font-headline text-primary w-40 text-center">{format(currentDate, 'MMMM yyyy')}</h2>
            <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
          </div>
          <Button variant="outline" onClick={goToToday}>Today</Button>
        </div>

        <div className="grid grid-cols-7 border-t border-l">
          {weekdays.map(day => (
            <div key={day} className="text-center font-bold p-2 border-b border-r bg-muted/50 text-muted-foreground text-sm">
              {day}
            </div>
          ))}

          {calendarGrid.map(({ day, bookings }, index) => (
            <div
              key={day.toString()}
              className={cn(
                'relative h-32 border-b border-r p-1 overflow-hidden',
                !isSameMonth(day, currentDate) && 'bg-muted/30',
                isToday(day) && 'bg-accent/10'
              )}
            >
              <div className={cn(
                'absolute top-1 right-1 text-xs',
                isToday(day) ? 'font-bold text-accent' : 'text-muted-foreground'
                )}>
                {format(day, 'd')}
              </div>
               <div className="space-y-0.5 mt-5">
                 {bookings.slice(0, 3).map(booking => {
                    const showLabel = isSameDay(day, booking.start) || getDay(day) === weekStartsOn;
                    return (
                        <div key={booking.id}
                            style={{
                                // This is a simplified stacking. A real implementation would be more complex.
                                // transform: `translateY(${booking.offset * 24}px)` 
                            }}
                        >
                            {showLabel && (
                                <button
                                    onClick={() => onBookingClick(booking.id)}
                                    className={cn(
                                        'w-full text-left truncate text-xs px-1 rounded-sm border',
                                        statusColors[booking.status]
                                    )}
                                    style={{
                                       width: `calc(${booking.duration} * 100% + ${booking.duration-1} * 1px)`,
                                    }}
                                >
                                    {booking.guestName}
                                </button>
                            )}
                        </div>
                    )
                 })}
                 {bookings.length > 3 && (
                     <div className="text-xs text-center text-muted-foreground mt-1">+{bookings.length - 3} more</div>
                 )}
               </div>
            </div>
          ))}
        </div>
         <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {Object.entries(statusColors).map(([status, className]) => (
                <div key={status} className="flex items-center gap-2">
                    <div className={cn('h-3 w-3 rounded-full', className.split(' ')[0])}></div>
                    <span className="text-xs text-muted-foreground">{status}</span>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
