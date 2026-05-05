const FETCH_TIMEOUT_MS = 10_000;

const imageCache = new Map<string, HTMLImageElement>();

/**
 * Fetches an SVG from the given URL by loading it into an HTMLImageElement.
 * This approach works reliably with SVGs (which lack intrinsic raster dimensions
 * and often fail with createImageBitmap).
 *
 * Caches the result so subsequent calls return immediately.
 * Throws on network errors or load failures.
 */
export async function fetchIcon(svgUrl: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(svgUrl);
  if (cached) {
    return cached;
  }

  const img = await loadImage(svgUrl);
  imageCache.set(svgUrl, img);
  return img;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timeoutId = setTimeout(() => {
      img.src = '';
      reject(new Error(`Icon fetch timed out after ${FETCH_TIMEOUT_MS}ms: ${url}`));
    }, FETCH_TIMEOUT_MS);

    img.onload = () => {
      clearTimeout(timeoutId);
      resolve(img);
    };

    img.onerror = () => {
      clearTimeout(timeoutId);
      reject(new Error(`Failed to load icon: ${url}`));
    };

    img.src = url;
  });
}

/**
 * Clears the icon image cache. Useful for testing or freeing memory.
 */
export function clearIconCache(): void {
  imageCache.clear();
}

/**
 * Returns the current number of cached icons. Useful for diagnostics.
 */
export function getIconCacheSize(): number {
  return imageCache.size;
}
