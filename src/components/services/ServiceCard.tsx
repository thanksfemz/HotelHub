'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';
import type { Service } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
      <CardHeader className="p-0 relative">
        <div className="aspect-[16/9] overflow-hidden">
          <Image
            src={service.image.imageUrl}
            alt={service.image.description}
            fill
            className="object-cover"
            data-ai-hint={service.image.imageHint}
          />
        </div>
        <div className="absolute top-2 right-2 flex gap-2">
          <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full" onClick={() => onEdit(service)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={() => onDelete(service)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute bottom-2 left-2">
            <Badge className={cn(
                service.available ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white',
                'border-none'
            )}>
                {service.available ? 'Available' : 'Unavailable'}
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div>
            <Badge variant="outline" className="mb-2">{service.category}</Badge>
            <h3 className="text-lg font-bold text-primary">{service.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground my-2 flex-grow">{service.description}</p>
        <div className="text-right">
            <p className="text-lg font-bold text-accent">${service.price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
