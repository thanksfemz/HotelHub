'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { serviceService } from '@/lib/services/serviceService';
import { useAuthStore } from '@/lib/stores/authStore';
import type { Service, ServiceCategory } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ServiceForm } from '@/components/services/ServiceForm';
import { ServiceCard } from '@/components/services/ServiceCard';

const serviceCategories: ('all' | ServiceCategory)[] = ['all', 'Room Service', 'Spa', 'Laundry', 'Restaurant', 'Activities'];

export default function ServicesPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [filters, setFilters] = useState<{ category: 'all' | ServiceCategory }>({ category: 'all' });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
    const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data: services = [], isLoading, error } = useQuery<Service[]>({
        queryKey: ['services', filters],
        queryFn: () => serviceService.getServices(filters),
    });

    const deleteMutation = useMutation({
        mutationFn: (serviceId: string) => serviceService.deleteService(serviceId),
        onSuccess: () => {
          toast.success('Service deleted');
          queryClient.invalidateQueries({ queryKey: ['services'] });
        },
        onError: () => toast.error('Failed to delete service'),
        onSettled: () => {
          setIsDeleteAlertOpen(false);
          setServiceToDelete(null);
        }
    });

    React.useEffect(() => {
        if (user && !['Admin', 'Manager'].includes(user.role)) {
            toast.error("You don't have permission to view this page.");
            router.push('/dashboard');
        }
    }, [user, router]);
    
    if (user && !['Admin', 'Manager'].includes(user.role)) {
        return <div className="text-center py-16">Access Denied.</div>;
    }

    const handleAddClick = () => {
        setServiceToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (service: Service) => {
        setServiceToEdit(service);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (service: Service) => {
        setServiceToDelete(service);
        setIsDeleteAlertOpen(true);
    };

    const confirmDelete = () => {
        if (serviceToDelete) {
          deleteMutation.mutate(serviceToDelete.id);
        }
    };
    
    const handleFormSuccess = () => {
        setIsFormOpen(false);
        queryClient.invalidateQueries({ queryKey: ['services'] });
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}</div>;
        }
        if (error) {
            return <div className="text-center py-16 text-destructive">Failed to load services. Please try again.</div>;
        }
        if (services.length === 0) {
            return <div className="text-center py-16 text-muted-foreground">No services found.</div>
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(service => (
                    <ServiceCard key={service.id} service={service} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-headline text-primary">Hotel Services</h1>
                    <Button onClick={handleAddClick}><Plus className="mr-2" /> Add Service</Button>
                </div>
                <div className="mb-4 p-4 bg-muted/50 rounded-lg max-w-sm">
                    <Select value={filters.category} onValueChange={(v) => setFilters({ category: v as any })}>
                        <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                        <SelectContent>{serviceCategories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                {renderContent()}
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{serviceToEdit ? 'Edit Service' : 'Add New Service'}</DialogTitle></DialogHeader>
                    <ServiceForm service={serviceToEdit} onSuccess={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
                </DialogContent>
            </Dialog>
            
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogDescription>This will permanently delete the {serviceToDelete?.name} service.</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setServiceToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
