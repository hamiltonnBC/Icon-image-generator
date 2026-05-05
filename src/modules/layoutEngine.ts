import type { GridState } from '../types/index.js';
import type { LayoutResult, LayoutElement } from '../types/layout.js';

/** Fixed number of icons per row */
const ICONS_PER_ROW = 10;

/** Font size for category headers */
const CATEGORY_HEADER_FONT_SIZE = 18;

/** Vertical gap between category header and the first row of icons */
const HEADER_TO_ICONS_GAP = 8;

/** Horizontal margin on the left/right edges of the canvas */
const CANVAS_MARGIN = 16;

/**
 * Computes the full layout of the icon grid based on the current state.
 * Returns positions for all category headers, icons, and labels.
 */
export function computeLayout(state: GridState): LayoutResult {
  const { categories, icons, settings } = state;
  const { iconSize, labelEnabled, labelPosition, labelFontSize, padding, categorySpacing, categoryHeaderEnabled } = settings;

  const elements: LayoutElement[] = [];

  // Calculate canvas width: margin + (iconSize + padding) * iconsPerRow - padding + margin
  const cellWidth = iconSize + padding;
  const canvasWidth = CANVAS_MARGIN + cellWidth * ICONS_PER_ROW - padding + CANVAS_MARGIN;

  // Calculate the height of a single icon cell (icon + optional label)
  const labelHeight = labelEnabled ? labelFontSize + 4 : 0; // 4px gap between label and icon
  const cellHeight = iconSize + (labelEnabled ? labelHeight : 0);

  let cursorY = CANVAS_MARGIN;

  for (let catIdx = 0; catIdx < categories.length; catIdx++) {
    const category = categories[catIdx];

    // Filter to only icons that exist in the registry
    const validIconIds = category.iconIds.filter((id) => icons[id] != null);

    // Add category spacing between categories (not before the first one)
    if (catIdx > 0) {
      cursorY += categorySpacing;
    }

    // Place category header (only if enabled)
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

    // Place icons in rows
    for (let i = 0; i < validIconIds.length; i++) {
      const iconId = validIconIds[i];
      const iconEntry = icons[iconId];
      const col = i % ICONS_PER_ROW;
      const row = Math.floor(i / ICONS_PER_ROW);

      const cellX = CANVAS_MARGIN + col * cellWidth;
      const cellY = cursorY + row * (cellHeight + padding);

      // Determine icon and label positions based on label placement
      let iconX: number;
      let iconY: number;

      if (labelEnabled && labelPosition === 'above') {
        // Label above: label first, then icon below it
        const labelX = cellX + iconSize / 2; // center label horizontally on icon
        const labelY = cellY;

        elements.push({
          type: 'label',
          text: iconEntry.displayName,
          x: labelX,
          y: labelY,
          fontSize: labelFontSize,
        });

        iconX = cellX;
        iconY = cellY + labelHeight;
      } else if (labelEnabled && labelPosition === 'below') {
        // Icon first, then label below it
        iconX = cellX;
        iconY = cellY;

        const labelX = cellX + iconSize / 2; // center label horizontally on icon
        const labelY = cellY + iconSize + 4; // 4px gap below icon

        elements.push({
          type: 'label',
          text: iconEntry.displayName,
          x: labelX,
          y: labelY,
          fontSize: labelFontSize,
        });
      } else {
        // No labels
        iconX = cellX;
        iconY = cellY;
      }

      elements.push({
        type: 'icon',
        iconId,
        x: iconX,
        y: iconY,
        size: iconSize,
      });
    }

    // Advance cursor past all rows in this category
    const rowCount = validIconIds.length > 0 ? Math.ceil(validIconIds.length / ICONS_PER_ROW) : 0;
    if (rowCount > 0) {
      cursorY += rowCount * (cellHeight + padding) - padding;
    }
  }

  const canvasHeight = cursorY + CANVAS_MARGIN;

  return {
    canvasWidth,
    canvasHeight,
    elements,
  };
}
