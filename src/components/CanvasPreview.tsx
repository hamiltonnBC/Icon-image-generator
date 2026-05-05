import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useGridContext } from '../state/context.js';
import { computeLayout } from '../modules/layoutEngine.js';
import { renderToCanvas } from '../modules/canvasRenderer.js';
import { fetchIcon } from '../modules/iconFetcher.js';

/**
 * CanvasPreview renders the icon grid onto an HTML5 canvas element.
 *
 * It subscribes to the grid context and re-renders whenever state changes.
 * The canvas is wrapped in a scrollable container for large grids and shows
 * a checkerboard pattern behind the canvas when the background is transparent.
 *
 * Exposes the canvas ref via forwardRef so parent components (e.g. ExportControls)
 * can access the underlying canvas element.
 */
export const CanvasPreview = forwardRef<HTMLCanvasElement>(function CanvasPreview(_props, ref) {
  const { state } = useGridContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Expose the internal canvas ref to the parent via forwardRef
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    async function render() {
      const layout = computeLayout(state);

      // Collect all icon SVG URLs that need fetching
      const iconUrls: string[] = [];
      for (const category of state.categories) {
        for (const iconId of category.iconIds) {
          const iconEntry = state.icons[iconId];
          if (iconEntry && !imageCacheRef.current.has(iconEntry.svgUrl)) {
            iconUrls.push(iconEntry.svgUrl);
          }
        }
      }

      // Fetch any uncached icons in parallel
      if (iconUrls.length > 0) {
        const results = await Promise.allSettled(
          iconUrls.map(async (url) => {
            const bitmap = await fetchIcon(url);
            return { url, bitmap };
          }),
        );

        if (cancelled) return;

        for (const result of results) {
          if (result.status === 'fulfilled') {
            imageCacheRef.current.set(result.value.url, result.value.bitmap);
          }
        }
      }

      if (cancelled) return;

      // Render the layout onto the canvas
      renderToCanvas(canvas!, layout, state, imageCacheRef.current);
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [state]);

  const isTransparent = state.settings.background === 'transparent';

  return (
    <div
      className="canvas-preview"
      style={{
        overflow: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'relative',
      }}
    >
      <div
        className="canvas-preview__canvas-wrapper"
        style={{
          display: 'inline-block',
          ...(isTransparent
            ? {
                backgroundImage: [
                  'linear-gradient(45deg, #ccc 25%, transparent 25%)',
                  'linear-gradient(-45deg, #ccc 25%, transparent 25%)',
                  'linear-gradient(45deg, transparent 75%, #ccc 75%)',
                  'linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                ].join(', '),
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }
            : {}),
        }}
      >
        <canvas
          ref={canvasRef}
          aria-label="Icon grid preview"
          style={{ display: 'block' }}
        />
      </div>
    </div>
  );
});
