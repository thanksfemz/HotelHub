import { NextResponse } from 'next/server';
import { staff as mockStaff } from '@/lib/mock-data-layer';
import type { Staff } from '@/lib/types';

let staffList: Staff[] = [...mockStaff];

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const staffMember = staffList.find(s => s.id === params.id);
    if (staffMember) {
        await new Promise(resolve => setTimeout(resolve, 300));
        return NextResponse.json(staffMember);
    }
    return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const index = staffList.findIndex(s => s.id === params.id);
    if (index !== -1) {
        const body = await request.json();
        staffList[index] = { ...staffList[index], ...body };
        await new Promise(resolve => setTimeout(resolve, 500));
        return NextResponse.json(staffList[index]);
    }
    return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const index = staffList.findIndex(s => s.id === params.id);
    if (index !== -1) {
        staffList.splice(index, 1);
        await new Promise(resolve => setTimeout(resolve, 500));
        return NextResponse.json({ message: 'Staff member deleted' });
    }
    return NextResponse.json({ message: 'Staff member not found' }, { status: 404 });
}
