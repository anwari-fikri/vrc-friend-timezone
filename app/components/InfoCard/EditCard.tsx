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
import { EllipsisVertical, Trash2 } from "lucide-react";
import { TimezoneSelector } from "../TimezoneSelector";
import AvatarUpload, { type AvatarUploadRef } from "./AvatarUpload";
import { useRef, useState } from "react";
import { friendStore } from "@/lib/stores/friendStore";
import { Friend } from "@/lib/types/friend";
import { fileToBase64 } from "@/lib/utils/avatarUtils";
import { z } from "zod";
import { BirthdayPicker } from "@/components/BirthdayPicker";

// Zod schema
const friendSchema = z.object({
  name: z.string().min(1, "Name is required"),
  timezone: z.string().min(1, "Timezone is required"),
  birthday: z.string().optional(),
  note: z.string().optional(),
});

export function EditCard({ friend }: { friend: Friend }) {
  const avatarRef = useRef<AvatarUploadRef>(null);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(friend.name);
  const [timezone, setTimezone] = useState(friend.timezone);
  const [birthday, setBirthday] = useState<{ month: string; day: string }>(
    () => {
      if (!friend.birthday) return { month: "", day: "" };
      const [month, day] = friend.birthday.split("-");
      return { month: month ?? "", day: day ?? "" };
    },
  );
  const [note, setNote] = useState(friend.note || "");

  // Store validation errors
  const [errors, setErrors] = useState<{ name?: string; timezone?: string }>(
    {},
  );

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({}); // reset errors

    const result = friendSchema.safeParse({
      name,
      timezone: timezone || "UTC",
      birthday:
        birthday.month && birthday.day
          ? `${birthday.month}-${birthday.day}`
          : undefined,
      note: note || undefined,
    });

    if (!result.success) {
      const fieldErrors: Partial<
        Record<keyof z.infer<typeof friendSchema>, string>
      > = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          const key = err.path[0] as keyof z.infer<typeof friendSchema>;
          fieldErrors[key] = err.message;
        }
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

      friendStore.updateFriend(friend.id, {
        ...result.data,
        birthday:
          birthday.month && birthday.day
            ? `${birthday.month}-${birthday.day}`
            : undefined,
        ...(avatarBase64 && { avatar: avatarBase64 }),
      });

      setOpen(false);
      setErrors({});
    } catch (error) {
      console.error("Error updating friend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this friend?")) {
      friendStore.removeFriend(friend.id);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <EllipsisVertical className="w-4 cursor-pointer" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25 overflow-hidden overflow-y-auto max-h-[90dvh]">
        <DialogHeader>
          <DialogTitle>Edit Friend</DialogTitle>
          <DialogDescription>
            Update friend&apos;s name and timezone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <AvatarUpload defaultAvatar={friend.avatar} ref={avatarRef} />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="friend-name">Name</Label>
            <Input
              id="friend-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="timezone">Timezone</Label>
            <TimezoneSelector
              id="timezone"
              value={timezone}
              onChange={setTimezone}
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
            <BirthdayPicker value={birthday} onChange={setBirthday} />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="note">
              Note{" "}
              <span className="text-muted-foreground text-sm">(optional)</span>
            </Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleDelete}
            className="mr-auto"
          >
            <Trash2 />
            Delete
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="button" disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
