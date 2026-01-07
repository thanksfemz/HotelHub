import { NextResponse } from 'next/server';
import { payments as allPayments, bookings } from '@/lib/mock-data-layer';
import type { Payment, PaymentMethod, PaymentStatusAPI } from '@/lib/types';
import { format, parseISO, isWithinInterval } from 'date-fns';

let payments: Payment[] = [...allPayments];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const method = searchParams.get('method');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  
  let data = [...payments];

  if (status && status !== 'all') {
    data = data.filter(p => p.status === status);
  }
  if (method && method !== 'all') {
    data = data.filter(p => p.method === method);
  }
  if (from && to) {
    const fromDate = parseISO(from);
    const toDate = parseISO(to);
    data = data.filter(p => {
        const paymentDate = parseISO(p.date);
        return isWithinInterval(paymentDate, { start: fromDate, end: toDate });
    });
  }

  await new Promise(resolve => setTimeout(resolve, 800));
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const booking = bookings.find(b => b.id === body.bookingId);

  const newPayment: Payment = {
    id: `PAY${Math.floor(Math.random() * 9000) + 1000}`,
    bookingId: body.bookingId,
    guestName: booking?.guestName || 'N/A',
    amount: body.amount,
    method: body.method,
    status: 'Paid',
    date: new Date().toISOString(),
    transactionId: body.transactionId,
  };
  payments.unshift(newPayment);
  return NextResponse.json(newPayment, { status: 201 });
}
