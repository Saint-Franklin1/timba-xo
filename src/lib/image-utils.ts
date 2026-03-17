/**
 * Extracts the first image URL from a JSONB images column.
 * Handles both legacy string[] format and new {url, path, isHD, type}[] format.
 */
export function getImageUrl(images: unknown): string | null {
  if (!images || !Array.isArray(images) || images.length === 0) return null;

  const first = images[0];

  // New format: object with url property
  if (typeof first === "object" && first !== null && "url" in first) {
    return (first as { url: string }).url || null;
  }

  // Legacy format: plain string
  if (typeof first === "string") return first;

  return null;
}

/**
 * Extracts all image URLs from a JSONB images column.
 */
export function getAllImageUrls(images: unknown): string[] {
  if (!images || !Array.isArray(images)) return [];

  return images
    .map((item) => {
      if (typeof item === "object" && item !== null && "url" in item) {
        return (item as { url: string }).url;
      }
      if (typeof item === "string") return item;
      return null;
    })
    .filter((url): url is string => !!url);
}

/**
 * Gets the HD image URL if one exists, otherwise the first image.
 */
export function getHDImageUrl(images: unknown): string | null {
  if (!images || !Array.isArray(images)) return null;

  const hd = images.find(
    (item) => typeof item === "object" && item !== null && "isHD" in item && item.isHD
  );

  if (hd && typeof hd === "object" && "url" in hd) {
    return (hd as { url: string }).url;
  }

  return getImageUrl(images);
}
