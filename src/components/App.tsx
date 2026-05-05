import { useRef } from 'react';
import { GridProvider } from '../state/context.js';
import { IconPanel } from './IconPanel.js';
import { CanvasPreview } from './CanvasPreview.js';
import { IconList } from './IconList.js';
import { SettingsPanel } from './SettingsPanel.js';
import { ExportControls } from './ExportControls.js';
import { CategoryManager } from './CategoryManager.js';
import '../App.css';

function AppContent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="app-layout">
      {/* Left Sidebar — Icon Search & Add */}
      <aside className="app-layout__sidebar app-layout__sidebar--left" aria-label="Icon library">
        <IconPanel />
      </aside>

      {/* Main Content — Canvas Preview + Icon List */}
      <main className="app-layout__main">
        <div className="app-layout__canvas-area">
          <CanvasPreview ref={canvasRef} />
        </div>
        <div className="app-layout__grid-editor">
          <IconList />
        </div>
      </main>

      {/* Right Sidebar — Settings, Export, Categories */}
      <aside className="app-layout__sidebar app-layout__sidebar--right" aria-label="Settings and controls">
        <SettingsPanel />
        <ExportControls canvasRef={canvasRef} />
        <CategoryManager />
      </aside>
    </div>
  );
}

export function App() {
  return (
    <GridProvider>
      <AppContent />
    </GridProvider>
  );
}
