"use client";

import React, { FC } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import "react-day-picker/style.css";

const Calendar: FC = () => {
  const defaultClassNames = getDefaultClassNames();

  const selectDate = (date: Date) => {
    console.log(date);
  };

  return (
    <div className="flex p-4 justify-center items-center py-4">
      <DayPicker
        // classNames={{
        //   root: `${defaultClassNames.root}`,
        //   chevron: `${defaultClassNames.chevron} fill-amber-500`,
        // }}
        locale={ko}
        onDayClick={(day) => selectDate(day)}
      />
    </div>
  );
};

export default Calendar;
