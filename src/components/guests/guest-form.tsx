
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
import { Textarea } from '@/components/ui/textarea';
import type { Guest, CreateGuestRequest, IDProofType } from '@/lib/types';
import { guestService } from '@/lib/services/guestService';

const guestSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'A valid phone number is required'),
  idProofType: z.enum(['Passport', 'DriversLicense', 'NationalID', 'Other']).optional(),
  idProofNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
});

type GuestFormValues = z.infer<typeof guestSchema>;

interface GuestFormProps {
  guest?: Guest | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const idProofTypes: IDProofType[] = ['Passport', 'DriversLicense', 'NationalID', 'Other'];

export function GuestForm({ guest, onSuccess, onCancel }: GuestFormProps) {
  const form = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      firstName: guest?.firstName || '',
      lastName: guest?.lastName || '',
      email: guest?.email || '',
      phone: guest?.phone || '',
      idProofType: guest?.idProofType,
      idProofNumber: guest?.idProofNumber || '',
      address: guest?.address || '',
      city: guest?.city || '',
      state: guest?.state || '',
      country: guest?.country || '',
      postalCode: guest?.postalCode || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateGuestRequest) => {
      if (guest) {
        return guestService.updateGuest(guest.id, data);
      }
      return guestService.createGuest(data);
    },
    onSuccess: () => {
      toast.success(guest ? 'Guest updated successfully!' : 'Guest created successfully!');
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || (guest ? 'Failed to update guest.' : 'Failed to create guest.'));
    },
  });

  const onSubmit = (data: GuestFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl><Input placeholder="John" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
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
                name="idProofType"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>ID Proof Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {idProofTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="idProofNumber"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>ID Proof Number</FormLabel>
                    <FormControl><Input placeholder="ID Number" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
         <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Textarea placeholder="123 Main St" {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="state" render={({ field }) => (
            <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="CA" {...field} /></FormControl></FormItem>
          )} />
          <FormField control={form.control} name="postalCode" render={({ field }) => (
            <FormItem><FormLabel>Postal Code</FormLabel><FormControl><Input placeholder="12345" {...field} /></FormControl></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="country" render={({ field }) => (
            <FormItem><FormLabel>Country</FormLabel><FormControl><Input placeholder="USA" {...field} /></FormControl></FormItem>
          )} />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save Guest'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
