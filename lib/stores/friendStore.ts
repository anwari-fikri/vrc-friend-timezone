import { makeAutoObservable, computed } from "mobx";
import {
  getOffsetHours,
  getOffsetLabel,
  formatOffsetText,
  getLocalTime,
  getCurrentHour,
  getTimeOfDay,
} from "@/lib/utils/timezoneUtils";
import { Friend, FriendGrouped, FriendByRegion } from "@/lib/types/friend";

class FriendStore {
  STORAGE_KEY = "friends";
  friends: Friend[] = [];
  isLoaded = false;

  private SEED_DATA: Friend[] = [
    {
      id: "1",
      name: "Alice Chen",
      timezone: "Asia/Shanghai",
      birthday: "1998-04-12",
    },
    {
      id: "2",
      name: "Bob Thompson",
      timezone: "America/New_York",
    },
    {
      id: "3",
      name: "Carlos Rodriguez",
      timezone: "America/Mexico_City",
      birthday: "2000-11-05",
    },
    {
      id: "4",
      name: "Diana Müller",
      timezone: "Europe/Berlin",
      birthday: "1997-03-18",
    },
    {
      id: "5",
      name: "Emma Watson",
      timezone: "Europe/London",
      birthday: "1999-09-25",
    },
    {
      id: "6",
      name: "Fumiko Tanaka",
      timezone: "Asia/Tokyo",
      birthday: "1996-12-08",
    },
    {
      id: "7",
      name: "Grayson Lee",
      timezone: "Asia/Singapore",
      birthday: "2001-01-14",
    },
    {
      id: "8",
      name: "Hannah Park",
      timezone: "Asia/Seoul",
      birthday: "1998-06-30",
    },
    {
      id: "9",
      name: "Ivan Petrov",
      timezone: "Europe/Moscow",
      birthday: "1994-10-11",
    },
    {
      id: "10",
      name: "Jasmine Silva",
      timezone: "America/Los_Angeles",
      birthday: "1999-02-28",
    },
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
    this.isLoaded = true;
  }

  private persistFriends() {
    if (this.isLoaded) {
      this.saveFriends(this.friends);
    }
  }

  addFriend(friend: Friend) {
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

  /* ==================== Computed Properties ==================== */

  /** Enriched friends with calculated time data */
  get enrichedFriends(): Friend[] {
    return this.friends
      .map((friend) => ({
        ...friend,
        localTime: getLocalTime(friend.timezone),
        offsetHours: getOffsetHours(friend.timezone),
        offsetLabel: getOffsetLabel(getOffsetHours(friend.timezone)),
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
      Antarctica: [],
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
}

export const friendStore = new FriendStore();
