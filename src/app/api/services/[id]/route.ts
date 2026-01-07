import { NextResponse } from 'next/server';
import { services as mockServices } from '@/lib/mock-data-layer';
import type { Service } from '@/lib/types';

let servicesList: Service[] = [...mockServices];

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const service = servicesList.find(s => s.id === params.id);
    if (service) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return NextResponse.json(service);
    }
    return NextResponse.json({ message: 'Service not found' }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const index = servicesList.findIndex(s => s.id === params.id);
    if (index !== -1) {
        const body = await request.json();
        servicesList[index] = { ...servicesList[index], ...body };
        await new Promise(resolve => setTimeout(resolve, 500));
        return NextResponse.json(servicesList[index]);
    }
    return NextResponse.json({ message: 'Service not found' }, { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const index = servicesList.findIndex(s => s.id === params.id);
    if (index !== -1) {
        servicesList.splice(index, 1);
        await new Promise(resolve => setTimeout(resolve, 500));
        return NextResponse.json({ message: 'Service deleted' });
    }
    return NextResponse.json({ message: 'Service not found' }, { status: 404 });
}
