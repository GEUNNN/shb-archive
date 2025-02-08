"use client";

import React, { FC } from "react";
import { DayPicker } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import "react-day-picker/style.css";

const Calendar: FC = () => {
  console.log("calendar");
  return (
    <div className="flex p-4 justify-center items-center py-4">
      <DayPicker locale={ko} />
    </div>
  );
};

export default Calendar;
