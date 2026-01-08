
'use client';

import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import type { Guest } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type GuestTableProps = {
  guests: Guest[];
  onView: (guest: Guest) => void;
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
};

export function GuestTable({ guests, onView, onEdit, onDelete }: GuestTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Contact</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guests.map((guest) => {
            const guestName = `${guest.firstName} ${guest.lastName}`;
            return (
            <TableRow
              key={guest.id}
              onClick={() => onView(guest)}
              className="cursor-pointer"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://avatar.vercel.sh/${guest.email}.png`} alt={guestName} />
                    <AvatarFallback>{guestName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{guestName}</div>
                    <div className="text-xs text-muted-foreground">{guest.id}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div>{guest.email}</div>
                <div className="text-xs text-muted-foreground">{guest.phone}</div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-haspopup="true"
                      size="icon"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); onView(guest); }}>
                      <Eye className="mr-2 h-4 w-4" /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); onEdit(guest); }}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit Guest
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={(e) => { e.stopPropagation(); onDelete(guest); }} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Guest
                    </DropdownMenuItem>
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
