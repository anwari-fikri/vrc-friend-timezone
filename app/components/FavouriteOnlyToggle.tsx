import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function FavouriteOnlyToggle() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="fav-only" />
      <Label htmlFor="fav-only">Show Favourite Only</Label>
    </div>
  );
}
