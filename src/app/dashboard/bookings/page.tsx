"use client";

import * as React from "react";
import { Header } from "@/components/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bookings as initialBookings } from "@/lib/data";
import type { Booking } from "@/lib/types";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(
    null
  );
  const [isDetailsOpen, setDetailsOpen] = React.useState(false);
  const [isCancelOpen, setCancelOpen] = React.useState(false);

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleConfirmBooking = (booking: Booking) => {
    setBookings(
      bookings.map((b) =>
        b.id === booking.id ? { ...b, status: "confirmed" } : b
      )
    );
  };

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelOpen(true);
  };
  
  const onConfirmCancel = () => {
    if (selectedBooking) {
        setBookings(
            bookings.map((b) =>
                b.id === selectedBooking.id ? { ...b, status: "cancelled" } : b
            )
        );
    }
    setCancelOpen(false);
    setSelectedBooking(null);
  }

  return (
    <>
      <Header title="Bookings" />
      <main className="flex-1 p-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.guestName}</div>
                  </TableCell>
                  <TableCell>{booking.roomName}</TableCell>
                  <TableCell>
                    {format(booking.checkIn, "PP")} -{" "}
                    {format(booking.checkOut, "PP")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        booking.status === "confirmed"
                          ? "default"
                          : booking.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={cn(
                        "capitalize",
                        booking.status === "confirmed" &&
                          "bg-green-600 text-white",
                        booking.status === "pending" &&
                          "bg-yellow-500 text-black",
                        booking.status === "cancelled" &&
                          "bg-destructive text-destructive-foreground"
                      )}
                    >
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${booking.totalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(booking)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleConfirmBooking(booking)}
                          disabled={booking.status !== "pending"}
                        >
                          Confirm Booking
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleCancelBooking(booking)}
                          disabled={booking.status === "cancelled"}
                        >
                          Cancel Booking
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* View Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Viewing details for booking ID: {selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
             <div className="grid gap-4 py-4 text-sm">
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <span className="text-muted-foreground">Guest</span>
                    <span>{selectedBooking.guestName}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <span className="text-muted-foreground">Room</span>
                    <span>{selectedBooking.roomName}</span>
                </div>
                 <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <span className="text-muted-foreground">Check-in</span>
                    <span>{format(selectedBooking.checkIn, "PPP")}</span>
                </div>
                 <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <span className="text-muted-foreground">Check-out</span>
                    <span>{format(selectedBooking.checkOut, "PPP")}</span>
                </div>
                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <span className="text-muted-foreground">Status</span>
                     <Badge
                      variant={
                        selectedBooking.status === "confirmed"
                          ? "default"
                          : selectedBooking.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className={cn(
                        "capitalize w-fit",
                        selectedBooking.status === "confirmed" &&
                          "bg-green-600 text-white",
                        selectedBooking.status === "pending" &&
                          "bg-yellow-500 text-black",
                        selectedBooking.status === "cancelled" &&
                          "bg-destructive text-destructive-foreground"
                      )}
                    >
                      {selectedBooking.status}
                    </Badge>
                </div>
                 <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                    <span className="text-muted-foreground">Total Price</span>
                    <span className="font-semibold">${selectedBooking.totalPrice.toFixed(2)}</span>
                </div>
             </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Dialog */}
      <AlertDialog open={isCancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will cancel the booking for{" "}
              <strong>{selectedBooking?.guestName}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedBooking(null)}>
              Dismiss
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
