
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Room } from "@/lib/types";
import React from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  imageUrl: z.string().optional(),
  imageHint: z.string().min(2, "Image hint must be at least 2 characters.")
});

type RoomFormValues = z.infer<typeof formSchema>;

interface RoomFormProps {
  room: Room | null;
  onSaveChanges: (data: Omit<Room, 'id' | 'amenities' | 'status'>) => void;
  onCancel: () => void;
}

export function RoomForm({ room, onSaveChanges, onCancel }: RoomFormProps) {
  const form = useForm<RoomFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room?.name || "",
      description: room?.description || "",
      price: room?.price || 0,
      imageUrl: room?.imageUrl || "",
      imageHint: room?.imageHint || "",
    },
  });

  const onSubmit = (values: RoomFormValues) => {
    const finalValues = {
        ...values,
        imageUrl: values.imageUrl || `https://picsum.photos/seed/${Date.now()}/600/400`,
    };
    onSaveChanges(finalValues);
  };
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Luxury King Suite" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A luxurious suite with a king-sized bed..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per night</FormLabel>
              <FormControl>
                <Input type="number" placeholder="250" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
              </FormControl>
              <FormDescription>
                Upload an image from your device. If no image is selected, a placeholder will be used.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageHint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Hint</FormLabel>
              <FormControl>
                <Input placeholder="luxury suite" {...field} />
              </FormControl>
               <FormDescription>
                A short description of the image for AI purposes (e.g., "modern kitchen").
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Form>
  );
}
