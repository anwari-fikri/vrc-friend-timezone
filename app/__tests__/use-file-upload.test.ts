// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFileUpload, formatBytes } from "../../hooks/use-file-upload";

// ─── formatBytes ─────────────────────────────────────────────────────────────

describe("formatBytes", () => {
  it("returns '0 Bytes' for 0", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
  });

  it("formats bytes correctly", () => {
    expect(formatBytes(500)).toBe("500Bytes");
  });

  it("formats KB correctly", () => {
    expect(formatBytes(1024)).toBe("1KB");
  });

  it("formats MB correctly", () => {
    expect(formatBytes(1024 * 1024)).toBe("1MB");
  });

  it("formats GB correctly", () => {
    expect(formatBytes(1024 * 1024 * 1024)).toBe("1GB");
  });

  it("respects decimal places", () => {
    expect(formatBytes(1500, 1)).toBe("1.5KB");
  });

  it("defaults to 2 decimal places", () => {
    expect(formatBytes(1536)).toBe("1.5KB");
  });
});

// ─── useFileUpload ────────────────────────────────────────────────────────────

beforeEach(() => {
  URL.createObjectURL = vi.fn(() => "blob:mock-url");
  URL.revokeObjectURL = vi.fn();
});

const makeFile = (name = "test.png", size = 1000, type = "image/png") => {
  const file = new File(["x".repeat(size)], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("useFileUpload - initial state", () => {
  it("starts with empty files and no errors", () => {
    const { result } = renderHook(() => useFileUpload());
    expect(result.current[0].files).toEqual([]);
    expect(result.current[0].errors).toEqual([]);
    expect(result.current[0].isDragging).toBe(false);
  });

  it("loads initialFiles from options", () => {
    const initialFiles = [
      {
        id: "1",
        name: "avatar.png",
        size: 100,
        type: "image/png",
        url: "http://example.com/avatar.png",
      },
    ];
    const { result } = renderHook(() => useFileUpload({ initialFiles }));
    expect(result.current[0].files).toHaveLength(1);
    expect(result.current[0].files[0].id).toBe("1");
  });
});

describe("useFileUpload - addFiles", () => {
  it("adds a valid file", () => {
    const { result } = renderHook(() => useFileUpload());
    const file = makeFile();

    act(() => {
      result.current[1].addFiles([file]);
    });

    expect(result.current[0].files).toHaveLength(1);
    expect(result.current[0].files[0].file).toBe(file);
  });

  it("replaces file in single mode", () => {
    const { result } = renderHook(() => useFileUpload({ multiple: false }));

    act(() => result.current[1].addFiles([makeFile("a.png")]));
    act(() => result.current[1].addFiles([makeFile("b.png")]));

    expect(result.current[0].files).toHaveLength(1);
    expect((result.current[0].files[0].file as File).name).toBe("b.png");
  });

  it("accumulates files in multiple mode", () => {
    const { result } = renderHook(() => useFileUpload({ multiple: true }));

    act(() => result.current[1].addFiles([makeFile("a.png")]));
    act(() => result.current[1].addFiles([makeFile("b.png")]));

    expect(result.current[0].files).toHaveLength(2);
  });

  it("rejects file exceeding maxSize", () => {
    const { result } = renderHook(() => useFileUpload({ maxSize: 500 }));
    const file = makeFile("big.png", 1000);

    act(() => result.current[1].addFiles([file]));

    expect(result.current[0].files).toHaveLength(0);
    expect(result.current[0].errors.length).toBeGreaterThan(0);
  });

  it("rejects file with wrong type", () => {
    const { result } = renderHook(() =>
      useFileUpload({ accept: "image/jpeg" }),
    );
    const file = makeFile("test.png", 100, "image/png");

    act(() => result.current[1].addFiles([file]));

    expect(result.current[0].files).toHaveLength(0);
    expect(result.current[0].errors.length).toBeGreaterThan(0);
  });

  it("respects maxFiles in multiple mode", () => {
    const { result } = renderHook(() =>
      useFileUpload({ multiple: true, maxFiles: 1 }),
    );

    act(() =>
      result.current[1].addFiles([makeFile("a.png"), makeFile("b.png")]),
    );

    expect(result.current[0].errors.length).toBeGreaterThan(0);
  });

  it("calls onFilesChange when files are added", () => {
    const onFilesChange = vi.fn();
    const { result } = renderHook(() => useFileUpload({ onFilesChange }));

    act(() => result.current[1].addFiles([makeFile()]));

    expect(onFilesChange).toHaveBeenCalled();
  });

  it("calls onFilesAdded with newly added files", () => {
    const onFilesAdded = vi.fn();
    const { result } = renderHook(() => useFileUpload({ onFilesAdded }));

    act(() => result.current[1].addFiles([makeFile()]));

    expect(onFilesAdded).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ file: expect.any(File) }),
      ]),
    );
  });

  it("calls onError when file is invalid", () => {
    const onError = vi.fn();
    const { result } = renderHook(() =>
      useFileUpload({ maxSize: 10, onError }),
    );

    act(() => result.current[1].addFiles([makeFile("big.png", 1000)]));

    expect(onError).toHaveBeenCalled();
  });

  it("does nothing when empty list is passed", () => {
    const { result } = renderHook(() => useFileUpload());

    act(() => result.current[1].addFiles([]));

    expect(result.current[0].files).toHaveLength(0);
  });
});

