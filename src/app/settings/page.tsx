'use client';

import React from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { settingsService } from '@/lib/services/settingsService';
import type { GeneralSettings, TaxSettings, RoomTypeSetting } from '@/lib/types/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const generalSettingsSchema = z.object({
  hotelName: z.string().min(1, "Hotel name is required"),
  hotelAddress: z.string().min(1, "Address is required"),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(1, "Phone number is required"),
  timezone: z.string(),
  currency: z.string(),
});

const taxSettingsSchema = z.object({
    taxRate: z.coerce.number().min(0).max(100),
    serviceCharge: z.coerce.number().min(0).max(100),
});

function GeneralSettingsForm({ settings, isLoading }: { settings: GeneralSettings, isLoading: boolean }) {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof generalSettingsSchema>>({
        resolver: zodResolver(generalSettingsSchema),
        values: settings,
    });

    const mutation = useMutation({
        mutationFn: (data: GeneralSettings) => settingsService.updateSettings({ general: data }),
        onSuccess: () => toast.success("General settings updated"),
        onError: () => toast.error("Failed to update settings"),
    });

    if (isLoading) return <Skeleton className="h-96 w-full" />;

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(d => mutation.mutate(d))} className="space-y-6">
            <FormField control={form.control} name="hotelName" render={({ field }) => (
                <FormItem>
                    <FormLabel>Hotel Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="hotelAddress" render={({ field }) => (
                <FormItem>
                    <FormLabel>Hotel Address</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="contactEmail" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="contactPhone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="timezone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="Etc/GMT+12">(GMT-12:00) International Date Line West</SelectItem></SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="currency" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="USD">USD - US Dollar</SelectItem></SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Settings'}</Button>
        </form>
        </Form>
    )
}

function TaxSettingsForm({ settings, isLoading }: { settings: TaxSettings, isLoading: boolean }) {
     const form = useForm<z.infer<typeof taxSettingsSchema>>({
        resolver: zodResolver(taxSettingsSchema),
        values: settings,
    });
     const mutation = useMutation({
        mutationFn: (data: TaxSettings) => settingsService.updateSettings({ tax: data }),
        onSuccess: () => toast.success("Tax settings updated"),
        onError: () => toast.error("Failed to update settings"),
    });

    if (isLoading) return <Skeleton className="h-64 w-full" />;

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(d => mutation.mutate(d))} className="space-y-6">
            <FormField control={form.control} name="taxRate" render={({ field }) => (
                <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="serviceCharge" render={({ field }) => (
                <FormItem>
                    <FormLabel>Service Charge (%)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving...' : 'Save Tax Settings'}</Button>
        </form>
        </Form>
    )
}

function RoomTypesSettings({ settings, isLoading }: { settings: RoomTypeSetting[], isLoading: boolean }) {
    if (isLoading) return <Skeleton className="h-64 w-full" />;

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>Room Types</CardTitle>
                    <CardDescription>Manage room types and their base prices.</CardDescription>
                </div>
                <Button>Add Room Type</Button>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Base Price</TableHead>
                             <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {settings.map(type => (
                            <TableRow key={type.id}>
                                <TableCell>{type.name}</TableCell>
                                <TableCell>${type.basePrice.toFixed(2)}</TableCell>
                                <TableCell>
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                 </Table>
            </CardContent>
        </Card>
    )
}


export default function SettingsPage() {
    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        if (user && user.role !== 'Admin') {
            toast.error("You don't have permission to view this page.");
            router.push('/dashboard');
        }
    }, [user, router]);
    
    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings'],
        queryFn: settingsService.getSettings,
    });

    if (user && user.role !== 'Admin') {
        return <div className="text-center py-16">Access Denied.</div>;
    }
  
    return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold font-headline text-primary mb-8">System Settings</h1>
       <Tabs defaultValue="general">
        <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="room-types">Room Types</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Manage basic hotel information.</CardDescription>
                </CardHeader>
                <CardContent>
                    <GeneralSettingsForm settings={settings?.general} isLoading={isLoading} />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="room-types">
            <RoomTypesSettings settings={settings?.roomTypes} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="tax">
            <Card>
                <CardHeader>
                    <CardTitle>Tax Settings</CardTitle>
                    <CardDescription>Configure tax rates and service charges.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TaxSettingsForm settings={settings?.tax} isLoading={isLoading} />
                </CardContent>
            </Card>
        </TabsContent>
       </Tabs>
    </div>
  );
}
