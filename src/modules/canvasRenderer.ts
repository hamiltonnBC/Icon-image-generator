import type { LayoutResult, LayoutElement } from '../types/layout.js';
import type { GridState } from '../types/index.js';

/**
 * Renders the computed layout onto an HTML5 canvas element.
 *
 * Sets the canvas dimensions from the layout, clears it, draws the background,
 * then iterates through layout elements drawing category headers, icons, and labels.
 *
 * The checkerboard pattern for transparent backgrounds is handled via CSS on the
 * canvas container element, not drawn on the canvas itself.
 */
export function renderToCanvas(
  canvas: HTMLCanvasElement,
  layout: LayoutResult,
  state: GridState,
  imageCache: Map<string, HTMLImageElement>,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to get 2D rendering context from canvas');
  }

  // Set canvas dimensions from layout
  canvas.width = layout.canvasWidth;
  canvas.height = layout.canvasHeight;

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  if (state.settings.background === 'white') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  // For 'transparent', leave the canvas clear (no fill)

  // Draw each layout element
  for (const element of layout.elements) {
    switch (element.type) {
      case 'categoryHeader':
        drawCategoryHeader(ctx, element);
        break;
      case 'icon':
        drawIcon(ctx, element, state, imageCache);
        break;
      case 'label':
        drawLabel(ctx, element);
        break;
    }
  }
}

/**
 * Draws a category header as bold text at the specified position.
 */
function drawCategoryHeader(
  ctx: CanvasRenderingContext2D,
  element: Extract<LayoutElement, { type: 'categoryHeader' }>,
): void {
  ctx.save();
  ctx.font = `bold ${element.fontSize}px sans-serif`;
  ctx.fillStyle = '#000000';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(element.text, element.x, element.y);
  ctx.restore();
}

/**
 * Draws an icon from the image cache at the computed position and size.
 * If the icon is not found in the cache, draws a placeholder rectangle.
 */
function drawIcon(
  ctx: CanvasRenderingContext2D,
  element: Extract<LayoutElement, { type: 'icon' }>,
  state: GridState,
  imageCache: Map<string, HTMLImageElement>,
): void {
  const iconEntry = state.icons[element.iconId];
  if (!iconEntry) {
    return;
  }

  const img = imageCache.get(iconEntry.svgUrl);
  if (img) {
    ctx.drawImage(img, element.x, element.y, element.size, element.size);
  } else {
    // Draw a placeholder rectangle for icons not yet loaded
    ctx.save();
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    ctx.strokeRect(element.x, element.y, element.size, element.size);
    ctx.restore();
  }
}

/**
 * Draws a label centered horizontally at the specified position.
 */
function drawLabel(
  ctx: CanvasRenderingContext2D,
  element: Extract<LayoutElement, { type: 'label' }>,
): void {
  ctx.save();
  ctx.font = `${element.fontSize}px sans-serif`;
  ctx.fillStyle = '#000000';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';
  ctx.fillText(element.text, element.x, element.y);
  ctx.restore();
}