describe("useFileUpload - removeFile", () => {
  it("removes a file by id", () => {
    const { result } = renderHook(() => useFileUpload());

    act(() => result.current[1].addFiles([makeFile()]));
    const id = result.current[0].files[0].id;
    act(() => result.current[1].removeFile(id));

    expect(result.current[0].files).toHaveLength(0);
  });

  it("calls URL.revokeObjectURL for image files", () => {
    const { result } = renderHook(() => useFileUpload());

    act(() => result.current[1].addFiles([makeFile()]));
    const id = result.current[0].files[0].id;
    act(() => result.current[1].removeFile(id));

    expect(URL.revokeObjectURL).toHaveBeenCalled();
  });
});

describe("useFileUpload - clearFiles", () => {
  it("clears all files", () => {
    const { result } = renderHook(() => useFileUpload());

    act(() =>
      result.current[1].addFiles([makeFile("a.png"), makeFile("b.png")]),
    );
    act(() => result.current[1].clearFiles());

    expect(result.current[0].files).toHaveLength(0);
  });

  it("clears errors too", () => {
    const { result } = renderHook(() => useFileUpload({ maxSize: 10 }));

    act(() => result.current[1].addFiles([makeFile("big.png", 1000)]));
    act(() => result.current[1].clearFiles());

    expect(result.current[0].errors).toHaveLength(0);
  });
});

describe("useFileUpload - clearErrors", () => {
  it("clears errors without affecting files", () => {
    const { result } = renderHook(() => useFileUpload({ maxSize: 10 }));

    act(() => result.current[1].addFiles([makeFile("big.png", 1000)]));
    act(() => result.current[1].clearErrors());

    expect(result.current[0].errors).toHaveLength(0);
  });
});

describe("useFileUpload - drag events", () => {
  const makeDragEvent = (overrides = {}) =>
    ({
      preventDefault: vi.fn(),
      stopPropagation: vi.fn(),
      currentTarget: { contains: vi.fn(() => false) },
      relatedTarget: null,
      dataTransfer: { files: [] },
      ...overrides,
    }) as unknown as React.DragEvent<HTMLElement>;

  it("sets isDragging to true on dragEnter", () => {
    const { result } = renderHook(() => useFileUpload());

    act(() => result.current[1].handleDragEnter(makeDragEvent()));

    expect(result.current[0].isDragging).toBe(true);
  });

  it("sets isDragging to false on dragLeave", () => {
    const { result } = renderHook(() => useFileUpload());

    act(() => result.current[1].handleDragEnter(makeDragEvent()));
    act(() => result.current[1].handleDragLeave(makeDragEvent()));

    expect(result.current[0].isDragging).toBe(false);
  });

  it("adds file on drop", () => {
    const { result } = renderHook(() => useFileUpload());
    const file = makeFile();

    const dropEvent = makeDragEvent({
      dataTransfer: { files: [file] },
    });

    act(() => result.current[1].handleDrop(dropEvent));

    expect(result.current[0].files).toHaveLength(1);
  });
});
