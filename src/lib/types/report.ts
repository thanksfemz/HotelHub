
export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  todayRevenue: number;
  monthRevenue: number;
  checkInsToday: number;
  checkOutsToday: number;
  pendingBookings: number;
  totalGuests: number;
}

export interface OccupancyData {
  date: string;
  occupancyRate: number;
  occupiedRooms: number;
  totalRooms: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
  bookings: number;
}

export interface OccupancyReport {
  data: OccupancyData[];
  averageOccupancy: number;
  peakOccupancy: number;
  lowestOccupancy: number;
  mostPopularRoomType: string;
}

export interface RevenueReport {
  data: RevenueData[];
  totalRevenue: number;
  averageRevenue: number;
  paymentMethodBreakdown: {
    method: string;
    amount: number;
    percentage: number;
  }[];
}
