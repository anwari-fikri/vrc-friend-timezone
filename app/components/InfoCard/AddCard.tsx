"use client";

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
import AvatarUpload, { type AvatarUploadRef } from "./AvatarUpload";
import { useRef, useState } from "react";
import { friendStore } from "@/lib/stores/friendStore";
import { Friend } from "@/lib/types/friend";
import { fileToBase64 } from "@/lib/utils/avatarUtils";
import { z } from "zod";

// Zod schema
const friendSchema = z.object({
  name: z.string().min(1, "Name is required"),
  timezone: z.string().min(1, "Timezone is required"),
  birthday: z.string().optional(),
});

export function AddCard() {
  const avatarRef = useRef<AvatarUploadRef>(null);
  const timezoneRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [timezone, setTimezone] = useState("");
  const [birthday, setBirthday] = useState("");

  // Store validation errors
  const [errors, setErrors] = useState<{ name?: string; timezone?: string }>(
    {}
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({}); // reset errors

    const result = friendSchema.safeParse({
      name,
      timezone: timezone || "UTC",
      birthday: birthday || undefined,
    });

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      let avatarBase64: string | undefined;
      const selectedFile = avatarRef.current?.getFile();
      if (selectedFile?.file instanceof File) {
        avatarBase64 = await fileToBase64(selectedFile.file);
      }

      const newFriend: Friend = {
        id: Date.now().toString(),
        ...result.data,
        ...(avatarBase64 && { avatar: avatarBase64 }),
      };

      friendStore.addFriend(newFriend);

      // Reset form
      setName("");
      setTimezone("");
      setBirthday("");
      setOpen(false);
      setErrors({});
    } catch (error) {
      console.error("Error adding friend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <AvatarUpload ref={avatarRef} />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="friend-name">Name</Label>
            <Input
              id="friend-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter friend's name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="timezone">Timezone</Label>
            <TimezoneSelector
              id="timezone"
              ref={timezoneRef}
              value={timezone}
              onChange={(tz) => setTimezone(tz)}
            />
            {errors.timezone && (
              <p className="text-red-500 text-sm">{errors.timezone}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="birthday">
              Birthday{" "}
              <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Input
              id="birthday"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Adding..." : "Add New Friend"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
