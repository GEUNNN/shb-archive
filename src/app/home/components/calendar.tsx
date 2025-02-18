"use client";

import React, { FC, useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Matcher } from "react-day-picker";

const Calendar: FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const photoDays: Matcher = [new Date("2025-02-14"), new Date("2025-02-16")];
  const videoDays: Matcher = [new Date("2025-02-14")];

  return (
    <div className="flex">
      <CalendarComponent
        className="w-full"
        mode="single"
        selected={date}
        onSelect={setDate}
        modifiers={{ photo: photoDays, video: videoDays }}
        modifiersClassNames={{
          photo: "photo",
          video: "video",
        }}
      />
    </div>
  );
};

export default Calendar;
