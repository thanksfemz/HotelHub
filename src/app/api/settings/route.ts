import { NextResponse } from 'next/server';
import type { AppSettings } from '@/lib/types/settings';

// In a real application, you would fetch/store this from/to a database.
let settings: AppSettings = {
    general: {
        hotelName: 'Grandeur Suites',
        hotelAddress: '123 Luxury Avenue, Metropolis, 12345',
        contactEmail: 'contact@grandeursuites.com',
        contactPhone: '+1 (234) 567-890',
        timezone: 'Etc/GMT+12',
        currency: 'USD',
    },
    roomTypes: [
        { id: '1', name: 'Single', basePrice: 150 },
        { id: '2', name: 'Double', basePrice: 200 },
        { id: '3', name: 'Suite', basePrice: 350 },
        { id: '4', name: 'Deluxe', basePrice: 450 },
        { id: '5', name: 'Presidential', basePrice: 1200 },
    ],
    tax: {
        taxRate: 12.5,
        serviceCharge: 10,
    }
};

export async function GET() {
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(settings);
}

export async function PUT(request: Request) {
    const body = await request.json();
    
    // Deep merge the new settings
    if (body.general) {
        settings.general = { ...settings.general, ...body.general };
    }
    if (body.tax) {
        settings.tax = { ...settings.tax, ...body.tax };
    }
    // Note: Room type update logic would be more complex (add/edit/delete)
    // This simple merge is just for demonstration.

    await new Promise(resolve => setTimeout(resolve, 800));
    return NextResponse.json(settings);
}
