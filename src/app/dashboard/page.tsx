'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useAuthStore } from '@/lib/stores/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.name}!</CardTitle>
          <CardDescription>This is your HotelHub dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You are logged in as a {user?.role}.</p>
        </CardContent>
      </Card>
    </div>
  );
}
