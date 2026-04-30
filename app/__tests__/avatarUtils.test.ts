import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fileToBase64,
  base64ToBlob,
  base64ToBlobUrl,
} from "../../lib/utils/avatarUtils";

// A small 1x1 red pixel PNG in base64
const SAMPLE_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==";

// ─── base64ToBlob ─────────────────────────────────────────────────────────────

describe("base64ToBlob", () => {
  it("returns a Blob", () => {
    const blob = base64ToBlob(SAMPLE_BASE64);
    expect(blob).toBeInstanceOf(Blob);
  });

  it("sets the correct MIME type from base64 string", () => {
    const blob = base64ToBlob(SAMPLE_BASE64);
    expect(blob.type).toBe("image/png");
  });

  it("sets jpeg MIME type correctly", () => {
    const jpegBase64 = SAMPLE_BASE64.replace("image/png", "image/jpeg");
    const blob = base64ToBlob(jpegBase64);
    expect(blob.type).toBe("image/jpeg");
  });

  it("falls back to image/png if MIME type is missing", () => {
    const noMime = "data:;base64,abc";
    // won't throw, just defaults
    expect(() => base64ToBlob(noMime)).not.toThrow();
  });

  it("produces a non-empty Blob", () => {
    const blob = base64ToBlob(SAMPLE_BASE64);
    expect(blob.size).toBeGreaterThan(0);
  });
});

// ─── base64ToBlobUrl ──────────────────────────────────────────────────────────

describe("base64ToBlobUrl", () => {
  beforeEach(() => {
    // jsdom doesn't implement createObjectURL, so mock it
    URL.createObjectURL = vi.fn(() => "blob:mock-url-1234");
  });

  it("returns a string", () => {
    const url = base64ToBlobUrl(SAMPLE_BASE64);
    expect(typeof url).toBe("string");
  });

  it("calls URL.createObjectURL with a Blob", () => {
    base64ToBlobUrl(SAMPLE_BASE64);
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
  });

  it("returns the mocked blob URL", () => {
    const url = base64ToBlobUrl(SAMPLE_BASE64);
    expect(url).toBe("blob:mock-url-1234");
  });
});

// ─── fileToBase64 ─────────────────────────────────────────────────────────────

describe("fileToBase64", () => {
  it("resolves with a base64 string", async () => {
    const file = new File(["hello"], "test.png", { type: "image/png" });

    class MockFileReader {
      result: string = "";
      onload: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      readAsDataURL() {
        setTimeout(() => {
          this.result = "data:image/png;base64,aGVsbG8=";
          this.onload?.();
        }, 0);
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);

    const result = await fileToBase64(file);
    expect(result).toBe("data:image/png;base64,aGVsbG8=");
  });

  it("rejects when FileReader errors", async () => {
    const file = new File(["hello"], "test.png", { type: "image/png" });

    class MockFileReader {
      result: string = "";
      onload: (() => void) | null = null;
      onerror: ((e: unknown) => void) | null = null;
      readAsDataURL() {
        setTimeout(() => {
          this.onerror?.("read error");
        }, 0);
      }
    }

    vi.stubGlobal("FileReader", MockFileReader);

    await expect(fileToBase64(file)).rejects.toBe("read error");
  });
});
