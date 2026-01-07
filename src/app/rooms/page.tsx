'use client';

import React, { useState, useMemo, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '@/lib/services/roomService';
import type { Room, RoomFilters as RoomFiltersType } from '@/lib/types';
import { RoomFilters } from '@/components/rooms/room-filters';
import { RoomCard } from '@/components/rooms/room-card';
import { RoomRow } from '@/components/rooms/room-row';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { RoomForm } from '@/components/rooms/room-form';
import { toast } from 'sonner';

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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading, error } = useQuery<Room[]>({
    queryKey: ['rooms', filters],
    queryFn: () => roomService.getRooms(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (roomId: string) => roomService.deleteRoom(roomId),
    onSuccess: () => {
      toast.success('Room deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
    onError: () => {
      toast.error('Failed to delete room.');
    },
    onSettled: () => {
      setIsDeleteAlertOpen(false);
      setRoomToDelete(null);
    }
  });

  const filteredRooms = useMemo(() => {
    // Filtering is now done on the server via queryKey change,
    // so we just use the data returned from react-query.
    return rooms;
  }, [rooms]);
  
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
  
  const handleAddClick = () => {
    setRoomToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (room: Room) => {
    setRoomToEdit(room);
    setIsFormOpen(true);
  };
  
  const handleDeleteClick = (room: Room) => {
    setRoomToDelete(room);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (roomToDelete) {
      deleteMutation.mutate(roomToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    queryClient.invalidateQueries({ queryKey: ['rooms'] });
  };


  return (
    <>
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
            <Button onClick={handleAddClick}>
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
                  <RoomCard key={room.id} room={room} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedRooms.map(room => (
                  <RoomRow key={room.id} room={room} onEdit={handleEditClick} onDelete={handleDeleteClick} />
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{roomToEdit ? 'Edit Room' : 'Add New Room'}</DialogTitle>
          </DialogHeader>
          <RoomForm room={roomToEdit} onSuccess={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete room {roomToDelete?.roomNumber} and its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoomToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
