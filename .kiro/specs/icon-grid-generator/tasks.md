# Implementation Plan: Icon Grid Generator

## Overview

Build a static client-side React TypeScript Vite application that generates icon/logo grid images. Implementation follows a bottom-up approach: core modules first (state, layout, rendering), then UI components, then integration and export. Each task builds incrementally on the previous, ensuring no orphaned code.

## Tasks

- [x] 1. Project scaffolding and core interfaces
  - [x] 1.1 Initialize Vite + React + TypeScript project
    - Run `npm create vite@latest` with React TypeScript template
    - Install dependencies: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `uuid`, `fast-check` (dev)
    - Configure `tsconfig.json` with strict mode
    - Set up project directory structure: `src/components/`, `src/modules/`, `src/state/`, `src/types/`
    - _Requirements: All (project foundation)_

  - [x] 1.2 Define core TypeScript interfaces and types
    - Create `src/types/index.ts` with `IconEntry`, `Category`, `GridSettings`, `GridState`, `AppState`
    - Create `src/types/layout.ts` with `LayoutResult`, `LayoutElement` union type
    - Create `src/types/export.ts` with `ExportOptions`
    - Create `src/types/devicon.ts` with `DeviconEntry` interface
    - _Requirements: All (shared type definitions)_

- [x] 2. State management
  - [x] 2.1 Implement grid state reducer and context
    - Create `src/state/actions.ts` defining all action types (ADD_ICON, REMOVE_ICON, REORDER_ICON, MOVE_ICON, CREATE_CATEGORY, RENAME_CATEGORY, DELETE_CATEGORY, REORDER_CATEGORIES, UPDATE_SETTINGS)
    - Create `src/state/reducer.ts` implementing the grid state reducer with all action handlers
    - Create `src/state/context.ts` with React context and provider component using `useReducer`
    - Implement icon size clamping to [32, 256] range in UPDATE_SETTINGS handler
    - _Requirements: 1.2, 2.1, 2.2, 3.1, 3.2, 3.3, 3.5, 4.1, 4.2, 5.1, 5.2, 5.3, 6.1, 6.2, 9.1_

  - [ ]* 2.2 Write property tests for state reducer — icon operations
    - **Property 2: Adding an icon grows the target category**
    - **Property 3: Reordering icons within a category is a valid permutation**
    - **Property 4: Moving an icon between categories preserves total count**
    - **Property 15: Icon removal decreases count and removes from all categories**
    - **Validates: Requirements 1.2, 2.1, 2.2, 9.1**

  - [ ]* 2.3 Write property tests for state reducer — category operations
    - **Property 5: Category creation adds to the category list**
    - **Property 6: Category rename updates only the target category name**
    - **Property 7: Category deletion removes the category and its icons**
    - **Property 9: Category reordering is a valid permutation**
    - **Property 11: Icon size validation enforces bounds**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.5, 4.2**

- [x] 3. Devicon search module
  - [x] 3.1 Implement devicon manifest fetching and search
    - Create `src/modules/deviconSearch.ts`
    - Implement `fetchManifest()` to load `devicon.json` from GitHub raw URL
    - Implement `searchIcons(query: string, manifest: DeviconEntry[]): DeviconEntry[]` with case-insensitive matching on name, altnames, and tags
    - Return all icons when query is empty
    - Cache manifest in memory after first fetch
    - _Requirements: 1.1, 1.3_

  - [ ]* 3.2 Write property test for search filter
    - **Property 1: Search filter returns only matching results**
    - **Validates: Requirements 1.1**

- [x] 4. Checkpoint — Core state and search
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Layout engine
  - [x] 5.1 Implement layout computation
    - Create `src/modules/layoutEngine.ts`
    - Implement `computeLayout(state: GridState): LayoutResult`
    - Calculate canvas width based on number of icons per row, icon size, and padding
    - Position category headers above their icon groups
    - Position icons in rows within each category section
    - Position labels above or below icons based on settings
    - Account for label font size in vertical spacing
    - Ensure categories are vertically separated by `categorySpacing`
    - _Requirements: 3.4, 4.1, 4.3, 5.1, 5.2, 5.3, 5.4, 8.1_

  - [ ]* 5.2 Write property tests for layout engine — sizing and positioning
    - **Property 8: Layout engine positions categories in distinct vertical sections**
    - **Property 10: All icons rendered at specified square size**
    - **Validates: Requirements 3.4, 4.1, 4.3**

  - [ ]* 5.3 Write property tests for layout engine — labels
    - **Property 12: Labels match icons in count and content**
    - **Property 13: Label position is correct relative to its icon**
    - **Property 14: Labels do not overlap icons**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

