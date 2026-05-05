import type { IconEntry, Category, GridSettings } from '../types/index.js';

export type GridAction =
  | { type: 'ADD_ICON'; payload: { icon: IconEntry; categoryId: string } }
  | { type: 'REMOVE_ICON'; payload: { iconId: string } }
  | { type: 'REORDER_ICON'; payload: { categoryId: string; sourceIndex: number; destinationIndex: number } }
  | { type: 'MOVE_ICON'; payload: { iconId: string; sourceCategoryId: string; destinationCategoryId: string; destinationIndex: number } }
  | { type: 'CREATE_CATEGORY'; payload: { id: string; name: string } }
  | { type: 'RENAME_CATEGORY'; payload: { categoryId: string; name: string } }
  | { type: 'DELETE_CATEGORY'; payload: { categoryId: string } }
  | { type: 'REORDER_CATEGORIES'; payload: { categories: Category[] } }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GridSettings> };
