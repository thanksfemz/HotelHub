
import type { ImagePlaceholder } from './util';

export type ServiceCategory = 'Room Service' | 'Spa' | 'Laundry' | 'Restaurant' | 'Activities' | 'Other';
export type ServiceBookingStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ServiceCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  image: ImagePlaceholder;
  available: boolean; // Keeping for compatibility with existing components
}

export interface ServiceBooking {
    id: string;
    bookingId: string;
    serviceId: string;
    quantity: number;
    totalPrice: number;
    serviceDate: string;
    status: ServiceBookingStatus;
    notes?: string;
    createdAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  isActive?: boolean;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {}

export interface ServiceFilters {
    category?: 'all' | ServiceCategory
}
