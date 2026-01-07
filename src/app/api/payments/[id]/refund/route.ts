import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
    const body = await request.json();
    console.log(`Refunding payment ${params.id} for amount ${body.amount} with reason: ${body.reason}`);
    
    // In a real application, you would process the refund here.
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return NextResponse.json({ message: 'Refund processed successfully' });
}
