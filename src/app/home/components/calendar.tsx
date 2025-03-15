"use client";

import React, { FC, useState } from "react";
import { Matcher } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import thumbnail from "../../../../public/assets/thumbnail.jpg";

const Calendar: FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const photoDays: Matcher = [new Date("2025-02-14"), new Date("2025-02-16")];
  const videoDays: Matcher = [new Date("2025-02-14")];

  return (
    <div className="flex flex-col">
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
      <Separator className="mt-4" />
      <article className="flex flex-col px-4">
        <div className="flex gap-2 items-baseline py-4">
          <span className="text-xl font-bold">HighLight</span>
          <span className="text-sm font-normal">
            {format(date!, "MM-dd EEE")}
          </span>
        </div>
        <div className="">
          <Card className="flex">
            <Image
              src={thumbnail}
              className="rounded-xl"
              width={70}
              alt="thumbnail"
            />
            <div className="w-full">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
              </CardHeader>
              <CardContent>Card Content</CardContent>
              <CardFooter className="gap-1">
                <Image
                  src="/assets/calendar-heart-svgrepo-com.svg"
                  width={16}
                  height={16}
                  alt="date"
                  className="gray-500 "
                />
                <CardDescription>Card Description</CardDescription>
              </CardFooter>
            </div>
          </Card>
        </div>
      </article>
    </div>
  );
};

export default Calendar;
