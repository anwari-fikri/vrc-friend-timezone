/**
 * Convert a File object to a base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Convert a base64 string back to a blob URL for display
 * (Note: base64 can be used directly in img src, but blob URLs are cleaner)
 */
export function base64ToBlob(base64: string): Blob {
  const arr = base64.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * Convert a base64 string directly to a blob URL
 */
export function base64ToBlobUrl(base64: string): string {
  const blob = base64ToBlob(base64);
  return URL.createObjectURL(blob);
}
