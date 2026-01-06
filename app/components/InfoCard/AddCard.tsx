import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { TimezoneSelector } from "../TimezoneSelector";
import AvatarUpload from "./AvatarUpload";

export function AddCard() {
  return (
    <Dialog>
      <form className="w-full">
        <DialogTrigger asChild>
          <Button className="w-full flex-1 rounded-r-none">
            Add Friend <PlusCircle />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Add Friend</DialogTitle>
            <DialogDescription>
              Add a new friend with their name and timezone.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <AvatarUpload />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="friend-name">Name</Label>
              <Input id="friend-name" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="timezone">Timezone</Label>
              <TimezoneSelector id="timezone" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="birthday">
                Birthday{" "}
                <span className="text-muted-foreground text-sm">
                  (optional)
                </span>
              </Label>
              <Input id="birthday" name="birthday" type="date" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add New Friend</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
