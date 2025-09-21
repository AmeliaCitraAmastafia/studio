
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { rooms } from '@/lib/data';
import { RoomCard } from '@/components/room-card';
import { DateRangePicker } from '@/components/date-range-picker';
import Link from 'next/link';
import { UserNav } from '@/components/user-nav';
import React from 'react';
import { DateRange } from 'react-day-picker';

export default function Home() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <nav className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10z"/><path d="M7 12a5 5 0 0 1 5-5v0a5 5 0 0 1 5 5v0a5 5 0 0 1-5 5v0a5 5 0 0 1-5-5z"/></svg>
            <span className="text-xl">SlumberSite</span>
          </Link>
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <div className="relative">
          <Image
            src="https://picsum.photos/seed/99/1920/600"
            alt="Hero image of a beautiful hotel lobby"
            width={1920}
            height={600}
            className="w-full h-[400px] md:h-[500px] object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white p-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">Your Tranquil Getaway Awaits</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">Discover the perfect blend of comfort and luxury. Book your stay with us and create unforgettable memories.</p>
            <div className="mt-8 bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-2xl w-full max-w-4xl">
              <DateRangePicker onDateChange={setDateRange} />
            </div>
          </div>
        </div>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 font-headline">Our Rooms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} selectedDateRange={dateRange} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SlumberSite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
