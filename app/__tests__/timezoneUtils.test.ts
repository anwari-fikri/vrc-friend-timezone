import { describe, it, expect } from "vitest";
import {
  getOffsetLabel,
  formatOffsetText,
  getCurrentHour,
  getTimeOfDay,
  getTimezoneUtc,
  getLocalTime,
  getOffsetHours,
} from "../../lib/utils/timezoneUtils";

// ─── getTimeOfDay ────────────────────────────────────────────────────────────
// Pure function, no timezone dependency — test exhaustively

describe("getTimeOfDay", () => {
  it("returns 'night' before 5am", () => {
    expect(getTimeOfDay(0)).toBe("night");
    expect(getTimeOfDay(4)).toBe("night");
  });

  it("returns 'morning' from 5am to 11am", () => {
    expect(getTimeOfDay(5)).toBe("morning");
    expect(getTimeOfDay(11)).toBe("morning");
  });

  it("returns 'afternoon' from 12pm to 5pm", () => {
    expect(getTimeOfDay(12)).toBe("afternoon");
    expect(getTimeOfDay(17)).toBe("afternoon");
  });

  it("returns 'evening' from 6pm to 10pm", () => {
    expect(getTimeOfDay(18)).toBe("evening");
    expect(getTimeOfDay(22)).toBe("evening");
  });

  it("returns 'night' at 11pm", () => {
    expect(getTimeOfDay(23)).toBe("night");
  });
});

// ─── formatOffsetText ────────────────────────────────────────────────────────

describe("formatOffsetText", () => {
  it("returns 'same time as you' for offset 0", () => {
    expect(formatOffsetText(0)).toBe("same time as you");
  });

  it("returns singular 'hour' for offset of 1", () => {
    expect(formatOffsetText(1)).toBe("1 hour ahead of you");
  });

  it("returns plural 'hours' for offset greater than 1", () => {
    expect(formatOffsetText(2)).toBe("2 hours ahead of you");
    expect(formatOffsetText(9)).toBe("9 hours ahead of you");
  });

  it("returns singular 'hour' for offset of -1", () => {
    expect(formatOffsetText(-1)).toBe("1 hour behind you");
  });

  it("returns plural 'hours' for offset less than -1", () => {
    expect(formatOffsetText(-5)).toBe("5 hours behind you");
  });
});

// ─── getOffsetLabel ──────────────────────────────────────────────────────────

describe("getOffsetLabel", () => {
  it("returns UTC+0 for UTC timezone", () => {
    expect(getOffsetLabel("UTC")).toBe("UTC+0");
  });

  it("returns positive offset label", () => {
    const label = getOffsetLabel("Asia/Tokyo"); // UTC+9
    expect(label).toBe("UTC+9");
  });

  it("returns negative offset label", () => {
    const label = getOffsetLabel("America/New_York"); // UTC-4 or -5
    expect(label).toMatch(/^UTC-\d+$/);
  });
});

// ─── getTimezoneUtc ──────────────────────────────────────────────────────────

describe("getTimezoneUtc", () => {
  it("returns 0 for UTC", () => {
    expect(getTimezoneUtc("UTC")).toBe(0);
  });

  it("returns 9 for Tokyo", () => {
    expect(getTimezoneUtc("Asia/Tokyo")).toBe(9);
  });

  it("returns a number for any valid timezone", () => {
    const offset = getTimezoneUtc("America/New_York");
    expect(typeof offset).toBe("number");
    expect(offset).toBeGreaterThanOrEqual(-12);
    expect(offset).toBeLessThanOrEqual(14);
  });
});

// ─── getOffsetHours ──────────────────────────────────────────────────────────

describe("getOffsetHours", () => {
  it("returns 0 for UTC", () => {
    expect(getOffsetHours("UTC")).toBe(0);
  });

  it("returns a number within valid range", () => {
    const offset = getOffsetHours("Asia/Kolkata"); // UTC+5:30 — rounds to 6
    expect(typeof offset).toBe("number");
    expect(offset).toBeGreaterThanOrEqual(-12);
    expect(offset).toBeLessThanOrEqual(14);
  });
});

// ─── getCurrentHour ──────────────────────────────────────────────────────────

describe("getCurrentHour", () => {
  it("returns a number between 0 and 23", () => {
    const hour = getCurrentHour("Asia/Tokyo");
    expect(hour).toBeGreaterThanOrEqual(0);
    expect(hour).toBeLessThanOrEqual(23);
  });

  it("returns 0 for an invalid timezone", () => {
    expect(getCurrentHour("Invalid/Timezone")).toBe(0);
  });
});

// ─── getLocalTime ────────────────────────────────────────────────────────────

describe("getLocalTime", () => {
  it("returns a Date object", () => {
    expect(getLocalTime("Asia/Tokyo")).toBeInstanceOf(Date);
  });

  it("returns a valid date", () => {
    const date = getLocalTime("America/New_York");
    expect(isNaN(date.getTime())).toBe(false);
  });
});
