export type RoomStatus = 'available' | 'booked' | 'maintenance';

export interface InventoryItem {
  id: string;
  name: string;
  count: number;
  condition: 'good' | 'fair' | 'broken';
  notes?: string;
  lastInspected: string;
}

export interface MeetingRoom {
  id: string;
  roomNumber: string;
  name: string;
  floor: number;
  capacity: number;
  facilities: string[];
  description: string;
  image: string;
  status: RoomStatus;
  inventory: InventoryItem[];
}

export type ReservationStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';

export type LayoutType = 'U-Shape' | 'Classroom' | 'Round Table' | 'Boardroom' | 'Theater';

export type ConsumptionType = 'none' | 'snack_morning' | 'lunch' | 'snack_afternoon' | 'full_day';

export interface Reservation {
  id: string;
  title: string;
  agenda: string;
  roomId: string;
  roomNumber: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  organizerName: string;
  organizerNIP: string;
  organizerPhone: string;
  organizerEmail: string;
  department: string;
  attendeeCount: number;
  attendeesList: string;
  layout: LayoutType;
  consumption: ConsumptionType;
  specialNotes?: string;
  status: ReservationStatus;
  adminNotes?: string;
  createdAt: string;
}

export type IssuePriority = 'low' | 'medium' | 'high';
export type IssueStatus = 'reported' | 'in_progress' | 'resolved';

export interface TroubleReport {
  id: string;
  roomId: string;
  roomNumber: string;
  facilityItem: string;
  description: string;
  priority: IssuePriority;
  reporterName: string;
  reporterPhone: string;
  status: IssueStatus;
  technicianNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'approval' | 'reminder' | 'maintenance';
  timestamp: string;
  read: boolean;
  reservationId?: string;
}

export type UserRole = 'employee' | 'admin';
