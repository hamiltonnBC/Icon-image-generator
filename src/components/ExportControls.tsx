import { useCallback, useRef, useState } from 'react';
import { exportCanvas } from '../modules/exportModule.js';
import type { ExportOptions } from '../types/export.js';

interface ExportControlsProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function ExportControls({ canvasRef }: ExportControlsProps) {
  const [format, setFormat] = useState<ExportOptions['format']>('png');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    errorTimeoutRef.current = setTimeout(() => {
      setError(null);
      errorTimeoutRef.current = null;
    }, 4000);
  }, []);

  const handleDownload = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      showError('Canvas is not available.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      exportCanvas(canvas, { format });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Export failed. Please try again.';
      showError(message);
    } finally {
      setLoading(false);
    }
  }, [canvasRef, format, showError]);

  return (
    <fieldset className="export-controls" aria-label="Export controls">
      <legend className="export-controls__legend">Export</legend>

      {/* Format Selection */}
      <div className="export-controls__field" role="group" aria-label="Export format">
        <span className="export-controls__label">Format</span>
        <div className="export-controls__format-buttons">
          <button
            type="button"
            className={`export-controls__format-btn${format === 'png' ? ' export-controls__format-btn--active' : ''}`}
            onClick={() => setFormat('png')}
            aria-pressed={format === 'png'}
          >
            PNG
          </button>
          <button
            type="button"
            className={`export-controls__format-btn${format === 'jpeg' ? ' export-controls__format-btn--active' : ''}`}
            onClick={() => setFormat('jpeg')}
            aria-pressed={format === 'jpeg'}
          >
            JPEG
          </button>
        </div>
      </div>

      {/* Download Button */}
      <div className="export-controls__field">
        <button
          type="button"
          className="export-controls__download-btn"
          onClick={handleDownload}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Exporting…' : `Download ${format.toUpperCase()}`}
        </button>
      </div>

      {/* Error Toast */}
      {error && (
        <div className="export-controls__error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </fieldset>
  );
}
