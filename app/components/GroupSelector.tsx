"use client";

import { observer } from "mobx-react-lite";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InfoCard from "./InfoCard/InfoCard";
import { friendStore } from "@/lib/stores/friendStore";
import { Friend } from "@/lib/types/friend";

export const GroupSelector = observer(function GroupSelector() {
  const { morning, afternoon, evening, night } = friendStore.friendsByTimeOfDay;
  const { Asia, America, Europe, Oceania } = friendStore.friendsByRegion;

  return (
    <Tabs className="w-full" defaultValue="time-of-day">
      <TabsList className="w-full">
        <TabsTrigger value="time-of-day">Time of day</TabsTrigger>
        <TabsTrigger value="region">Region</TabsTrigger>
      </TabsList>

      {/* ✅ TIME OF DAY TAB */}
      <TabsContent value="time-of-day" className="space-y-6">
        <TimeOfDaySection
          title="Morning"
          subtitle="5 AM - 12 PM"
          friends={morning}
        />
        <TimeOfDaySection
          title="Afternoon"
          subtitle="12 PM - 6 PM"
          friends={afternoon}
        />
        <TimeOfDaySection
          title="Evening"
          subtitle="6 PM - 11 PM"
          friends={evening}
        />
        <TimeOfDaySection
          title="Night"
          subtitle="11 PM - 5 AM"
          friends={night}
        />
      </TabsContent>

      {/* ✅ REGION TAB */}
      <TabsContent value="region" className="space-y-6">
        <RegionSection region="Asia" friends={Asia} />
        <RegionSection region="America" friends={America} />
        <RegionSection region="Europe" friends={Europe} />
        <RegionSection region="Oceania" friends={Oceania} />
      </TabsContent>
    </Tabs>
  );
});

/* ============ TIME OF DAY SECTION ============ */
function TimeOfDaySection({
  title,
  subtitle,
  friends,
}: {
  title: string;
  subtitle: string;
  friends: Friend[];
}) {
  return (
    <div>
      <TabContentTitle title={title} subtitle={subtitle} />
      <Separator className="my-4" />

      {friends.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No friends awake right now
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friends.map((friend) => (
            <InfoCard key={friend.id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ============ REGION SECTION ============ */
function RegionSection({
  region,
  friends,
}: {
  region: string;
  friends: Friend[];
}) {
  return (
    <div>
      <Label className="text-xl">{region}</Label>
      <Separator className="my-4" />

      {friends.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No friends in this region
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friends.map((friend) => (
            <InfoCard key={friend.id} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
}

function TabContentTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-row items-end gap-2">
      <Label className="text-xl">{title}</Label>
      <p className="text-muted-foreground text-sm">{subtitle}</p>
    </div>
  );
}
