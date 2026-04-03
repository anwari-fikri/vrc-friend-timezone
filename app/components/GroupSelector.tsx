"use client";

import { observer } from "mobx-react-lite";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InfoCard from "./InfoCard/InfoCard";
import { friendStore } from "@/lib/stores/friendStore";
import { Friend } from "@/lib/types/friend";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const GroupSelector = observer(function GroupSelector() {
  const { morning, afternoon, evening, night } = friendStore.friendsByTimeOfDay;
  const { Asia, America, Europe, Oceania, Australia, Pacific, Africa } =
    friendStore.friendsByRegion;

  return (
    <Tabs className="w-full" defaultValue="time-of-day">
      <TabsList className="w-full md:w-md mx-auto mb-4">
        <TabsTrigger value="time-of-day">Time of day</TabsTrigger>
        <TabsTrigger value="region">Region</TabsTrigger>
      </TabsList>

      {/* ✅ TIME OF DAY TAB */}
      <TabsContent value="time-of-day">
        <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-4 bg-linear-to-r from-background to-transparent md:block" />

        {/* RIGHT FADE */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-4 bg-linear-to-l from-background to-transparent md:block" />

        <div className="flex flex-col md:flex-row gap-5 md:mt-8 md:px-4">
          <TimeOfDaySection
            title="Morning"
            subtitle={
              friendStore.show24HourClock ? `05:00 - 12:00` : `5 AM - 12 PM`
            }
            friends={morning}
          />
          <TimeOfDaySection
            title="Afternoon"
            subtitle={
              friendStore.show24HourClock ? `12:00 - 18:00` : `12 PM - 6 PM`
            }
            friends={afternoon}
          />
          <TimeOfDaySection
            title="Evening"
            subtitle={
              friendStore.show24HourClock ? `18:00 - 23:00` : `6 PM - 11 PM`
            }
            friends={evening}
          />
          <TimeOfDaySection
            title="Night"
            subtitle={
              friendStore.show24HourClock ? `23:00 - 05:00` : `11 PM - 5 AM`
            }
            friends={night}
          />
        </div>
      </TabsContent>

      {/* ✅ REGION TAB */}
      <TabsContent value="region">
        <ScrollArea className="relative w-full rounded-md md:h-screen">
          <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-4 bg-linear-to-r from-background to-transparent md:block" />

          {/* RIGHT FADE */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-4 bg-linear-to-l from-background to-transparent md:block" />

          <div className="flex flex-col md:flex-row gap-5 md:mt-8 md:px-4">
            <RegionSection region="Asia" friends={Asia} />
            <RegionSection region="America" friends={America} />
            <RegionSection region="Europe" friends={Europe} />
            <RegionSection region="Oceania" friends={Oceania} />
            <RegionSection region="Australia" friends={Australia} />
            <RegionSection region="Pacific" friends={Pacific} />
            <RegionSection region="Africa" friends={Africa} />
          </div>

          <ScrollBar
            orientation="horizontal"
            className="absolute top-0 left-0 w-full -scale-y-100"
          />
        </ScrollArea>
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
    <div className="md:w-full md:min-w-xs">
      <TabContentTitle title={title} subtitle={subtitle} />
      <Separator className="my-4" />

      {friends.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No friends in this time of day
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
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
    <div className="md:w-full md:min-w-xs">
      <Label className="text-xl">{region}</Label>
      <Separator className="my-4" />

      {friends.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No friends in this region
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
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
