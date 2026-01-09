export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export type Friend = {
  id: string;
  name: string;
  timezone: string;
  birthday?: string;
  isFavorite?: boolean;
  avatar?: string;

  // Computed/derived at runtime
  localTime?: Date;
  offsetHours?: number;
  offsetLabel?: string;
  timezoneUtc?: number;
  offsetText?: string;
  timeOfDay?: TimeOfDay;
};

export type FriendGrouped = {
  [key in TimeOfDay]: Friend[];
};

export type FriendByRegion = {
  [region: string]: Friend[];
};
