import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import InfoCard from "./InfoCard/InfoCard";

export function GroupSelector() {
  return (
    <Tabs className="w-full" defaultValue="time-of-day">
      <TabsList className="w-full">
        <TabsTrigger value="time-of-day">Time of day</TabsTrigger>
        <TabsTrigger value="region">Region</TabsTrigger>
      </TabsList>
      <TabsContent value="time-of-day">
        <TabContentTitle title="Morning" subtitle="5 AM - 12 PM" />
        <Separator className="my-4" />
        <InfoCard />
        <InfoCard />

        <TabContentTitle title="Afternoon" subtitle="12 PM - 6 PM" />
        <Separator className="my-4" />
        <TabContentTitle title="Evening" subtitle="6 PM - 11 PM" />
        <Separator className="my-4" />
        <TabContentTitle title="Night" subtitle="11 PM - 5 AM" />
        <Separator className="my-4" />
      </TabsContent>
      <TabsContent value="region">
        <Label>Asia</Label>
        <Separator className="my-4" />
        <Label>America</Label>
        <Separator className="my-4" />
        <Label>Europe</Label>
        <Separator className="my-4" />
        <Label>Oceania</Label>
        <Separator className="my-4" />
      </TabsContent>
    </Tabs>
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
