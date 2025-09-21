
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
import { rooms as initialRooms } from "@/lib/data";
import type { Room } from "@/lib/types";
import Image from "next/image";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { RoomForm } from "@/components/room-form";

export default function RoomsPage() {
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const [isAddEditDialogOpen, setAddEditDialogOpen] = React.useState(false);
  const [isArchiveDialogOpen, setArchiveDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setAddEditDialogOpen(true);
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setAddEditDialogOpen(true);
  };

  const handleArchiveRoom = (room: Room) => {
    setSelectedRoom(room);
    setArchiveDialogOpen(true);
  };

  const handleDeleteRoom = (room: Room) => {
    setSelectedRoom(room);
    setDeleteDialogOpen(true);
  };

  const onSaveChanges = (roomData: Omit<Room, 'id' | 'amenities' | 'status'>) => {
    if (selectedRoom) {
      // Edit room
      setRooms(rooms.map(r => r.id === selectedRoom.id ? { ...r, ...roomData } : r));
    } else {
      // Add new room
      const newRoom: Room = {
        id: `room-${Date.now()}`,
        name: roomData.name,
        description: roomData.description,
        price: roomData.price,
        imageUrl: roomData.imageUrl,
        amenities: [ // Default amenities for new rooms
            { name: 'WiFi', icon: 'Wifi' },
            { name: 'TV', icon: 'Tv' },
            { name: 'Air Conditioning', icon: 'Wind'}
        ],
        status: 'available'
      };
      setRooms([newRoom, ...rooms]);
    }
    setAddEditDialogOpen(false);
    setSelectedRoom(null);
  };

  const onConfirmArchive = () => {
    if (selectedRoom) {
      setRooms(rooms.map(r => r.id === selectedRoom.id ? { ...r, status: 'archived' } : r));
    }
    setArchiveDialogOpen(false);
    setSelectedRoom(null);
  };
  
  const onConfirmDelete = () => {
    if (selectedRoom) {
        setRooms(rooms.filter(r => r.id !== selectedRoom.id));
    }
    setDeleteDialogOpen(false);
    setSelectedRoom(null);
  };


  return (
    <>
      <Header title="Rooms" />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddRoom}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.id} className={room.status === 'archived' ? 'bg-muted/50' : ''}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={room.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={room.imageUrl}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {room.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant={room.status === 'archived' ? 'secondary' : 'outline'}>{room.status === 'archived' ? 'Archived' : 'Available'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${room.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditRoom(room)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleArchiveRoom(room)}>Archive</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteRoom(room)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setAddEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
          </DialogHeader>
          <RoomForm room={selectedRoom} onSaveChanges={onSaveChanges} onCancel={() => setAddEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Archive Dialog */}
      <AlertDialog open={isArchiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    Archiving this room will hide it from the main listings but will preserve its data. You can unarchive it later.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedRoom(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onConfirmArchive}>Archive</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the room and all its data from the servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setSelectedRoom(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirmDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
  );
}
