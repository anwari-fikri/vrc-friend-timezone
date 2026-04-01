"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { observer } from "mobx-react-lite";
import { friendStore } from "@/lib/stores/friendStore";

export const ClockFormatToggle = observer(function ClockFormatToggle() {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch
        id="clock-format"
        checked={friendStore.show24HourClock}
        onCheckedChange={(v) => friendStore.setShow24HourClock(!!v)}
      />
      <Label htmlFor="clock-format">24-hour clock</Label>
    </div>
  );
});
