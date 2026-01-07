import { NextResponse } from 'next/server';
import { staff as mockStaff } from '@/lib/mock-data-layer';
import type { Staff } from '@/lib/types';
import { format } from 'date-fns';

let staffList: Staff[] = [...mockStaff];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');

    let data = [...staffList];

    if (role && role !== 'all') {
        data = data.filter(s => s.role === role);
    }
    if (status && status !== 'all') {
        data = data.filter(s => s.status === status);
    }

    data.sort((a,b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime());

    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newStaffMember: Staff = {
        id: `S${Math.floor(Math.random() * 100) + 200}`,
        ...body,
        joinedDate: format(new Date(), 'yyyy-MM-dd'),
    };
    staffList.unshift(newStaffMember);
    return NextResponse.json(newStaffMember, { status: 201 });
}
