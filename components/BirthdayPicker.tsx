import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BirthdayPickerProps {
  value: { month: string; day: string };
  onChange: (value: { month: string; day: string }) => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = Array.from({ length: 31 }, (_, i) => i + 1);

export function BirthdayPicker({ value, onChange }: BirthdayPickerProps) {
  const handleMonthChange = (month: string) => {
    onChange({ ...value, month });
  };

  const handleDayChange = (day: string) => {
    onChange({ ...value, day });
  };

  return (
    <div className="flex gap-2">
      <Select value={value.month} onValueChange={handleMonthChange}>
        <SelectTrigger id="month">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month, i) => (
            <SelectItem key={month} value={String(i + 1)}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={value.day} onValueChange={handleDayChange}>
        <SelectTrigger id="day">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {days.map((day) => (
            <SelectItem key={day} value={String(day)}>
              {day}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
