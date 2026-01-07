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
import { Switch } from '@/components/ui/switch';
import { serviceService } from '@/lib/services/serviceService';
import type { Service, ServiceCategory } from '@/lib/types';

const serviceSchema = z.object({
  name: z.string().min(3, 'Service name is required'),
  description: z.string().min(10, 'Description is required'),
  price: z.coerce.number().positive('Price must be a positive number'),
  category: z.enum(['Room Service', 'Spa', 'Laundry', 'Restaurant', 'Activities']),
  available: z.boolean(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  service?: Service | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const serviceCategories: ServiceCategory[] = ['Room Service', 'Spa', 'Laundry', 'Restaurant', 'Activities'];

export function ServiceForm({ service, onSuccess, onCancel }: ServiceFormProps) {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service?.name || '',
      description: service?.description || '',
      price: service?.price || 0,
      category: service?.category || 'Room Service',
      available: service?.available ?? true,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ServiceFormValues) => {
      if (service) {
        return serviceService.updateService(service.id, data);
      }
      return serviceService.createService(data);
    },
    onSuccess: () => {
      toast.success(service ? 'Service updated successfully' : 'Service created successfully');
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || 'An error occurred');
    },
  });

  const onSubmit = (data: ServiceFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl><Input placeholder="e.g., Deep Tissue Massage" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Describe the service" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl><Input type="number" placeholder="99.99" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Available</FormLabel>
                <p className="text-xs text-muted-foreground">Is this service currently available to guests?</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save Service'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
