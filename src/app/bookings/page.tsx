'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { bookingService } from '@/lib/services/bookingService';
import type { Booking, BookingFilters as BookingFiltersType } from '@/lib/types';
import { BookingFilters } from '@/components/bookings/booking-filters';
import { BookingTable } from '@/components/bookings/booking-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 10;

export default function BookingsPage() {
  const [filters, setFilters] = useState<BookingFiltersType>({
    status: 'all',
    dateRange: {},
    guest: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data: bookings = [], isLoading, error } = useQuery<Booking[]>({
    queryKey: ['bookings', filters],
    queryFn: () => bookingService.getBookings(filters),
  });

  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = bookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  const onFiltersChange = (newFilters: BookingFiltersType) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline text-primary">Bookings</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Booking
        </Button>
      </div>

      <BookingFilters filters={filters} onFiltersChange={onFiltersChange} />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <div className="text-center py-16 text-destructive">Failed to load bookings. Please try again.</div>
      ) : paginatedBookings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No bookings found matching your criteria.</div>
      ) : (
        <>
          <BookingTable bookings={paginatedBookings} />
          
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