- [x] 6. Icon fetcher and canvas renderer
  - [x] 6.1 Implement icon fetcher with caching
    - Create `src/modules/iconFetcher.ts`
    - Implement `fetchIcon(svgUrl: string): Promise<ImageBitmap>` that fetches SVG, rasterizes to ImageBitmap
    - Maintain a `Map<string, ImageBitmap>` cache to avoid re-fetching
    - Handle fetch errors with placeholder/retry logic
    - Implement 10-second timeout per fetch
    - _Requirements: 1.4, 8.1_

  - [x] 6.2 Implement canvas renderer
    - Create `src/modules/canvasRenderer.ts`
    - Implement `renderToCanvas(canvas: HTMLCanvasElement, layout: LayoutResult, state: GridState, imageCache: Map<string, ImageBitmap>): void`
    - Draw background (white fill or clear for transparent)
    - Draw category headers as text
    - Draw icons from ImageBitmap cache at computed positions and sizes
    - Draw labels at computed positions with configured font size
    - Display checkerboard pattern behind canvas in preview for transparent backgrounds
    - _Requirements: 4.1, 5.1, 5.2, 5.3, 6.1, 6.2, 6.3, 8.1_

- [x] 7. Export module
  - [x] 7.1 Implement image export
    - Create `src/modules/exportModule.ts`
    - Implement `exportCanvas(canvas: HTMLCanvasElement, options: ExportOptions): void`
    - For PNG: call `canvas.toBlob('image/png')` and trigger download
    - For JPEG: if background is transparent, create temp canvas with white fill, composite, then export as `image/jpeg`
    - Name file as `icon-grid.{format}`
    - Handle `toBlob` returning null with error notification
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 8. Checkpoint — Core modules complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. UI components — Icon Panel
  - [x] 9.1 Implement IconPanel component
    - Create `src/components/IconPanel.tsx`
    - Render search input with debounced filtering (300ms)
    - Display filtered icons as visual thumbnails with names
    - On icon click, dispatch ADD_ICON action to add icon to active category
    - Show loading state while manifest is being fetched
    - Show error state with retry button if manifest fetch fails
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 10. UI components — Settings and Export
  - [x] 10.1 Implement SettingsPanel component
    - Create `src/components/SettingsPanel.tsx`
    - Icon size slider (32–256 range)
    - Label toggle (enabled/disabled)
    - Label position selector (above/below)
    - Label font size input
    - Background toggle (white/transparent)
    - All changes dispatch UPDATE_SETTINGS action
    - _Requirements: 4.1, 4.2, 5.1, 5.2, 5.3, 6.1, 6.2_

  - [x] 10.2 Implement ExportControls component
    - Create `src/components/ExportControls.tsx`
    - Format selection buttons (PNG / JPEG)
    - Download button that calls `exportCanvas`
    - Show loading state during export
    - Show error toast if export fails
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 11. UI components — Category and Grid management
  - [x] 11.1 Implement CategoryManager component
    - Create `src/components/CategoryManager.tsx`
    - UI for creating new categories (name input + add button)
    - Inline rename functionality for existing categories
    - Delete button per category with confirmation
    - Drag handle for reordering categories
    - Validate non-empty category names
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

  - [x] 11.2 Implement GridEditor and IconCard components
    - Create `src/components/GridEditor.tsx` and `src/components/IconCard.tsx`
    - Set up @dnd-kit `DndContext` with sortable containers per category
    - Implement `SortableItem` wrappers for icons within categories
    - Support drag between categories (MOVE_ICON) and within category (REORDER_ICON)
    - Show visual drop indicator during drag
    - IconCard renders icon thumbnail with visible remove button
    - _Requirements: 2.1, 2.2, 2.3, 9.1, 9.2_

- [x] 12. UI components — Canvas Preview
  - [x] 12.1 Implement CanvasPreview component
    - Create `src/components/CanvasPreview.tsx`
    - Host `<canvas>` element sized to layout dimensions
    - Re-render canvas on any state change (subscribe to context)
    - Implement scroll/zoom for large canvases that exceed viewport
    - Show checkerboard pattern behind canvas when background is transparent
    - Ensure re-render completes within 200ms for typical grids
    - _Requirements: 6.3, 8.1, 8.2, 8.3_

- [x] 13. App shell and integration
  - [x] 13.1 Implement App root component and wire everything together
    - Create `src/components/App.tsx` as root layout shell
    - Wrap with state context provider
    - Arrange layout: IconPanel (sidebar), CanvasPreview (main), SettingsPanel + ExportControls + CategoryManager (sidebar/toolbar)
    - Initialize devicon manifest fetch on mount
    - Connect GridEditor to CanvasPreview (state changes trigger re-render)
    - Update `src/main.tsx` to render App
    - Add basic CSS/styling for layout
    - _Requirements: 8.2 (viewport-fitting layout)_

- [x] 14. Checkpoint — Full application wired
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 15. Integration tests
  - [ ]* 15.1 Write integration tests for end-to-end flows
    - Test: adding icons via search updates canvas render
    - Test: changing settings triggers re-render with correct layout
    - Test: export produces correct MIME type blob
    - Test: drag-and-drop reorder updates state correctly
    - _Requirements: 1.2, 2.1, 4.1, 7.1, 7.2, 8.1_

- [x] 16. Final checkpoint — All tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document using fast-check
- Unit tests validate specific examples and edge cases
- The application uses React + TypeScript + Vite with @dnd-kit for drag-and-drop and Canvas API for rendering
