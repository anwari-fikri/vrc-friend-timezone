import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cake, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { EditCard } from "./EditCard";

const InfoCard = () => {
  return (
    <Card className="flex flex-col gap-2 mb-3">
      <CardHeader>
        <CardTitle className="font-bold text-lg">Blade</CardTitle>
        <CardAction>
          <EditCard />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-row gap-4">
        {/* Left column */}
        <div className="flex flex-col">
          <h2 className="text-3xl font-semibold flex gap-1">
            <Clock className="w-3" /> 04:16 <span className="text-lg">AM</span>
          </h2>
          <p className="font-semibold text-muted-foreground text-normal mt-2">
            Thursday, 1 Jan
          </p>
          <p className="text-muted-foreground text-normal text-sm">EST (-5)</p>
        </div>

        {/* Separator wrapper */}
        <div className="flex">
          <Separator orientation="vertical" className="h-full" />
        </div>

        {/* Right column */}
        <div className="flex flex-col">
          <p>
            Blade is <span className="font-semibold">12 hours</span> behind you
          </p>
          <p className="font-normal text-muted-foreground text-sm">
            America/New York
          </p>
          <div className="flex gap-2 items-center mt-2">
            <Cake className="w-4 h-4" /> Jan 15
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoCard;
