import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cake, Clock, Heart, Star } from "lucide-react";
import { EditCard } from "./EditCard";
import { Friend } from "@/lib/types/friend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarFallbackImg from "@/public/images/AvatarFallbackImg.png";
import { friendStore } from "@/lib/stores/friendStore";
import { observer } from "mobx-react-lite";
import { Button } from "@/components/ui/button";

const InfoCard = observer(({ friend }: { friend: Friend }) => {
  const hours = friend.localTime?.getHours() ?? 0;
  const isAM = hours < 12;

  return (
    <Card className="flex flex-col gap-2 mb-3">
      <CardHeader>
        <CardTitle className="font-bold text-lg flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className="border border-border">
              <AvatarImage
                src={friend.avatar || AvatarFallbackImg.src}
                alt="@shadcn"
              />
              <AvatarFallback>
                {friend.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {friend.name}
          </div>
        </CardTitle>
        <CardAction>
          <div className="flex gap-2">
            <Star
              className={`w-4 cursor-pointer transition-colors ${
                friend.isFavorite
                  ? "fill-yellow-500 text-yellow-500"
                  : "hover:text-yellow-500"
              }`}
              onClick={() => friendStore.toggleFavorite(friend.id)}
            />
            <EditCard friend={friend} />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex gap-4">
        {/* Left column */}
        <div className="w-1/3 flex flex-col">
          <p className="font-semibold text-muted-foreground text-normal">
            {friend.localTime?.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
          <h2 className="text-3xl font-semibold flex gap-2 mt-1">
            <Clock className="w-4 mt-1" />
            {friend.localTime?.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </h2>
        </div>

        {/* Right column */}
        <div className="w-2/3 flex flex-col gap-1">
          <p>
            {friend.name} is{" "}
            <span className="font-semibold">{friend.offsetText}</span>
          </p>
          <p className="font-normal text-muted-foreground text-sm">
            {friend.timezone.replace("_", " ")} ({friend.offsetLabel})
          </p>
          {friend.birthday && (
            <div className="flex gap-2 items-center mt-2">
              <Cake className="w-4 h-4" />
              {new Date(friend.birthday).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

export default InfoCard;
