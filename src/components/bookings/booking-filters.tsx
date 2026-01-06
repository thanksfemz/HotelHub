'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import type { BookingFilters as BookingFiltersType, BookingStatus } from '@/lib/types';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

type BookingFiltersProps = {
  filters: BookingFiltersType;
  onFiltersChange: (filters: BookingFiltersType) => void;
};

const bookingStatuses: ('all' | BookingStatus)[] = ['all', 'Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'];

export function BookingFilters({ filters, onFiltersChange }: BookingFiltersProps) {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: 'status') => (value: string) => {
    onFiltersChange({ ...filters, [name]: value as BookingStatus | 'all' });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    onFiltersChange({ ...filters, dateRange: { from: range?.from, to: range?.to } });
  };
  
  const clearFilters = () => {
    onFiltersChange({
      status: 'all',
      dateRange: {},
      guest: '',
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
      <Input
        placeholder="Search by Guest or Booking ID"
        name="guest"
        value={filters.guest}
        onChange={handleInputChange}
      />
      <Select value={filters.status} onValueChange={handleSelectChange('status')}>
        <SelectTrigger>
          <SelectValue placeholder="Booking Status" />
        </SelectTrigger>
        <SelectContent>
          {bookingStatuses.map(status => (
            <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.dateRange?.from ? (
              filters.dateRange.to ? (
                <>
                  {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                  {format(filters.dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(filters.dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={filters.dateRange?.from}
            selected={{ from: filters.dateRange.from, to: filters.dateRange.to }}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
       <Button variant="ghost" onClick={clearFilters} className="w-full">
         <X className="mr-2 h-4 w-4" />
         Clear Filters
       </Button>
    </div>
  );
}
