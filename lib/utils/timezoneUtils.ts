export const getOffsetHours = (timeZone: string): number => {
  const now = new Date();

  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const targetDate = new Date(now.toLocaleString("en-US", { timeZone }));

  return Math.round((targetDate.getTime() - utcDate.getTime()) / 36e5);
};

export const getOffsetLabel = (timezone: string): string => {
  const offsetHours = getOffsetHours(timezone);
  return `UTC${offsetHours >= 0 ? "+" : ""}${offsetHours}`;
};

export const formatOffsetText = (offsetHours: number): string => {
  if (offsetHours === 0) return "same time as you";
  const abs = Math.abs(offsetHours);
  return offsetHours > 0
    ? `${abs} hour${abs > 1 ? "s" : ""} ahead of you`
    : `${abs} hour${abs > 1 ? "s" : ""} behind you`;
};

export const getLocalTime = (timezone: string): Date => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));
};

export const getCurrentHour = (timezone: string): number => {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      hour12: false,
    });
    return parseInt(formatter.format(new Date()), 10);
  } catch {
    return 0;
  }
};

export function getTimezoneUtc(timezone: string): number {
  const now = new Date();

  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));

  const tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }));

  return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
}

export const getTimeOfDay = (
  hour: number,
): "morning" | "afternoon" | "evening" | "night" => {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 23) return "evening";
  return "night";
};
