import { makeAutoObservable, computed } from "mobx";
import {
  getOffsetHours,
  getOffsetLabel,
  formatOffsetText,
  getLocalTime,
  getCurrentHour,
  getTimeOfDay,
  getTimezoneUtc,
} from "@/lib/utils/timezoneUtils";
import { Friend, FriendGrouped, FriendByRegion } from "@/lib/types/friend";

class FriendStore {
  STORAGE_KEY = "friends";
  SETTINGS_KEY = "friendstore_settings";
  friends: Friend[] = [];
  isLoaded = false;
  showFavoritesOnly = false;
  showDetailedView = false;
  show24HourClock = false;
  timeTick = Date.now();
  private intervalId: number | null = null;
  private timeoutId: number | null = null;

  private SEED_DATA: Friend[] = [
    // {
    //   id: "1",
    //   name: "Yuki Nakamura",
    //   timezone: "Asia/Tokyo",
    //   birthday: "04-17",
    //   isFavorite: true,
    //   note: "Night owl, usually up past midnight",
    // },
    // {
    //   id: "2",
    //   name: "Lena Hoffmann",
    //   timezone: "Europe/Berlin",
    //   birthday: "11-03",
    //   note: "Best time to catch her is after 6pm",
    // },
    // {
    //   id: "3",
    //   name: "Marcus Webb",
    //   timezone: "America/Chicago",
    //   birthday: "07-22",
    // },
    // {
    //   id: "4",
    //   name: "Priya Nair",
    //   timezone: "Asia/Kolkata",
    //   birthday: "02-14",
    //   isFavorite: true,
    //   note: "Usually online on weekends",
    // },
    // {
    //   id: "5",
    //   name: "Theo Vasquez",
    //   timezone: "America/Los_Angeles",
    //   birthday: "09-08",
    // },
    // {
    //   id: "6",
    //   name: "Aisha Okonkwo",
    //   timezone: "Africa/Lagos",
    //   birthday: "05-30",
    //   note: "Streams every Friday night",
    // },
    // {
    //   id: "7",
    //   name: "Soren Lindqvist",
    //   timezone: "Europe/Stockholm",
    //   birthday: "12-19",
    // },
    // {
    //   id: "8",
    //   name: "Mei-Ling Wu",
    //   timezone: "Asia/Taipei",
    //   birthday: "03-11",
    //   isFavorite: true,
    // },
    // {
    //   id: "9",
    //   name: "Callum Brennan",
    //   timezone: "Europe/Dublin",
    //   birthday: "08-25",
    //   note: "AFK on Tuesdays",
    // },
    // {
    //   id: "10",
    //   name: "Natasha Volkov",
    //   timezone: "Europe/Moscow",
    //   birthday: "01-06",
    // },
  ];

  constructor() {
    makeAutoObservable(this, {
      enrichedFriends: computed,
      friendsByTimeOfDay: computed,
      friendsByRegion: computed,
    });
  }

  async loadFriends() {
    const savedFriends = this.getFriends();
    this.friends = savedFriends.length > 0 ? savedFriends : this.SEED_DATA;

    // Load settings
    const settings = this.getSettings();
    this.showFavoritesOnly = settings.showFavoritesOnly ?? false;
    this.showDetailedView = settings.showDetailedView ?? false;
    this.show24HourClock = settings.show24HourClock ?? false;

    this.isLoaded = true;
    this.startClockTimer();
  }

  private startClockTimer() {
    if (this.intervalId !== null || this.timeoutId !== null) return;
    if (typeof window === "undefined") return;

    this.timeTick = Date.now();

    const scheduleMinuteTick = () => {
      this.timeTick = Date.now();
      this.intervalId = window.setInterval(() => {
        this.timeTick = Date.now();
      }, 60000);
    };

    const now = new Date();
    const msUntilNextMinute =
      60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    this.timeoutId = window.setTimeout(() => {
      this.timeoutId = null;
      scheduleMinuteTick();
    }, msUntilNextMinute);
  }

  private persistFriends() {
    if (this.isLoaded) {
      this.saveFriends(this.friends);
    }
  }

  addFriend(friend: Friend) {
    // If this is the first custom friend and we still have seed data, remove it
    if (this.friends.length === this.SEED_DATA.length) {
      const seedIds = this.SEED_DATA.map((f) => f.id);
      this.friends = this.friends.filter((f) => !seedIds.includes(f.id));
    }
    friend.isFavorite = friend.isFavorite || false;
    this.friends.push(friend);
    this.persistFriends();
  }

