
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { staffService } from '@/lib/services/staffService';
import type { Staff, StaffRole, StaffStatus } from '@/lib/types';

const staffSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'A valid phone number is required'),
  role: z.enum(['ADMIN', 'MANAGER', 'RECEPTIONIST']),
  status: z.enum(['Active', 'Inactive']),
  password: z.string().optional(),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffFormProps {
  staffMember?: Staff | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const staffRoles: Omit<StaffRole, 'Housekeeping'>[] = ['ADMIN', 'MANAGER', 'RECEPTIONIST'];
const staffStatuses: StaffStatus[] = ['Active', 'Inactive'];

export function StaffForm({ staffMember, onSuccess, onCancel }: StaffFormProps) {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      name: staffMember?.name || '',
      email: staffMember?.email || '',
      phone: staffMember?.phone || '',
      role: staffMember?.role || 'RECEPTIONIST',
      status: staffMember?.status || 'Active',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => { // Use `any` to match service signature
      if (staffMember) {
        return staffService.updateStaff(staffMember.id, data);
      }
      return staffService.createStaff(data);
    },
    onSuccess: () => {
      toast.success(staffMember ? 'Staff member updated' : 'Staff member created');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || 'An error occurred');
    },
  });

  const onSubmit = (data: StaffFormValues) => {
    mutation.mutate({
        ...data,
        // The backend expects `name` split into firstName and lastName
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ').slice(1).join(' ') || data.name.split(' ')[0],
        position: data.role
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="john.doe@hotelhub.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staffRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {staffStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        {!staffMember && (
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="Create a password" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        )}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save Member'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
