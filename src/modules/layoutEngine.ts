import type { GridState } from '../types/index.js';
import type { LayoutResult, LayoutElement } from '../types/layout.js';

/** Font size for category headers */
const CATEGORY_HEADER_FONT_SIZE = 18;

/** Vertical gap between category header and the first row of icons */
const HEADER_TO_ICONS_GAP = 8;

/** Horizontal margin on the left/right edges of the canvas */
const CANVAS_MARGIN = 16;

/**
 * Computes the full layout of the icon grid based on the current state.
 * Supports configurable columns, max rows, and vertical/horizontal category direction.
 */
export function computeLayout(state: GridState): LayoutResult {
  const { categories, icons, settings } = state;
  const {
    iconSize,
    columns,
    maxRows,
    categoryDirection,
    labelEnabled,
    labelPosition,
    labelFontSize,
    padding,
    categorySpacing,
    categoryHeaderEnabled,
  } = settings;

  const elements: LayoutElement[] = [];
  const iconsPerRow = Math.max(1, columns);

  const cellWidth = iconSize + padding;
  const labelHeight = labelEnabled ? labelFontSize + 4 : 0;
  const cellHeight = iconSize + (labelEnabled ? labelHeight : 0);

  if (categoryDirection === 'vertical') {
    // Categories stacked top to bottom
    const canvasWidth = CANVAS_MARGIN + cellWidth * iconsPerRow - padding + CANVAS_MARGIN;
    let cursorY = CANVAS_MARGIN;

    for (let catIdx = 0; catIdx < categories.length; catIdx++) {
      const category = categories[catIdx];
      const validIconIds = category.iconIds.filter((id) => icons[id] != null);

      if (catIdx > 0) {
        cursorY += categorySpacing;
      }

      if (categoryHeaderEnabled) {
        elements.push({
          type: 'categoryHeader',
          text: category.name,
          x: CANVAS_MARGIN,
          y: cursorY,
          fontSize: CATEGORY_HEADER_FONT_SIZE,
        });
        cursorY += CATEGORY_HEADER_FONT_SIZE + HEADER_TO_ICONS_GAP;
      }

      // Limit icons if maxRows is set
      const maxIcons = maxRows > 0 ? maxRows * iconsPerRow : validIconIds.length;
      const displayedIcons = validIconIds.slice(0, maxIcons);

      for (let i = 0; i < displayedIcons.length; i++) {
        const iconId = displayedIcons[i];
        const iconEntry = icons[iconId];
        const col = i % iconsPerRow;
        const row = Math.floor(i / iconsPerRow);

        const cellX = CANVAS_MARGIN + col * cellWidth;
        const cellY = cursorY + row * (cellHeight + padding);

        placeIconAndLabel(elements, iconId, iconEntry.displayName, cellX, cellY, iconSize, labelEnabled, labelPosition, labelFontSize, labelHeight);
      }

      const rowCount = displayedIcons.length > 0 ? Math.ceil(displayedIcons.length / iconsPerRow) : 0;
      if (rowCount > 0) {
        cursorY += rowCount * (cellHeight + padding) - padding;
      }
    }

    const canvasHeight = cursorY + CANVAS_MARGIN;
    return { canvasWidth, canvasHeight, elements };

  } else {
    // Categories laid out left to right (horizontal)
    let cursorX = CANVAS_MARGIN;
    let maxHeight = 0;

    for (let catIdx = 0; catIdx < categories.length; catIdx++) {
      const category = categories[catIdx];
      const validIconIds = category.iconIds.filter((id) => icons[id] != null);

      if (catIdx > 0) {
        cursorX += categorySpacing;
      }

      let cursorY = CANVAS_MARGIN;

      if (categoryHeaderEnabled) {
        elements.push({
          type: 'categoryHeader',
          text: category.name,
          x: cursorX,
          y: cursorY,
          fontSize: CATEGORY_HEADER_FONT_SIZE,
        });
        cursorY += CATEGORY_HEADER_FONT_SIZE + HEADER_TO_ICONS_GAP;
      }

      const maxIcons = maxRows > 0 ? maxRows * iconsPerRow : validIconIds.length;
      const displayedIcons = validIconIds.slice(0, maxIcons);

      for (let i = 0; i < displayedIcons.length; i++) {
        const iconId = displayedIcons[i];
        const iconEntry = icons[iconId];
        const col = i % iconsPerRow;
        const row = Math.floor(i / iconsPerRow);

        const cellX = cursorX + col * cellWidth;
        const cellY = cursorY + row * (cellHeight + padding);

        placeIconAndLabel(elements, iconId, iconEntry.displayName, cellX, cellY, iconSize, labelEnabled, labelPosition, labelFontSize, labelHeight);
      }

      const rowCount = displayedIcons.length > 0 ? Math.ceil(displayedIcons.length / iconsPerRow) : 0;
      const categoryHeight = cursorY + (rowCount > 0 ? rowCount * (cellHeight + padding) - padding : 0) + CANVAS_MARGIN;
      maxHeight = Math.max(maxHeight, categoryHeight);

      // Advance cursor horizontally by the width of this category's columns
      cursorX += cellWidth * iconsPerRow - padding;
    }

    const canvasWidth = cursorX + CANVAS_MARGIN;
    const canvasHeight = maxHeight;
    return { canvasWidth, canvasHeight, elements };
  }
}

function placeIconAndLabel(
  elements: LayoutElement[],
  iconId: string,
  displayName: string,
  cellX: number,
  cellY: number,
  iconSize: number,
  labelEnabled: boolean,
  labelPosition: 'above' | 'below',
  labelFontSize: number,
  labelHeight: number,
): void {
  let iconX: number;
  let iconY: number;

  if (labelEnabled && labelPosition === 'above') {
    const labelX = cellX + iconSize / 2;
    const labelY = cellY;
    elements.push({ type: 'label', text: displayName, x: labelX, y: labelY, fontSize: labelFontSize });
    iconX = cellX;
    iconY = cellY + labelHeight;
  } else if (labelEnabled && labelPosition === 'below') {
    iconX = cellX;
    iconY = cellY;
    const labelX = cellX + iconSize / 2;
    const labelY = cellY + iconSize + 4;
    elements.push({ type: 'label', text: displayName, x: labelX, y: labelY, fontSize: labelFontSize });
  } else {
    iconX = cellX;
    iconY = cellY;
  }

  elements.push({ type: 'icon', iconId, x: iconX, y: iconY, size: iconSize });
}
