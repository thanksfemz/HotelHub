import { NextResponse } from 'next/server';
import { services as mockServices } from '@/lib/mock-data-layer';
import type { Service } from '@/lib/types';
import { getPlaceholderImage } from '@/lib/placeholder-images';


let servicesList: Service[] = [...mockServices];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let data = [...servicesList];

    if (category && category !== 'all') {
        data = data.filter(s => s.category === category);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newService: Service = {
        id: `SRV${Math.floor(Math.random() * 100) + 200}`,
        ...body,
        image: getPlaceholderImage('gallery-1'),
    };
    servicesList.unshift(newService);
    return NextResponse.json(newService, { status: 201 });
}
