'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/lib/services/roomService';
import type { Room, RoomFilters as RoomFiltersType } from '@/lib/types';
import { RoomFilters } from '@/components/rooms/room-filters';
import { RoomCard } from '@/components/rooms/room-card';
import { RoomRow } from '@/components/rooms/room-row';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 9;

export default function RoomsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<RoomFiltersType>({
    search: '',
    type: 'all',
    status: 'all',
    minPrice: '',
    maxPrice: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data: rooms = [], isLoading, error } = useQuery<Room[]>({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms(),
  });

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const searchMatch = filters.search ? room.roomNumber.toLowerCase().includes(filters.search.toLowerCase()) : true;
      const typeMatch = filters.type === 'all' || room.type === filters.type;
      const statusMatch = filters.status === 'all' || room.status === filters.status;
      const minPriceMatch = filters.minPrice ? room.price >= Number(filters.minPrice) : true;
      const maxPriceMatch = filters.maxPrice ? room.price <= Number(filters.maxPrice) : true;
      return searchMatch && typeMatch && statusMatch && minPriceMatch && maxPriceMatch;
    });
  }, [rooms, filters]);
  
  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE);
  const paginatedRooms = filteredRooms.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onFiltersChange = (newFilters: RoomFiltersType) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline text-primary">Rooms</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md bg-muted p-1">
            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('grid')}>
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('list')}>
              <List className="h-5 w-5" />
            </Button>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
      </div>

      <RoomFilters filters={filters} onFiltersChange={onFiltersChange} />

      {isLoading ? (
        <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className={view === 'grid' ? 'h-96' : 'h-24'} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 text-destructive">Failed to load rooms. Please try again.</div>
      ) : paginatedRooms.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No rooms found matching your criteria.</div>
      ) : (
        <>
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedRooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedRooms.map(room => (
                <RoomRow key={room.id} room={room} />
              ))}
            </div>
          )}
          
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={handlePreviousPage} disabled={currentPage === 1} />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-4 py-2 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={handleNextPage} disabled={currentPage === totalPages} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
