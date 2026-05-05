import type { ExportOptions } from '../types/export';

/**
 * Exports the canvas content as a downloadable image file.
 *
 * For PNG: directly exports the canvas content.
 * For JPEG: composites onto a white background first (JPEG doesn't support transparency),
 * then exports with the specified quality.
 */
export function exportCanvas(
  canvas: HTMLCanvasElement,
  options: ExportOptions
): void {
  const { format, quality } = options;
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const filename = `icon-grid.${format}`;

  if (format === 'jpeg') {
    // JPEG doesn't support transparency, so composite onto a white background
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context for temporary canvas');
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    tempCanvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error(
            'Export failed: toBlob returned null. Try a different format.'
          );
        }
        triggerDownload(blob, filename);
      },
      mimeType,
      quality
    );
  } else {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error(
          'Export failed: toBlob returned null. Try a different format.'
        );
      }
      triggerDownload(blob, filename);
    }, mimeType);
  }
}

/**
 * Creates an object URL from the blob, triggers a download via an anchor element,
 * then revokes the URL to free memory.
 */
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
