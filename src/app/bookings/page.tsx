'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, List } from 'lucide-react';
import { bookingService } from '@/lib/services/bookingService';
import type { Booking, BookingFilters as BookingFiltersType } from '@/lib/types';
import { BookingFilters } from '@/components/bookings/booking-filters';
import { BookingTable } from '@/components/bookings/booking-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { BookingCalendar } from '@/components/bookings/booking-calendar';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookingForm } from '@/components/bookings/booking-form';

const ITEMS_PER_PAGE = 10;

export default function BookingsPage() {
  const [filters, setFilters] = useState<BookingFiltersType>({
    status: 'all',
    dateRange: {},
    guest: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

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
  
  const handleBookingClick = (bookingId: string) => {
    router.push(`/bookings/${bookingId}`);
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['bookings'] });
  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
             <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );
    }

    if (error) {
      return <div className="text-center py-16 text-destructive">Failed to load bookings. Please try again.</div>;
    }
    
    if (bookings.length === 0) {
        return <div className="text-center py-16 text-muted-foreground">No bookings found matching your criteria.</div>
    }

    if (view === 'calendar') {
      return <BookingCalendar bookings={bookings} onBookingClick={handleBookingClick} isLoading={isLoading} />;
    }

    return (
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
    );
  }

  return (
    <>
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold font-headline text-primary">Bookings</h1>
        <div className="flex items-center gap-2">
            <div className="flex items-center rounded-md bg-muted p-1">
              <Button variant={view === 'table' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('table')}>
                <List className="h-5 w-5" />
              </Button>
              <Button variant={view === 'calendar' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('calendar')}>
                <Calendar className="h-5 w-5" />
              </Button>
            </div>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
        </div>
      </div>

      <BookingFilters filters={filters} onFiltersChange={onFiltersChange} />

      {renderContent()}
    </div>
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
          </DialogHeader>
          <BookingForm onSuccess={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
