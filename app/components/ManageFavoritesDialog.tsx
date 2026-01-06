"use client";

import { observer } from "mobx-react-lite";
import { friendStore } from "@/lib/stores/friendStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackImg from "@/public/images/AvatarFallbackImg.png";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export const ManageFavoritesDialog = observer(function ManageFavoritesDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Star className="w-4" />
          Manage Favourites
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Favourites</DialogTitle>
          <DialogDescription>
            Click on a friend to toggle their favorite status
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {friendStore.enrichedFriends.length === 0 ? (
            <p className="text-sm text-muted-foreground">No friends yet</p>
          ) : (
            friendStore.enrichedFriends.map((friend) => (
              <div
                key={friend.id}
                onClick={() => friendStore.toggleFavorite(friend.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  friend.isFavorite
                    ? "bg-yellow-50 border border-yellow-400"
                    : "border border-border bg-muted hover:bg-muted/80"
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={friend.avatar || AvatarFallbackImg.src}
                    alt={friend.name}
                  />
                  <AvatarFallback>
                    {friend.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{friend.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {friend.timezone.replace("_", " ")}
                  </p>
                </div>
                <Star
                  className={`h-4 w-4 ${
                    friend.isFavorite
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});