  updateFriend(id: string, updates: Partial<Friend>) {
    const friend = this.friends.find((f) => f.id === id);
    if (friend) {
      Object.assign(friend, updates);
      this.persistFriends();
    }
  }

  removeFriend(id: string) {
    const index = this.friends.findIndex((f) => f.id === id);
    if (index !== -1) {
      this.friends.splice(index, 1);
      this.persistFriends();
    }
  }

  toggleFavorite(id: string) {
    const friend = this.friends.find((f) => f.id === id);
    if (friend) {
      friend.isFavorite = !friend.isFavorite;
      this.persistFriends();
    }
  }

  setShowFavoritesOnly(value: boolean) {
    this.showFavoritesOnly = value;
    this.persistSettings();
  }

  setShowDetailedView(value: boolean) {
    this.showDetailedView = value;
    this.persistSettings();
  }

  setShow24HourClock(value: boolean) {
    this.show24HourClock = value;
    this.persistSettings();
  }

  clearAllData() {
    this.friends = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /* ==================== Computed Properties ==================== */

  /** Enriched friends with calculated time data */
  get enrichedFriends(): Friend[] {
    this.timeTick;

    const baseFriends = this.showFavoritesOnly
      ? this.friends.filter((f) => f.isFavorite)
      : this.friends;

    return baseFriends
      .map((friend) => ({
        ...friend,
        localTime: getLocalTime(friend.timezone),
        offsetHours: getOffsetHours(friend.timezone),
        timezoneUtc: getTimezoneUtc(friend.timezone),
        offsetLabel: getOffsetLabel(friend.timezone),
        offsetText: formatOffsetText(getOffsetHours(friend.timezone)),
        timeOfDay: getTimeOfDay(getCurrentHour(friend.timezone)),
      }))
      .sort((a, b) => {
        if (!a.localTime || !b.localTime) return 0;
        return a.localTime.getTime() - b.localTime.getTime();
      });
  }

  /** Enriched friends (always uses all stored friends) */
  get enrichedAllFriends(): Friend[] {
    this.timeTick;

    return this.friends
      .map((friend) => ({
        ...friend,
        localTime: getLocalTime(friend.timezone),
        offsetHours: getOffsetHours(friend.timezone),
        timezoneUtc: getTimezoneUtc(friend.timezone),
        offsetLabel: getOffsetLabel(friend.timezone),
        offsetText: formatOffsetText(getOffsetHours(friend.timezone)),
        timeOfDay: getTimeOfDay(getCurrentHour(friend.timezone)),
      }))
      .sort((a, b) => {
        if (!a.localTime || !b.localTime) return 0;
        return a.localTime.getTime() - b.localTime.getTime();
      });
  }

  /** Friends grouped by time of day */
  get friendsByTimeOfDay(): FriendGrouped {
    const groups: FriendGrouped = {
      morning: [],
      afternoon: [],
      evening: [],
      night: [],
    };

    this.enrichedFriends.forEach((friend) => {
      const timeOfDay =
        friend.timeOfDay || getTimeOfDay(getCurrentHour(friend.timezone));
      groups[timeOfDay].push(friend);
    });

    return groups;
  }

  /** Friends grouped by region */
  get friendsByRegion(): FriendByRegion {
    const groups: FriendByRegion = {
      Asia: [],
      America: [],
      Europe: [],
      Oceania: [],
      Africa: [],
      Australia: [],
      Pacific: [],
    };

    this.enrichedFriends.forEach((friend) => {
      const region = friend.timezone.split("/")[0];
      if (!groups[region]) {
        groups[region] = [];
      }
      groups[region].push(friend);
    });

    return groups;
  }

  /* ==================== Storage ==================== */

  saveFriends(friends: Friend[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(friends));
  }

  getFriends(): Friend[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private persistSettings() {
    localStorage.setItem(
      this.SETTINGS_KEY,
      JSON.stringify({
        showFavoritesOnly: this.showFavoritesOnly,
        showDetailedView: this.showDetailedView,
        show24HourClock: this.show24HourClock,
      }),
    );
  }

  private getSettings(): {
    showFavoritesOnly?: boolean;
    showDetailedView?: boolean;
    show24HourClock?: boolean;
  } {
    const data = localStorage.getItem(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : {};
  }
}

export const friendStore = new FriendStore();
