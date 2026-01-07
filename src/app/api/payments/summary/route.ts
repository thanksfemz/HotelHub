import { NextResponse } from 'next/server';

export async function GET() {
  // In a real application, you would calculate this from your database.
  const summary = {
    totalRevenue: 250000,
    pendingPayments: 15000,
    totalRefunds: 5000,
  };

  await new Promise(resolve => setTimeout(resolve, 800));
  return NextResponse.json(summary);
}
