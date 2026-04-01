"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { ActionBar } from "./components/ActionBar";
import { GroupSelector } from "./components/GroupSelector";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { friendStore } from "@/lib/stores/friendStore";
import { observer } from "mobx-react-lite";
import { FavouriteOnlyToggle } from "./components/FavouriteOnlyToggle";
import { ModeToggle } from "./components/ModeToggle";
import { DetailedViewToggle } from "./components/DetailedViewToggle";
import { ClockFormatToggle } from "./components/ClockFormatToggle";

export default observer(function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    friendStore.loadFriends().then(() => setMounted(true));
  }, []);

  if (!mounted) return null;

  return (
    <div className="mx-auto w-full max-w-md md:max-w-full p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="mb-4 ">
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
        <DetailedViewToggle />
        <ClockFormatToggle />
        {friendStore.friends.length <= 0 && (
          <Alert className="mb-4">
            <UserPlus />
            <AlertTitle>
              Add your friends using the "Add Friend" button
            </AlertTitle>
          </Alert>
        )}
      </div>
      <GroupSelector />
    </div>
  );
});
