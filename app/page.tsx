"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { ActionBar } from "./components/ActionBar";
import { GroupSelector } from "./components/GroupSelector";
import { PopcornIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { friendStore } from "@/lib/stores/friendStore";
import { observer } from "mobx-react-lite";
import { FavouriteOnlyToggle } from "./components/FavouriteOnlyToggle";
import { ModeToggle } from "./components/ModeToggle";

export default observer(function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    friendStore.loadFriends().then(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return (
    <div className="mx-auto w-full max-w-md p-4">
      <div className="mb-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">VRC Friend Timezone</h2>
          <ModeToggle />
        </div>

        <p className="text-muted-foreground ">
          See your friends in their local time.
        </p>
      </div>
      <ActionBar />
      <FavouriteOnlyToggle />
      {friendStore.friends.length <= 0 && (
        <Alert className="mb-4">
          <PopcornIcon />
          <AlertTitle>
            Start by adding your friends using the "Add Friend" button
          </AlertTitle>
        </Alert>
      )}
      <GroupSelector />
    </div>
  );
});
