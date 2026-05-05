import type { DeviconEntry } from '../types/devicon.js';

const MANIFEST_URL =
  'https://raw.githubusercontent.com/devicons/devicon/master/devicon.json';

let cachedManifest: DeviconEntry[] | null = null;

/**
 * Fetches the devicon manifest from GitHub. Caches the result in memory
 * so subsequent calls return the same data without a network request.
 */
export async function fetchManifest(): Promise<DeviconEntry[]> {
  if (cachedManifest) {
    return cachedManifest;
  }

  const response = await fetch(MANIFEST_URL);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch devicon manifest: ${response.status} ${response.statusText}`,
    );
  }

  const data: DeviconEntry[] = await response.json();
  cachedManifest = data;
  return data;
}

/**
 * Searches the devicon manifest with case-insensitive matching on
 * name, altnames, and tags. Returns all icons when query is empty.
 */
export function searchIcons(
  query: string,
  manifest: DeviconEntry[],
): DeviconEntry[] {
  const trimmed = query.trim();
  if (trimmed === '') {
    return manifest;
  }

  const lowerQuery = trimmed.toLowerCase();

  return manifest.filter((entry) => {
    if (entry.name.toLowerCase().includes(lowerQuery)) {
      return true;
    }

    if (entry.altnames.some((alt) => alt.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    if (entry.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
      return true;
    }

    return false;
  });
}

/**
 * Clears the cached manifest. Useful for testing or forcing a re-fetch.
 */
export function clearManifestCache(): void {
  cachedManifest = null;
}
