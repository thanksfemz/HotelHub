
'use client';

import { format, parseISO } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Staff, UserRole } from '@/lib/types';
import { Avatar, AvatarFallback } from '../ui/avatar';

const roleColors: Record<UserRole, string> = {
  ADMIN: 'bg-red-500/10 text-red-600 border-red-500/20',
  MANAGER: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  RECEPTIONIST: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

interface StaffTableProps {
  staffList: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

export function StaffTable({ staffList, onEdit, onDelete }: StaffTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden lg:table-cell">Joined Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffList.map((staff) => {
            const staffName = `${staff.firstName} ${staff.lastName}`;
            return (
            <TableRow key={staff.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{staffName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{staffName}</div>
                    <div className="text-xs text-muted-foreground">{staff.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                 <div className="text-sm">{staff.email}</div>
                <div className="text-xs text-muted-foreground">{staff.phone}</div>
              </TableCell>
              <TableCell><Badge variant="outline" className={cn(roleColors[staff.position])}>{staff.position}</Badge></TableCell>
              <TableCell className="hidden lg:table-cell">{format(parseISO(staff.hireDate), 'PP')}</TableCell>
              <TableCell>
                <Badge variant="outline" className={cn(staff.isActive ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600')}>
                    {staff.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => onEdit(staff)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onDelete(staff)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </div>
  );
}

    