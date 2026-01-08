
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAuthStore from '@/lib/stores/authStore';
import { authService } from '@/lib/services/authService';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  phone: z.string().min(10, 'Please enter a valid phone number.').optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters.'),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
    const { user, setAuth, clearAuth } = useAuthStore();
    const router = useRouter();
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const token = useAuthStore(s => s.token)

    const displayName = user?.name || user?.username || 'User';

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            phone: user?.phone || '',
        },
    });

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        }
    });

    const onProfileSubmit = async (data: ProfileFormValues) => {
        setIsProfileLoading(true);
        try {
            const updatedUser = await authService.updateProfile(data);
             if (token) {
              setAuth(updatedUser, token);
            }
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update profile.');
        } finally {
            setIsProfileLoading(false);
        }
    };
    
    const onPasswordSubmit = async (data: PasswordFormValues) => {
        setIsPasswordLoading(true);
        try {
            await authService.changePassword(data);
            toast.success('Password changed successfully!');
            passwordForm.reset();
        } catch (error: any) {
            toast.error(error.message || 'Failed to change password.');
        } finally {
            setIsPasswordLoading(false);
        }
    };
    
    const handleLogout = () => {
        clearAuth();
        toast.success("You have been logged out.");
        router.push('/login');
    };

    if (!user) {
        return null; // Or a loading state
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <h1 className="text-3xl font-bold font-headline text-primary">My Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                             <div className="relative mb-4">
                                <Avatar className="h-32 w-32 border-4 border-primary">
                                    <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={displayName} />
                                    <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Button size="icon" className="absolute bottom-0 right-0 rounded-full">
                                    {/* Placeholder for upload */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                                </Button>
                            </div>
                            <h2 className="text-2xl font-bold">{displayName}</h2>
                            <p className="text-muted-foreground">@{user.username}</p>
                            <p className="text-muted-foreground">{user.email}</p>
                            <Badge className="mt-2">{user.role}</Badge>
                            <p className="text-sm text-muted-foreground mt-4">
                                Member since {format(parseISO(user.createdAt), 'MMMM yyyy')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details here.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...profileForm}>
                                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                                     <FormField control={profileForm.control} name="name" render={({ field }) => (
                                        <FormItem><FormLabel>Display Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={profileForm.control} name="phone" render={({ field }) => (
                                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <Button type="submit" disabled={isProfileLoading}>
                                        {isProfileLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Update your security credentials.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Form {...passwordForm}>
                                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                                     <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                                        <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                                        <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                                        <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <Button type="submit" disabled={isPasswordLoading}>
                                        {isPasswordLoading ? "Updating..." : "Change Password"}
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>

                    <Separator />
                    
                    <Button variant="destructive" className="w-full sm:w-auto" onClick={handleLogout}>
                        Log Out
                    </Button>
                </div>
            </div>
        </div>
    );
}

    
