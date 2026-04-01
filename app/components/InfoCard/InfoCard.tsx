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

const InfoCard = observer(({ friend }: { friend: Friend }) => {
  const detailed = friendStore.showDetailedView;
  const use24Hour = friendStore.show24HourClock; // add this

  return (
    <Card className="flex flex-col gap-2 mb-3">
      <CardHeader>
        <CardTitle className="font-bold text-lg flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className="border border-border">
              <AvatarImage
                src={friend.avatar || AvatarFallbackImg.src}
                alt={friend.name}
              />
              <AvatarFallback>
                {friend.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="font-medium leading-tight">{friend.name}</span>
              {/* Birthday — only in detailed view */}
              {detailed && friend.birthday && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Cake className="w-3 h-3" />
                  {new Date(friend.birthday).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
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

      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-col">
          {detailed && (
            <p className="font-semibold text-muted-foreground text-normal">
              {friend.localTime?.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
          <h2 className="text-3xl font-semibold flex gap-2 mt-1">
            {!detailed && (
              <p className="font-semibold text-muted-foreground text-normal">
                {friend.localTime?.toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>
            )}
            {detailed && <Clock className="w-4 mt-1" />}

            {friend.localTime?.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: !use24Hour,
            })}
          </h2>
        </div>

        {/* Offset + timezone + note — only in detailed view */}
        {detailed && (
          <div className="flex flex-col gap-1">
            <p>
              {friend.name} is{" "}
              <span className="font-semibold">{friend.offsetText}</span>
            </p>
            <p className="font-normal text-muted-foreground text-sm">
              {friend.timezone.replace("_", " ")} (UTC
              {(friend.timezoneUtc ?? 0) >= 0 ? "+" : ""}
              {friend.timezoneUtc ?? 0})
            </p>
            {friend.note && (
              <p className="text-sm text-muted-foreground mt-2">
                "{friend.note}"
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default InfoCard;
