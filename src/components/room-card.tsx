"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Room } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Wifi, Tv, Wind, Utensils, Coffee, BedDouble, type LucideProps } from 'lucide-react';
import React from "react";

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Wifi,
  Tv,
  Wind,
  Utensils,
  Coffee,
  BedDouble,
};

interface RoomCardProps {
  room: Room;
  className?: string;
}

export function RoomCard({ room, className }: RoomCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const handleBooking = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book a room.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    toast({
      title: "Booking Request Sent",
      description: `Your request for ${room.name} has been sent. Awaiting confirmation.`,
    });
  };

  return (
    <Card className={cn("overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col", className)}>
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={room.imageUrl}
            alt={room.name}
            fill
            className="object-cover"
            data-ai-hint={room.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-2xl mb-2">{room.name}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
        <div className="mt-4">
          <h4 className="font-semibold mb-2 text-sm">Amenities</h4>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            {room.amenities.map((amenity) => {
              const Icon = iconMap[amenity.icon];
              return Icon ? (
                <div key={amenity.name} className="flex items-center gap-2 text-sm">
                  <Icon className="w-4 h-4" />
                  <span>{amenity.name}</span>
                </div>
              ) : null
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-6 flex justify-between items-center">
        <div>
          <span className="text-2xl font-bold text-primary">${room.price}</span>
          <span className="text-sm text-muted-foreground">/night</span>
        </div>
        <Button onClick={handleBooking} className="bg-accent text-accent-foreground hover:bg-accent/90">
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}
