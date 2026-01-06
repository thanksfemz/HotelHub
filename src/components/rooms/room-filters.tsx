'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { RoomFilters as RoomFiltersType, RoomStatus, RoomType } from '@/lib/types';
import { X } from 'lucide-react';

type RoomFiltersProps = {
  filters: RoomFiltersType;
  onFiltersChange: (filters: RoomFiltersType) => void;
};

const roomTypes: ('all' | RoomType)[] = ['all', 'Single', 'Double', 'Suite', 'Deluxe'];
const roomStatuses: ('all' | RoomStatus)[] = ['all', 'Available', 'Occupied', 'Maintenance', 'Cleaning'];

export function RoomFilters({ filters, onFiltersChange }: RoomFiltersProps) {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: 'type' | 'status') => (value: string) => {
    onFiltersChange({ ...filters, [name]: value });
  };
  
  const clearFilters = () => {
    onFiltersChange({
      search: '',
      type: 'all',
      status: 'all',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 p-4 bg-muted/50 rounded-lg">
      <Input
        placeholder="Search Room #"
        name="search"
        value={filters.search}
        onChange={handleInputChange}
      />
      <Select value={filters.type} onValueChange={handleSelectChange('type')}>
        <SelectTrigger>
          <SelectValue placeholder="Room Type" />
        </SelectTrigger>
        <SelectContent>
          {roomTypes.map(type => (
            <SelectItem key={type} value={type}>{type === 'all' ? 'All Types' : type}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.status} onValueChange={handleSelectChange('status')}>
        <SelectTrigger>
          <SelectValue placeholder="Room Status" />
        </SelectTrigger>
        <SelectContent>
          {roomStatuses.map(status => (
            <SelectItem key={status} value={status}>{status === 'all' ? 'All Statuses' : status}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min Price"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleInputChange}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <Input
          type="number"
          placeholder="Max Price"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleInputChange}
          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
       <Button variant="ghost" onClick={clearFilters} className="w-full">
         <X className="mr-2 h-4 w-4" />
         Clear Filters
       </Button>
    </div>
  );
}
