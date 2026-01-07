
import type { ImagePlaceholder } from './util';

export type ServiceCategory = 'Room Service' | 'Spa' | 'Laundry' | 'Restaurant' | 'Activities' | 'Other';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  available: boolean;
  image: ImagePlaceholder;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description: string;
  category: Service['category'];
  price: number;
  available?: boolean;
  image?: ImagePlaceholder;
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {}

export interface ServiceFilters {
    category?: 'all' | ServiceCategory
}
