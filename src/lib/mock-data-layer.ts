import type { Room, RoomStatus, RoomType, Guest, Booking, BookingStatus, PaymentStatus, Payment, PaymentMethod, PaymentStatusAPI, Staff, StaffRole, StaffStatus, Service, ServiceCategory } from '@/lib/types';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { format, addDays, subDays, differenceInDays } from 'date-fns';


const roomTypes: RoomType[] = ['Single', 'Double', 'Suite', 'Deluxe'];
const roomStatuses: RoomStatus[] = ['Available', 'Occupied', 'Maintenance', 'Cleaning'];
export const allAmenities = ['Wifi', 'TV', 'Air Conditioning', 'Mini-bar', 'Safe', 'Coffee Maker', 'Ocean View', 'Balcony'];

export const rooms: Room[] = Array.from({ length: 150 }, (_, i) => {
    const type = roomTypes[i % roomTypes.length];
    const status = roomStatuses[i % roomStatuses.length];
    const capacity = type === 'Single' ? 1 : type === 'Double' ? 2 : type === 'Suite' ? 3 : 4;
    const price = 100 + (roomTypes.indexOf(type) * 50) + Math.floor(Math.random() * 50);

    return {
        id: `R${101 + i}`,
        roomNumber: `${Math.floor(i / 10) + 1}0${i % 10 + 1}`,
        type,
        status,
        price,
        capacity,
        amenities: allAmenities.slice(0, Math.floor(Math.random() * allAmenities.length) + 1),
        image: getPlaceholderImage(`room-${(i % 3) + 1}` as 'room-1' | 'room-2' | 'room-3'),
    };
});


const firstNames = ['John', 'Jane', 'Peter', 'Susan', 'Michael', 'Emily', 'Chris', 'Patricia', 'David', 'Laura'];
const lastNames = ['Smith', 'Jones', 'Williams', 'Brown', 'Davis', 'Wilson', 'Taylor', 'Miller', 'Anderson', 'Thomas'];

export const guests: Guest[] = Array.from({ length: 50 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const idProofTypes: Guest['idProofType'][] = ['Passport', 'DriversLicense', 'NationalID'];
    return {
        id: `G${101 + i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `555-01${i.toString().padStart(2, '0')}`,
        address: `${123 + i} Main St, Anytown, USA`,
        idProofType: idProofTypes[i % idProofTypes.length],
        idProofNumber: `ID${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };
});


const bookingStatuses: BookingStatus[] = ['Confirmed', 'Checked-in', 'Checked-out', 'Pending', 'Cancelled'];
const paymentStatuses: PaymentStatus[] = ['Paid', 'Pending', 'Refunded'];

export const bookings: Booking[] = Array.from({ length: 150 }, (_, i) => {
  const guest = guests[i % guests.length];
  const room = rooms[i % rooms.length];
  const checkInDate = subDays(new Date(), Math.floor(Math.random() * 90) - 30);
  const checkOutDate = addDays(checkInDate, Math.floor(Math.random() * 10) + 1);
  const status = bookingStatuses[i % bookingStatuses.length];

  return {
    id: `BK${1001 + i}`,
    guestName: guest.name,
    guestId: guest.id,
    roomNumber: room.roomNumber,
    roomId: room.id,
    checkIn: format(checkInDate, 'yyyy-MM-dd'),
    checkOut: format(checkOutDate, 'yyyy-MM-dd'),
    status: status,
    paymentStatus: paymentStatuses[i % paymentStatuses.length],
    totalAmount: room.price * differenceInDays(checkOutDate, checkInDate)
  };
});

const paymentMethods: PaymentMethod[] = ['Card', 'Cash', 'Bank Transfer', 'UPI'];
const apiPaymentStatuses: PaymentStatusAPI[] = ['Paid', 'Pending', 'Refunded', 'Failed'];

export const payments: Payment[] = bookings.map((booking, i) => ({
    id: `PAY${2001 + i}`,
    bookingId: booking.id,
    guestName: booking.guestName,
    amount: booking.totalAmount,
    method: paymentMethods[i % paymentMethods.length],
    status: booking.paymentStatus as PaymentStatusAPI, // Align with booking payment status
    date: format(subDays(new Date(booking.checkIn), 1), 'yyyy-MM-dd'),
    transactionId: `txn_${Math.random().toString(36).substring(2, 15)}`
}));


const staffRoles: StaffRole[] = ['Admin', 'Manager', 'Receptionist', 'Housekeeping'];
const staffStatuses: StaffStatus[] = ['Active', 'Inactive'];
export const staff: Staff[] = Array.from({ length: 20 }, (_, i) => {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    return {
        id: `S${101 + i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hotelhub.com`,
        phone: `555-02${i.toString().padStart(2, '0')}`,
        role: staffRoles[i % staffRoles.length],
        status: staffStatuses[i % staffStatuses.length],
        joinedDate: format(subDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd'),
    }
});


const serviceCategories: ServiceCategory[] = ['Room Service', 'Spa', 'Laundry', 'Restaurant', 'Activities'];
const serviceNames = {
    'Room Service': ['In-Room Dining', 'Midnight Snack Pack', 'Champagne & Strawberries'],
    'Spa': ['Deep Tissue Massage', 'Aromatherapy Facial', 'Couples Package'],
    'Laundry': ['Express Laundry', 'Dry Cleaning', 'Pressing Service'],
    'Restaurant': ['Chef\'s Tasting Menu', 'Wine Pairing', 'Private Dining Experience'],
    'Activities': ['City Tour', 'Cooking Class', 'Yoga Session']
}
export const services: Service[] = Array.from({ length: 15 }, (_, i) => {
    const category = serviceCategories[i % serviceCategories.length];
    const name = serviceNames[category][i % serviceNames[category].length];
    return {
        id: `SRV${101 + i}`,
        name: name,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        price: Math.floor(Math.random() * 200) + 20,
        category: category,
        available: Math.random() > 0.1,
        image: getPlaceholderImage(`gallery-${(i % 6) + 1}` as any)
    };
});
