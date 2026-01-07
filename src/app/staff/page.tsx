'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { staffService } from '@/lib/services/staffService';
import { useAuthStore } from '@/lib/stores/authStore';
import type { Staff, StaffRole, StaffStatus } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { StaffForm } from '@/components/staff/StaffForm';
import { StaffTable } from '@/components/staff/StaffTable';

const staffRoles: ('all' | StaffRole)[] = ['all', 'Admin', 'Manager', 'Receptionist', 'Housekeeping'];
const staffStatuses: ('all' | StaffStatus)[] = ['all', 'Active', 'Inactive'];

export default function StaffPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [filters, setFilters] = useState<{ role: 'all' | StaffRole, status: 'all' | StaffStatus }>({ role: 'all', status: 'all' });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [staffToEdit, setStaffToEdit] = useState<Staff | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data: staffList = [], isLoading, error } = useQuery<Staff[]>({
        queryKey: ['staff', filters],
        queryFn: () => staffService.getStaff(filters),
    });

    const deleteMutation = useMutation({
        mutationFn: (staffId: string) => staffService.deleteStaff(staffId),
        onSuccess: () => {
          toast.success('Staff member deleted');
          queryClient.invalidateQueries({ queryKey: ['staff'] });
        },
        onError: () => toast.error('Failed to delete staff member'),
        onSettled: () => {
          setIsDeleteAlertOpen(false);
          setStaffToDelete(null);
        }
    });
    
    // Role-based access control
    React.useEffect(() => {
        if (user && user.role !== 'Admin') {
            toast.error("You don't have permission to view this page.");
            router.push('/dashboard');
        }
    }, [user, router]);
    
    if (user && user.role !== 'Admin') {
        return <div className="text-center py-16">Access Denied.</div>;
    }

    const handleAddClick = () => {
        setStaffToEdit(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (staff: Staff) => {
        setStaffToEdit(staff);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (staff: Staff) => {
        setStaffToDelete(staff);
        setIsDeleteAlertOpen(true);
    };

    const confirmDelete = () => {
        if (staffToDelete) {
          deleteMutation.mutate(staffToDelete.id);
        }
    };
    
    const handleFormSuccess = () => {
        setIsFormOpen(false);
        queryClient.invalidateQueries({ queryKey: ['staff'] });
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>;
        }
        if (error) {
            return <div className="text-center py-16 text-destructive">Failed to load staff. Please try again.</div>;
        }
        if (staffList.length === 0) {
            return <div className="text-center py-16 text-muted-foreground">No staff members found.</div>
        }
        return <StaffTable staffList={staffList} onEdit={handleEditClick} onDelete={handleDeleteClick} />;
    }

    return (
        <>
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-headline text-primary">Staff Management</h1>
                    <Button onClick={handleAddClick}><Plus className="mr-2" /> Add Staff</Button>
                </div>
                <div className="flex gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                    <Select value={filters.role} onValueChange={(v) => setFilters(f => ({...f, role: v as any}))}>
                        <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                        <SelectContent>{staffRoles.map(r => <SelectItem key={r} value={r}>{r === 'all' ? 'All Roles' : r}</SelectItem>)}</SelectContent>
                    </Select>
                    <Select value={filters.status} onValueChange={(v) => setFilters(f => ({...f, status: v as any}))}>
                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>{staffStatuses.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</SelectItem>)}</SelectContent>
                    </Select>
                </div>

                {renderContent()}
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{staffToEdit ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle></DialogHeader>
                    <StaffForm staffMember={staffToEdit} onSuccess={handleFormSuccess} onCancel={() => setIsFormOpen(false)} />
                </DialogContent>
            </Dialog>
            
            <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                    <AlertDialogDescription>This will permanently delete {staffToDelete?.name}.</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setStaffToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={deleteMutation.isPending}>{deleteMutation.isPending ? 'Deleting...' : 'Delete'}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
