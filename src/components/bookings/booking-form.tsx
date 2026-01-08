
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, differenceInDays, formatISO } from 'date-fns';
import { Calendar as CalendarIcon, Users, BedDouble, ChevronRight, Check, ChevronsUpDown, Plus, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { bookingService } from '@/lib/services/bookingService';
import { guestService } from '@/lib/services/guestService';
import type { Guest, Room, CreateGuestRequest, CreateBookingRequest } from '@/lib/types';
import Image from 'next/image';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

const STEPS = {
  GUEST: 1,
  DATES: 2,
  ROOM: 3,
  REVIEW: 4,
};

const newGuestSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Invalid phone number'),
});

const bookingFormSchema = z.object({
  guest: z.custom<Guest>().nullable(),
  newGuest: newGuestSchema.optional(),
  dates: z.object({
    from: z.date(),
    to: z.date(),
  }).refine(data => data.to > data.from, { message: 'Check-out date must be after check-in date.', path: ['to']}),
  room: z.custom<Room>().nullable(),
  notes: z.string().optional(),
  numberOfGuests: z.coerce.number().min(1),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function BookingForm({ onSuccess, onCancel }: BookingFormProps) {
  const [step, setStep] = useState(STEPS.GUEST);
  const [showNewGuestForm, setShowNewGuestForm] = useState(false);
  const [guestSearch, setGuestSearch] = useState('');

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guest: null,
      newGuest: { firstName: '', lastName: '', email: '', phone: '' },
      dates: { from: new Date(), to: new Date(new Date().setDate(new Date().getDate() + 1)) },
      room: null,
      notes: '',
      numberOfGuests: 1,
    },
  });

  const queryClient = useQueryClient();

  const { data: guests = [], isLoading: isLoadingGuests } = useQuery<Guest[]>({
    queryKey: ['guests', { search: guestSearch }],
    queryFn: () => guestService.getGuests({ search: guestSearch }),
    enabled: !showNewGuestForm,
  });

  const dates = form.watch('dates');
  const { data: availableRooms = [], isLoading: isLoadingRooms, refetch: refetchRooms } = useQuery<Room[]>({
    queryKey: ['availableRooms', dates],
    queryFn: () => bookingService.checkAvailability(dates.from, dates.to),
    enabled: false, // only fetch when step is ROOM
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: CreateBookingRequest) => bookingService.createBooking(data),
    onSuccess: () => {
      toast.success('Booking created successfully!');
      onSuccess();
    },
    onError: () => toast.error('Failed to create booking.'),
  });

  const createGuestMutation = useMutation({
    mutationFn: (data: CreateGuestRequest) => guestService.createGuest(data),
    onSuccess: (newGuest) => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      form.setValue('guest', newGuest);
      setShowNewGuestForm(false);
      setStep(STEPS.DATES);
    },
    onError: () => toast.error('Failed to create guest.'),
  });
  
  const selectedRoom = form.watch('room');
  const selectedGuest = form.watch('guest');

  const numberOfNights = dates.from && dates.to ? differenceInDays(dates.to, dates.from) : 0;
  const roomCost = selectedRoom && numberOfNights ? selectedRoom.price * numberOfNights : 0;
  const tax = roomCost * 0.1;
  const total = roomCost + tax;


  const nextStep = () => {
    if (step === STEPS.GUEST && !selectedGuest && !showNewGuestForm) {
        toast.error('Please select or create a guest.');
        return;
    }
    if (step === STEPS.GUEST && showNewGuestForm) {
        form.trigger(["newGuest.firstName", "newGuest.lastName", "newGuest.email", "newGuest.phone"]).then(isValid => {
            if (isValid) {
                createGuestMutation.mutate(form.getValues('newGuest') as CreateGuestRequest);
            }
        });
        return;
    }
    if (step === STEPS.DATES) {
        refetchRooms();
    }
    setStep(s => Math.min(s + 1, 4));
  }
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  

  const onSubmit = () => {
    const values = form.getValues();
    if (!values.guest || !values.room) {
      toast.error("Guest and Room must be selected.");
      return;
    }
    
    createBookingMutation.mutate({
      guestId: values.guest.id,
      roomId: values.room.id,
      checkInDate: formatISO(values.dates.from),
      checkOutDate: formatISO(values.dates.to),
      numberOfGuests: values.numberOfGuests,
      totalAmount: total,
      specialRequests: values.notes,
    });
  };

  const renderStep = () => {
    switch (step) {
      case STEPS.GUEST:
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Select Guest</h3>
            {showNewGuestForm ? (
              <div className="space-y-4">
                 <FormField control={form.control} name="newGuest.firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input placeholder="John" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="newGuest.lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                 <FormField control={form.control} name="newGuest.email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                <FormField control={form.control} name="newGuest.phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input placeholder="555-123-4567" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <Button type="button" variant="outline" onClick={() => setShowNewGuestForm(false)}>Back to search</Button>
              </div>
            ) : (
              <div className="space-y-4">
                 <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" className="w-full justify-between">
                      {selectedGuest ? `${selectedGuest.firstName} ${selectedGuest.lastName}` : "Select guest..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Search guests..." onValueChange={setGuestSearch} />
                      <CommandList>
                        <CommandEmpty>{isLoadingGuests ? 'Loading...' : 'No guest found.'}</CommandEmpty>
                        <CommandGroup>
                          {guests.map((guest) => (
                            <CommandItem
                              key={guest.id}
                              value={`${guest.firstName} ${guest.lastName}`}
                              onSelect={() => {
                                form.setValue('guest', guest);
                                nextStep();
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", selectedGuest?.id === guest.id ? "opacity-100" : "opacity-0")} />
                              {`${guest.firstName} ${guest.lastName}`}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                </div>
                <Button variant="secondary" className="w-full" onClick={() => setShowNewGuestForm(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add New Guest
                </Button>
              </div>
            )}
          </div>
        );
      case STEPS.DATES:
        return (
            <div>
                <h3 className="text-lg font-medium mb-4">Select Dates & Guests</h3>
                <div className="flex flex-col items-center space-y-4">
                  <FormField
                      control={form.control}
                      name="dates"
                      render={({ field }) => (
                          <FormItem className="flex flex-col items-center">
                          <Calendar
                              mode="range"
                              selected={{ from: field.value.from, to: field.value.to }}
                              onSelect={(range) => range && field.onChange({ from: range.from, to: range.to })}
                              numberOfMonths={2}
                          />
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfGuests"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-sm">
                            <FormLabel>Number of Guests</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                  />
                </div>
            </div>
        );
      case STEPS.ROOM:
        return (
          <div>
            <h3 className="text-lg font-medium mb-4">Select Room</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-1">
                {isLoadingRooms ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
                ) : availableRooms.length > 0 ? (
                    availableRooms.map(room => (
                    <Card key={room.id} 
                        onClick={() => {
                            form.setValue('room', room);
                            nextStep();
                        }}
                        className={cn("cursor-pointer hover:border-primary", selectedRoom?.id === room.id && 'border-primary ring-2 ring-primary')}>
                        <CardContent className="p-4">
                            <div className="relative aspect-video mb-2">
                                <Image src={room.imageUrl} alt={room.description} fill className="rounded-md object-cover" />
                            </div>
                            <h4 className="font-semibold">{room.roomType} Room</h4>
                            <p className="text-sm text-muted-foreground">Room {room.roomNumber}</p>
                            <div className="flex justify-between items-center mt-2">
                                <div className="flex items-center gap-2 text-sm"><Users className="h-4 w-4" />{room.capacity}</div>
                                <div className="text-lg font-bold text-accent">${room.price}</div>
                            </div>
                        </CardContent>
                    </Card>
                    ))
                ) : (
                    <p className="col-span-full text-center text-muted-foreground">No rooms available for the selected dates.</p>
                )}
            </div>
          </div>
        );
      case STEPS.REVIEW:
        return (
            <div>
                <h3 className="text-lg font-medium mb-4">Review & Confirm</h3>
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-4 space-y-4">
                           <div className="flex items-center gap-4">
                                <div className="bg-muted rounded-full p-3"><UserIcon className="h-6 w-6 text-muted-foreground" /></div>
                                <div>
                                    <p className="font-semibold">{selectedGuest?.firstName} {selectedGuest?.lastName}</p>
                                    <p className="text-sm text-muted-foreground">{selectedGuest?.email}</p>
                                </div>
                           </div>
                           <div className="flex items-center gap-4">
                                <div className="bg-muted rounded-full p-3"><BedDouble className="h-6 w-6 text-muted-foreground" /></div>
                                <div>
                                    <p className="font-semibold">{selectedRoom?.roomType} Room ({selectedRoom?.roomNumber})</p>
                                    <p className="text-sm text-muted-foreground">{format(dates.from, 'PPP')} to {format(dates.to, 'PPP')}</p>
                                </div>
                           </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between"><span>Room Cost ({numberOfNights} nights)</span><span>${roomCost.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Taxes (10%)</span><span>${tax.toFixed(2)}</span></div>
                            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${total.toFixed(2)}</span></div>
                        </CardContent>
                    </Card>
                     <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes / Special Requests</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                        </FormItem>
                    )} />
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="overflow-y-auto p-1 pr-4" style={{maxHeight: '70vh'}}>
         {renderStep()}
        </div>
        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            {step > STEPS.GUEST && <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Step {step} of 4</span>
            {step < STEPS.REVIEW ? (
              <Button type="button" onClick={nextStep} disabled={
                (step === STEPS.GUEST && !selectedGuest && !showNewGuestForm) ||
                (step === STEPS.ROOM && !selectedRoom)
              }>Next <ChevronRight className="h-4 w-4 ml-2" /></Button>
            ) : (
              <Button type="button" onClick={onSubmit} disabled={createBookingMutation.isPending}>
                {createBookingMutation.isPending ? 'Confirming...' : 'Confirm Booking'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
