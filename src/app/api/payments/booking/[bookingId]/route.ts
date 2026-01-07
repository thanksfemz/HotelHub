import { NextResponse } from 'next/server';
import { payments as allPayments } from '@/lib/mock-data-layer';

export async function GET(request: Request, { params }: { params: { bookingId: string } }) {
    const bookingPayments = allPayments.filter(p => p.bookingId === params.bookingId);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(bookingPayments);
}
