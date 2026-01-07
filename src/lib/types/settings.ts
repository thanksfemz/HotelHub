
export interface GeneralSettings {
    hotelName: string;
    hotelAddress: string;
    contactEmail: string;
    contactPhone: string;
    timezone: string;
    currency: string;
}

export interface RoomTypeSetting {
    id: string;
    name: 'Single' | 'Double' | 'Suite' | 'Deluxe' | 'Presidential';
    basePrice: number;
}

export interface TaxSettings {
    taxRate: number;
    serviceCharge: number;
}

export interface AppSettings {
    general: GeneralSettings;
    roomTypes: RoomTypeSetting[];
    tax: TaxSettings;
}

export interface UpdateSettingsRequest {
    general?: Partial<GeneralSettings>;
    roomTypes?: Partial<RoomTypeSetting>[];
    tax?: Partial<TaxSettings>;
}
