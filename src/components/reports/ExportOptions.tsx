'use client';

import React from 'react';
import { FileDown, FileText, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface ExportOptionsProps {
    data: any;
}

export function ExportOptions({ data }: ExportOptionsProps) {

  const handleExport = (format: 'PDF' | 'Excel') => {
    console.log(`Exporting data as ${format}`, data);
    // In a real app, this would trigger a file download.
    // For PDF, you might use a library like jsPDF.
    // For Excel, you might use a library like SheetJS (xlsx).
    toast.info(`Exporting report as ${format}...`, {
      description: 'This is a placeholder feature.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('PDF')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('Excel')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
