'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DateRangePickerProps {
    onDateChange: (range: { from: Date, to: Date }) => void;
    initialRange: { from: Date, to: Date };
    className?: string;
}

export function DateRangePicker({ onDateChange, initialRange, className }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(initialRange);

  useEffect(() => {
    if (date?.from && date?.to) {
        onDateChange({ from: date.from, to: date.to });
    }
  }, [date, onDateChange]);

  const handlePresetChange = (value: string) => {
    const now = new Date();
    let from: Date;
    let to: Date = now;
    switch (value) {
      case '7d': from = subDays(now, 6); break;
      case '30d': from = subDays(now, 29); break;
      case '90d': from = subDays(now, 89); break;
      case 'this-month': from = startOfMonth(now); to = endOfMonth(now); break;
      case 'last-month': 
        const lastMonth = subDays(now, 30);
        from = startOfMonth(lastMonth);
        to = endOfMonth(lastMonth);
        break;
      default: from = now; to = now;
    }
    setDate({ from, to });
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
        <Select onValueChange={handlePresetChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
        </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
