import type { Room, RoomStatus, RoomType, Guest } from '@/lib/types';
import { getPlaceholderImage } from '@/lib/placeholder-images';

const roomTypes: RoomType[] = ['Single', 'Double', 'Suite', 'Deluxe'];
const roomStatuses: RoomStatus[] = ['Available', 'Occupied', 'Maintenance', 'Cleaning'];
const allAmenities = ['Wifi', 'TV', 'Air Conditioning', 'Mini-bar', 'Safe', 'Coffee Maker', 'Ocean View', 'Balcony'];

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
    return {
        id: `G${101 + i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        phone: `555-01${i.toString().padStart(2, '0')}`,
        address: `${123 + i} Main St, Anytown, USA`
    };
});
