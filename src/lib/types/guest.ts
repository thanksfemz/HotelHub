

export type IDProofType = 'Passport' | 'DriversLicense' | 'NationalID' | 'Other';

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idProofType?: IDProofType;
  idProofNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  createdAt: string;
  updatedAt: string;
  name?: string; // Kept for compatibility with some components expecting 'name'
}

export interface CreateGuestRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idProofType?: IDProofType;
  idProofNumber?: string;
  address?: string;
}

export type UpdateGuestRequest = Partial<CreateGuestRequest>;

export interface GuestFilters {
  search?: string;
}
