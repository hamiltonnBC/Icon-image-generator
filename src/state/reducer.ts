import type { GridState } from '../types/index.js';
import type { GridAction } from './actions.js';

const MIN_ICON_SIZE = 32;
const MAX_ICON_SIZE = 256;

function clampIconSize(size: number): number {
  return Math.max(MIN_ICON_SIZE, Math.min(MAX_ICON_SIZE, size));
}

export function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case 'ADD_ICON': {
      const { icon, categoryId } = action.payload;
      const updatedCategories = state.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, iconIds: [...cat.iconIds, icon.id] }
          : cat
      );
      return {
        ...state,
        icons: { ...state.icons, [icon.id]: icon },
        categories: updatedCategories,
      };
    }

    case 'REMOVE_ICON': {
      const { iconId } = action.payload;
      const { [iconId]: _removed, ...remainingIcons } = state.icons;
      const updatedCategories = state.categories.map((cat) => ({
        ...cat,
        iconIds: cat.iconIds.filter((id) => id !== iconId),
      }));
      return {
        ...state,
        icons: remainingIcons,
        categories: updatedCategories,
      };
    }

    case 'REORDER_ICON': {
      const { categoryId, sourceIndex, destinationIndex } = action.payload;
      const updatedCategories = state.categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        const newIconIds = [...cat.iconIds];
        const [moved] = newIconIds.splice(sourceIndex, 1);
        newIconIds.splice(destinationIndex, 0, moved);
        return { ...cat, iconIds: newIconIds };
      });
      return { ...state, categories: updatedCategories };
    }

    case 'MOVE_ICON': {
      const { iconId, sourceCategoryId, destinationCategoryId, destinationIndex } = action.payload;
      const updatedCategories = state.categories.map((cat) => {
        if (cat.id === sourceCategoryId) {
          return { ...cat, iconIds: cat.iconIds.filter((id) => id !== iconId) };
        }
        if (cat.id === destinationCategoryId) {
          const newIconIds = [...cat.iconIds];
          newIconIds.splice(destinationIndex, 0, iconId);
          return { ...cat, iconIds: newIconIds };
        }
        return cat;
      });
      return { ...state, categories: updatedCategories };
    }

    case 'CREATE_CATEGORY': {
      const { id, name } = action.payload;
      const newCategory = { id, name, iconIds: [] };
      return {
        ...state,
        categories: [...state.categories, newCategory],
      };
    }

    case 'RENAME_CATEGORY': {
      const { categoryId, name } = action.payload;
      const updatedCategories = state.categories.map((cat) =>
        cat.id === categoryId ? { ...cat, name } : cat
      );
      return { ...state, categories: updatedCategories };
    }

    case 'DELETE_CATEGORY': {
      const { categoryId } = action.payload;
      const categoryToDelete = state.categories.find((cat) => cat.id === categoryId);
      if (!categoryToDelete) return state;

      // Find icons that belong exclusively to this category
      const otherCategories = state.categories.filter((cat) => cat.id !== categoryId);
      const iconsInOtherCategories = new Set(
        otherCategories.flatMap((cat) => cat.iconIds)
      );
      const iconsToRemove = categoryToDelete.iconIds.filter(
        (id) => !iconsInOtherCategories.has(id)
      );

      // Remove exclusive icons from registry
      const remainingIcons = { ...state.icons };
      for (const iconId of iconsToRemove) {
        delete remainingIcons[iconId];
      }

      return {
        ...state,
        categories: otherCategories,
        icons: remainingIcons,
      };
    }

    case 'REORDER_CATEGORIES': {
      const { categories } = action.payload;
      return { ...state, categories };
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.payload };
      if ('iconSize' in action.payload) {
        newSettings.iconSize = clampIconSize(newSettings.iconSize);
      }
      return { ...state, settings: newSettings };
    }

    default:
      return state;
  }
}
