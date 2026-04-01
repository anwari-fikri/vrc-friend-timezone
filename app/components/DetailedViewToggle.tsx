"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { observer } from "mobx-react-lite";
import { friendStore } from "@/lib/stores/friendStore";

export const DetailedViewToggle = observer(function DetailedViewToggle() {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch
        id="detailed-view"
        checked={friendStore.showDetailedView}
        onCheckedChange={(v) => friendStore.setShowDetailedView(!!v)}
      />
      <Label htmlFor="detailed-view">Detailed View</Label>
    </div>
  );
});
