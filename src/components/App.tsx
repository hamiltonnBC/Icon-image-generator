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
    <div className="app-wrapper">
      {/* Header */}
      <header className="app-header">
        <img
          src={`${import.meta.env.BASE_URL}icon-image-generator.png`}
          alt="Icon Grid Generator logo"
          className="app-header__logo"
        />
        <div className="app-header__text">
          <h1 className="app-header__title">Icon Grid Generator</h1>
          <p className="app-header__description">
            Build custom icon grid images from the Devicons library. Search for icons, organize them
            into categories, customize the layout and sizing, then export as PNG or JPEG.
          </p>
        </div>
      </header>

      {/* Main Layout */}
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

        {/* Right Sidebar — Settings on left, Export + Categories on right */}
        <aside className="app-layout__sidebar app-layout__sidebar--right" aria-label="Settings and controls">
          <div className="app-layout__sidebar-col">
            <SettingsPanel />
          </div>
          <div className="app-layout__sidebar-col">
            <ExportControls canvasRef={canvasRef} />
            <CategoryManager />
          </div>
        </aside>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <span className="app-footer__name">Nicholas Trey Hamilton</span>
        <nav className="app-footer__links" aria-label="Social links">
          <a
            href="https://github.com/hamiltonnBC"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="app-footer__link"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/nicholas-trey-hamilton/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="app-footer__link"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a
            href="https://nicholastreyhamilton.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Personal website"
            className="app-footer__link"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </a>
          <a
            href="https://github.com/hamiltonnBC/Icon-image-generator/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Project repository"
            className="app-footer__link app-footer__link--repo"
          >
            Checkout Repository Here!
          </a>
        </nav>
      </footer>
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
