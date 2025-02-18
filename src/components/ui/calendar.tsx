"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      modifiers={{}}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col space-y-4 ",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] w-full",
        row: "flex w-full mt-2",
        cell: cn(
          "relative w-full p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-transparent [&:has([aria-selected].day-outside)]:bg-transparent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-normal relative aria-selected:opacity-100",
          // Single Dots
          "[&.photo:not(.video)]:after:absolute [&.photo:not(.video)]:after:bottom-[-1px] [&.photo:not(.video)]:after:left-1/2 [&.photo:not(.video)]:after:transform [&.photo:not(.video)]:after:-translate-x-1/2 [&.photo:not(.video)]:after:w-[5px] [&.photo:not(.video)]:after:h-[5px] [&.photo:not(.video)]:after:bg-red-500 [&.photo:not(.video)]:after:rounded-full",
          "[&.video:not(.photo)]:before:content-[''] [&.video:not(.photo)]:before:absolute [&.video:not(.photo)]:before:bottom-[-1px] [&.video:not(.photo)]:before:left-1/2 [&.video:not(.photo)]:before:transform [&.video:not(.photo)]:before:-translate-x-1/2 [&.video:not(.photo)]:before:w-[5px] [&.video:not(.photo)]:before:h-[5px] [&.video:not(.photo)]:before:bg-pink-500 [&.video:not(.photo)]:before:rounded-full",
          // Paired Dots
          "[&.photo.video]:after:content-[''] [&.photo.video]:after:absolute [&.photo.video]:after:bottom-[-1px] [&.photo.video]:after:left-1/2 [&.photo.video]:after:transform [&.photo.video]:after:-translate-x-[6px] [&.photo.video]:after:w-[5px] [&.photo.video]:after:h-[5px] [&.photo.video]:after:bg-red-500 [&.photo.video]:after:rounded-full",
          "[&.video.photo]:before:content-[''] [&.video.photo]:before:absolute [&.video.photo]:before:bottom-[-1px] [&.video.photo]:before:left-1/2 [&.video.photo]:before:transform [&.video.photo]:before:translate-x-[2px] [&.video.photo]:before:w-[5px] [&.video.photo]:before:h-[5px] [&.video.photo]:before:bg-pink-500 [&.video.photo]:before:rounded-full"
        ),

        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
