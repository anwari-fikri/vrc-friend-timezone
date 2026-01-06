"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import allTimezones from "@/lib/timezones";
import { ICustomTimezone } from "@/lib/types/timezone";

/* ------------------ helpers ------------------ */

// Get "UTC+8", "UTC-5", etc.
function getUtcOffset(timeZone: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date());

    return (
      parts
        .find((p) => p.type === "timeZoneName")
        ?.value.replace("GMT", "UTC") ?? ""
    );
  } catch {
    return "";
  }
}

// Convert "UTC+8" / "UTC-5:30" → minutes (for sorting)
function offsetToMinutes(offset: string) {
  const match = offset.match(/UTC([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;

  const sign = match[1] === "-" ? -1 : 1;
  const hours = Number(match[2]);
  const minutes = Number(match[3] ?? 0);

  return sign * (hours * 60 + minutes);
}

/* ------------------ data ------------------ */

const frameworks = Object.entries(allTimezones as ICustomTimezone)
  .map(([value, label]) => {
    const offset = getUtcOffset(value);

    return {
      value, // Asia/Brunei
      label, // Brunei
      offset, // UTC+8
      offsetMinutes: offsetToMinutes(offset),
      // searchable text
      search: `${label} ${value} ${offset}`,
    };
  })
  .sort((a, b) => a.offsetMinutes - b.offsetMinutes);

/* ------------------ component ------------------ */

export function TimezoneSelector({ id }: { id?: string }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const selected = frameworks.find((f) => f.value === value);

  return (
    <Popover modal open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
          aria-controls={`${id}-listbox`}
          aria-haspopup="listbox"
        >
          {selected
            ? `${selected.label} (${selected.offset})`
            : "Select a timezone..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-full">
        <Command>
          <CommandInput
            placeholder="Search by city, UTC, or region…"
            className="h-9"
          />

          <CommandList
            id={`${id}-listbox`}
            role="listbox"
            className="max-h-75 overflow-y-auto"
          >
            <CommandEmpty>No timezone found.</CommandEmpty>

            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.search} // 🔑 enables searching by UTC / label / value
                  onSelect={() => {
                    setValue(framework.value);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{framework.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {framework.offset} · {framework.value}
                    </span>
                  </div>

                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
