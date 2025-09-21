export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier' | 'guest';
};

export type Room = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  amenities: {
    name: string;
    icon: React.ElementType;
  }[];
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
