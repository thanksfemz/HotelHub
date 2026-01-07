'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Search } from 'lucide-react';

import { guestService } from '@/lib/services/guestService';
import type { Guest, GuestFilters as GuestFiltersType } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { GuestForm } from '@/components/guests/guest-form';
import { GuestTable } from '@/components/guests/guest-table';
import { GuestProfile } from '@/components/guests/guest-profile';
import { Skeleton } from '@/components/ui/skeleton';

export default function GuestsPage() {
    const [filters, setFilters] = useState<GuestFiltersType>({ search: '' });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [guestToEdit, setGuestToEdit] = useState<Guest | null>(null);
    const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
    const [viewingGuest, setViewingGuest] = useState<Guest | null>(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data: guests = [], isLoading, error } = useQuery<Guest[]>({
        queryKey: ['guests', filters],
        queryFn: () => guestService.getGuests(filters),
    });

    const deleteMutation = useMutation({
        mutationFn: (guestId: string) => guestService.deleteGuest(guestId),
        onSuccess: () => {
          toast.success('Guest deleted successfully!');
          queryClient.invalidateQueries({ queryKey: ['guests'] });
        },
        onError: () => {
          toast.error('Failed to delete guest.');
        },
        onSettled: () => {
          setIsDeleteAlertOpen(false);
          setGuestToDelete(null);
        }
      });

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ search: event.target.value });
    };
    
    const handleAddClick = () => {
        setGuestToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (guest: Guest) => {
        setGuestToEdit(guest);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (guest: Guest) => {
        setGuestToDelete(guest);
        setIsDeleteAlertOpen(true);
    };

    const handleViewClick = (guest: Guest) => {
        setViewingGuest(guest);
    }

    const confirmDelete = () => {
        if (guestToDelete) {
          deleteMutation.mutate(guestToDelete.id);
        }
    };
    
    const handleFormSuccess = () => {
        setIsFormOpen(false);
        queryClient.invalidateQueries({ queryKey: ['guests'] });
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            );
        }

        if (error) {
            return <div className="text-center py-16 text-destructive">Failed to load guests. Please try again.</div>;
        }

        if (guests.length === 0) {
            return <div className="text-center py-16 text-muted-foreground">No guests found.</div>
        }

        return <GuestTable guests={guests} onEdit={handleEditClick} onDelete={handleDeleteClick} onView={handleViewClick} />;
    }

    return (
        <>
        <div className="container mx-auto py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold font-headline text-primary">Guests</h1>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-grow sm:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by name, email, phone" 
                            className="pl-9 w-full sm:w-64"
                            value={filters.search}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <Button onClick={handleAddClick}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Guest
                    </Button>
                </div>
            </div>

            {renderContent()}

        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{guestToEdit ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
                </DialogHeader>
                <GuestForm guest={guestToEdit} onSuccess={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
            </DialogContent>
        </Dialog>

        <Dialog open={!!viewingGuest} onOpenChange={(isOpen) => !isOpen && setViewingGuest(null)}>
            <DialogContent className="sm:max-w-3xl">
                {viewingGuest && <GuestProfile guestId={viewingGuest.id} />}
            </DialogContent>
        </Dialog>
        
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone. This will permanently delete guest {guestToDelete?.name}.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setGuestToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        </>
    )
}
