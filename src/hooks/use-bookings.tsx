
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Booking } from '@/lib/types';
import { bookings as initialBookings } from '@/lib/data';

type BookingContextType = {
  bookings: Booking[];
  addBooking: (bookingData: Omit<Booking, 'id' | 'status'>) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  loading: boolean;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedBookings = localStorage.getItem('slumber-bookings');
      if (storedBookings) {
        // Important: Dates are stored as strings in JSON. Need to convert back to Date objects.
        const parsedBookings = JSON.parse(storedBookings).map((b: any) => ({
            ...b,
            checkIn: new Date(b.checkIn),
            checkOut: new Date(b.checkOut)
        }));
        setBookings(parsedBookings);
      } else {
        setBookings(initialBookings);
      }
    } catch (error) {
      console.error('Failed to parse bookings from localStorage', error);
      setBookings(initialBookings); // Fallback to initial data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('slumber-bookings', JSON.stringify(bookings));
    }
  }, [bookings, loading]);
  
  const addBooking = useCallback((bookingData: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
        ...bookingData,
        id: `booking-${Date.now()}`,
        status: 'pending', // All new bookings are pending by default
    };
    setBookings(prevBookings => [newBooking, ...prevBookings]);
  }, []);

  const updateBookingStatus = useCallback((bookingId: string, status: Booking['status']) => {
    setBookings(prevBookings => 
        prevBookings.map(b => b.id === bookingId ? { ...b, status } : b)
    );
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, updateBookingStatus, loading }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
}
