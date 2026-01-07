
export type IDProofType = 'Passport' | 'DriversLicense' | 'NationalID' | 'Other';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  idProofType: IDProofType;
  idProofNumber: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  totalBookings: number;
  totalSpent: number;
  lastVisit?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGuestRequest {
  name: string;
  email: string;
  phone: string;
  idProofType: Guest['idProofType'];
  idProofNumber: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  notes?: string;
}

export interface UpdateGuestRequest extends Partial<CreateGuestRequest> {}

export interface GuestFilters {
  search?: string;
  idProofType?: Guest['idProofType'];
}
