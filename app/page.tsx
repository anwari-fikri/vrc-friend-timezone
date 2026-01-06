import { Alert, AlertTitle } from "@/components/ui/alert";
import { ActionBar } from "./components/ActionBar";
import { GroupSelector } from "./components/GroupSelector";
import { PopcornIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-md p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">VRC Friend Timezone</h2>
        <p className="text-muted-foreground ">
          See your friends in their local time.
        </p>
      </div>
      <ActionBar />
      <Alert className="mb-4">
        <PopcornIcon />
        <AlertTitle>
          Example will be removed once you added your first friend!
        </AlertTitle>
      </Alert>
      <GroupSelector />
    </div>
  );
}
