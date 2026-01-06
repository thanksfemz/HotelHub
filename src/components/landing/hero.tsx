'use client';

import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users } from 'lucide-react';

import { getPlaceholderImage } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

const bookingFormSchema = z.object({
  checkIn: z.date({
    required_error: 'Check-in date is required.',
  }),
  checkOut: z.date({
    required_error: 'Check-out date is required.',
  }),
  guests: z.coerce.number().min(1, { message: 'Must have at least 1 guest.' }),
});

export function Hero() {
  const heroImage = getPlaceholderImage('hero-background');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      guests: 1,
    },
  });

  function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    toast({
      title: 'Searching for rooms...',
      description: `Checking availability for ${format(values.checkIn, 'PPP')} to ${format(
        values.checkOut,
        'PPP'
      )} for ${values.guests} guest(s).`,
    });
  }

  return (
    <section id="home" className="relative h-[80vh] min-h-[500px] md:h-screen">
      <Image
        src={heroImage.imageUrl}
        alt={heroImage.description}
        fill
        className="object-cover"
        priority
        data-ai-hint={heroImage.imageHint}
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
        <div className="container px-4 md:px-6">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl">
            Experience Luxury Beyond Compare
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-lg text-primary-foreground/90 md:text-xl">
            Discover a world of elegance and unmatched hospitality. Your unforgettable stay awaits.
          </p>
          <div className="mt-8">
            <a href="#booking">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-accent/90 hover:shadow-accent/40"
              >
                Book Your Stay
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div id="booking" className="absolute -bottom-24 md:-bottom-16 left-1/2 w-full max-w-6xl -translate-x-1/2 px-4">
        <div className="rounded-lg bg-background p-6 shadow-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-in</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Check-out</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guests</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="number" placeholder="1" {...field} className="pl-9" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full bg-accent text-accent-foreground md:h-10 transition-transform duration-300 hover:scale-105"
              >
                Search Rooms
              </Button> supervising
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
