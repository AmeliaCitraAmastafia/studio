
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
};

export type Room = {
  id:string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  amenities: {
    name: string;
    icon: string;
  }[];
  status?: 'available' | 'unavailable' | 'maintenance';
};

export type Booking = {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
};

export type LogEntry = {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
};
