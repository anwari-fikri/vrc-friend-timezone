"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { observer } from "mobx-react-lite";
import { friendStore } from "@/lib/stores/friendStore";

export const FavouriteOnlyToggle = observer(function FavouriteOnlyToggle() {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch
        id="fav-only"
        checked={friendStore.showFavoritesOnly}
        onCheckedChange={(v) => friendStore.setShowFavoritesOnly(!!v)}
      />
      <Label htmlFor="fav-only">Show Favourite Only</Label>
    </div>
  );
});
