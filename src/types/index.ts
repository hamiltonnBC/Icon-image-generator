import type { DeviconEntry } from './devicon.js';

export interface IconEntry {
  id: string;           // unique instance id (uuid)
  name: string;         // devicon name (e.g., "react")
  displayName: string;  // human-readable name (e.g., "React")
  svgUrl: string;       // CDN URL for the SVG
  variant: string;      // e.g., "original", "plain"
}

export interface Category {
  id: string;           // unique id
  name: string;         // display name / header text
  iconIds: string[];    // ordered list of IconEntry ids
}

export interface GridSettings {
  iconSize: number;         // 32–256 pixels
  labelEnabled: boolean;
  labelPosition: 'above' | 'below';
  labelFontSize: number;    // in pixels
  categoryHeaderEnabled: boolean; // show/hide category headers on canvas
  background: 'white' | 'transparent';
  padding: number;          // spacing between icons
  categorySpacing: number;  // vertical space between category sections
}

export interface GridState {
  categories: Category[];
  icons: Record<string, IconEntry>;  // icon registry by id
  settings: GridSettings;
}

export interface AppState {
  grid: GridState;
  search: {
    query: string;
    results: DeviconEntry[];
  };
  ui: {
    draggingIconId: string | null;
    isExporting: boolean;
  };
}

export type { DeviconEntry } from './devicon.js';
export type { LayoutResult, LayoutElement } from './layout.js';
export type { ExportOptions } from './export.js';
