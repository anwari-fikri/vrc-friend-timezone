"use client";

import {
  DownloadIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import { useRef } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddCard } from "./InfoCard/AddCard";
import { ManageFavoritesDialog } from "./ManageFavoritesDialog";
import { friendStore } from "@/lib/stores/friendStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ActionBar() {
  const importRef = useRef<HTMLInputElement>(null);

  const handleClearAllData = () => {
    friendStore.clearAllData();
  };

  const handleExport = () => {
    const data = {
      friends: friendStore.friends,
      settings: {
        showFavoritesOnly: friendStore.showFavoritesOnly,
        showDetailedView: friendStore.showDetailedView,
        show24HourClock: friendStore.show24HourClock,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vrc-friend-timezones.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        if (data.friends && Array.isArray(data.friends)) {
          friendStore.friends = data.friends;
          friendStore.saveFriends(data.friends);
        }

        if (data.settings) {
          if (data.settings.showFavoritesOnly !== undefined)
            friendStore.setShowFavoritesOnly(data.settings.showFavoritesOnly);
          if (data.settings.showDetailedView !== undefined)
            friendStore.setShowDetailedView(data.settings.showDetailedView);
          if (data.settings.show24HourClock !== undefined)
            friendStore.setShow24HourClock(data.settings.show24HourClock);
        }
      } catch {
        alert("Invalid file. Please upload a valid JSON export.");
      }
    };
    reader.readAsText(file);

    // Reset so the same file can be re-imported if needed
    e.target.value = "";
  };

  return (
    <ButtonGroup className="w-full mb-4">
      <AddCard />
      <input
        ref={importRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More Options">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <ManageFavoritesDialog />
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleExport}>
              <DownloadIcon />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => importRef.current?.click()}>
              <UploadIcon />
              Import Data
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Trash2Icon />
                  Clear All Data
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all your friends and reset the app. This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-2 justify-end">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={handleClearAllData}
                  >
                    Clear All
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
