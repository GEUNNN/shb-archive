"use client";

import React, { FC, useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const Calendar: FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex">
      <CalendarComponent
        mode="single"
        selected={date}
        onSelect={setDate}
        className="w-full"
      />
    </div>
  );
};

export default Calendar;
