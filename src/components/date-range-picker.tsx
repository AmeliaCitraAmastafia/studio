"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (date: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  onDateChange,
}: DateRangePickerProps) {
  const { toast } = useToast();
  const [date, setDate] = React.useState<DateRange | undefined>();

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    if (onDateChange) {
      onDateChange(selectedDate);
    }
  };

  const handleSearch = () => {
    if (date?.from && date?.to) {
        toast({
            title: "Availability Checked",
            description: "All rooms are available for the selected dates. Please proceed to book your favorite room.",
        });
    } else {
        toast({
            title: "Invalid Dates",
            description: "Please select both a check-in and check-out date.",
            variant: "destructive",
        });
    }
  }

  return (
    <div className={cn("grid gap-4 sm:grid-cols-3 items-center", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-12 text-base",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick check-in & check-out dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {/* This is a placeholder for guest selection */}
      <Button variant="outline" className="w-full h-12 text-base justify-start text-left font-normal text-muted-foreground" disabled>
        <span>2 Adults, 0 Children, 1 Room</span>
      </Button>
      <Button onClick={handleSearch} className="w-full h-12 text-lg bg-accent text-accent-foreground hover:bg-accent/90 sm:col-span-3 lg:col-span-1">
        <Search className="mr-2 h-5 w-5"/> Check Availability
      </Button>
    </div>
  );
}
