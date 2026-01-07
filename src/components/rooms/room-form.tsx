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
import type { Room, RoomStatus, RoomType } from '@/lib/types';
import { roomService } from '@/lib/services/roomService';
import { Checkbox } from '../ui/checkbox';
import { allAmenities } from '@/lib/mock-data-layer';

const roomSchema = z.object({
  roomNumber: z.string().min(1, 'Room number is required'),
  roomType: z.enum(['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PRESIDENTIAL']),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING']),
  price: z.coerce.number().positive('Price must be a positive number'),
  capacity: z.coerce.number().int().positive('Capacity must be a positive integer'),
  floorNumber: z.coerce.number().int().positive('Floor must be a positive integer'),
  description: z.string().min(1, 'Description is required'),
  amenities: z.array(z.string()).min(1, 'Select at least one amenity'),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface RoomFormProps {
  room?: Room | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const roomTypes: RoomType[] = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE', 'PRESIDENTIAL'];
const roomStatuses: RoomStatus[] = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING'];

export function RoomForm({ room, onSuccess, onCancel }: RoomFormProps) {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      roomNumber: room?.roomNumber || '',
      roomType: room?.roomType || 'SINGLE',
      status: room?.status || 'AVAILABLE',
      price: room?.price || 0,
      capacity: room?.capacity || 1,
      floorNumber: room?.floorNumber || 1,
      description: room?.description || '',
      amenities: room?.amenities || [],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: RoomFormValues) => {
      const requestData = {...data, imageUrl: room?.imageUrl || ''};
      if (room) {
        return roomService.updateRoom(room.id, requestData);
      }
      return roomService.createRoom(requestData);
    },
    onSuccess: () => {
      toast.success(room ? 'Room updated successfully!' : 'Room created successfully!');
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || (room ? 'Failed to update room.' : 'Failed to create room.'));
    },
  });

  const onSubmit = (data: RoomFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="roomNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a room type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roomTypes.map(type => (
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Night</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floorNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1" {...field} />
                  </FormControl>
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
                        <SelectTrigger>
                            <SelectValue placeholder="Select room status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {roomStatuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>

         <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="A cozy room with a great view." {...field} /></FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        
        <FormField
            control={form.control}
            name="amenities"
            render={() => (
                <FormItem>
                    <FormLabel>Amenities</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 rounded-md border p-4">
                        {allAmenities.map((item) => (
                        <FormField
                            key={item}
                            control={form.control}
                            name="amenities"
                            render={({ field }) => {
                            return (
                                <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                <FormControl>
                                    <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                        return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(
                                            field.value?.filter(
                                                (value) => value !== item
                                            )
                                            )
                                    }}
                                    />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                    {item}
                                </FormLabel>
                                </FormItem>
                            )
                            }}
                        />
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save Room'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
