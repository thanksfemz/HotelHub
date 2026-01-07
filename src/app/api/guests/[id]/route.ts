import { NextResponse } from 'next/server';
import type { Guest } from '@/lib/types';
import { guests as mockGuests } from '@/lib/mock-data-layer';

let guests: Guest[] = [...mockGuests];

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const guest = guests.find(g => g.id === params.id);
    if (guest) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return NextResponse.json(guest);
    }
    return NextResponse.json({ message: 'Guest not found' }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const index = guests.findIndex(g => g.id === params.id);
    if (index !== -1) {
        const body = await request.json();
        guests[index] = { ...guests[index], ...body };
        await new Promise(resolve => setTimeout(resolve, 500));
        return NextResponse.json(guests[index]);
    }
    return NextResponse.json({ message: 'Guest not found' }, { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const index = guests.findIndex(r => r.id === params.id);
    if (index !== -1) {
        guests.splice(index, 1);
        await new Promise(resolve => setTimeout(resolve, 500));
        return NextResponse.json({ message: 'Guest deleted' });
    }
    return NextResponse.json({ message: 'Guest not found' }, { status: 404 });
}
