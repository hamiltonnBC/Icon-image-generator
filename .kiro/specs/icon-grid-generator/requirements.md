# Requirements Document

## Introduction

A static client-side React TypeScript application built with Vite that generates icon/logo grid images. Users can search and add icons from the Devicons library, arrange them in categorized grids with optional text labels, customize sizing and layout, and export the result as PNG or JPEG. All rendering and compositing happens in the browser using the Canvas API.

## Glossary

- **App**: The icon grid generator web application
- **Canvas**: The HTML5 Canvas element used for rendering and compositing the icon grid
- **Icon**: An SVG image fetched from the Devicons CDN and rendered onto the canvas
- **Grid**: The arrangement of icons in rows and columns on the canvas
- **Category**: A named group of icons displayed together with a header label
- **Label**: A text string rendered above or below an individual icon
- **Icon_Library**: The searchable collection of available icons sourced from the Devicons CDN
- **Export_Module**: The component responsible for converting the canvas content to a downloadable image file
- **Icon_Panel**: The sidebar or panel where users search and select icons to add to the grid
- **Layout_Engine**: The logic that calculates icon positions, padding, and category spacing on the canvas

## Requirements

### Requirement 1: Icon Search and Selection

**User Story:** As a user, I want to search for icons from the Devicons library and add them to my grid, so that I can build a custom icon composition.

#### Acceptance Criteria

1. WHEN the user types a search query into the Icon_Panel, THE App SHALL filter the Icon_Library and display matching icons within 300ms
2. WHEN the user selects an icon from the search results, THE App SHALL add that icon to the currently active Category in the Grid
3. THE Icon_Panel SHALL display icon results as visual thumbnails with their name visible
4. WHEN the user adds an icon, THE App SHALL fetch the SVG from the Devicons CDN and render it onto the Canvas

### Requirement 2: Icon Reordering via Drag and Drop

**User Story:** As a user, I want to reorder icons by dragging and dropping them, so that I can arrange the grid layout to my preference.

#### Acceptance Criteria

1. WHEN the user drags an icon to a new position within the same Category, THE App SHALL reorder the icons and update the Canvas to reflect the new arrangement
2. WHEN the user drags an icon to a different Category, THE App SHALL move the icon to that Category and update the Canvas
3. WHILE the user is dragging an icon, THE App SHALL display a visual indicator showing the drop target position

### Requirement 3: Category Management

**User Story:** As a user, I want to organize icons into named categories with headers, so that I can group related technologies together.

#### Acceptance Criteria

1. WHEN the user creates a new Category, THE App SHALL add a named section to the Grid with a visible header
2. WHEN the user renames a Category, THE App SHALL update the header text on the Canvas
3. WHEN the user deletes a Category, THE App SHALL remove the Category header and all its icons from the Grid
4. THE Layout_Engine SHALL render each Category as a distinct row or section with its header displayed above the icons
5. WHEN the user reorders categories, THE App SHALL update the Canvas to reflect the new category order

### Requirement 4: Icon Size Configuration

**User Story:** As a user, I want to change the size of icons in the grid, so that I can control the output dimensions.

#### Acceptance Criteria

1. WHEN the user adjusts the icon size setting, THE Layout_Engine SHALL re-render all icons at the specified pixel dimensions
2. THE App SHALL allow icon sizes between 32 and 256 pixels
3. THE Layout_Engine SHALL maintain equal width and height for each icon (square aspect ratio)

### Requirement 5: Text Labels

**User Story:** As a user, I want to add text labels above or below each icon, so that I can identify technologies in the exported image.

#### Acceptance Criteria

1. WHEN the user enables labels, THE App SHALL render a text label for each icon using the icon name
2. THE App SHALL allow the user to choose label position as either above or below the icon
3. WHEN the user changes the label font size, THE Layout_Engine SHALL re-render labels at the specified size
4. THE Layout_Engine SHALL adjust vertical spacing to accommodate labels without overlapping icons

### Requirement 6: Background Configuration

**User Story:** As a user, I want to toggle between a white background and a transparent background, so that I can use the exported image in different contexts.

#### Acceptance Criteria

1. WHEN the user selects a white background, THE Canvas SHALL render with a solid white (#FFFFFF) background
2. WHEN the user selects a transparent background, THE Canvas SHALL render with no background fill
3. THE App SHALL display a checkerboard pattern in the preview area to indicate transparency

### Requirement 7: Image Export

**User Story:** As a user, I want to export the grid as a PNG or JPEG file, so that I can use the image in documents, READMEs, or presentations.

#### Acceptance Criteria

1. WHEN the user selects PNG export, THE Export_Module SHALL generate a PNG file from the Canvas content and trigger a browser download
2. WHEN the user selects JPEG export, THE Export_Module SHALL generate a JPEG file from the Canvas content and trigger a browser download
3. WHEN the user exports as JPEG with a transparent background, THE Export_Module SHALL fill the background with white before encoding (JPEG does not support transparency)
4. THE Export_Module SHALL name the downloaded file using the pattern "icon-grid.{format}"

### Requirement 8: Live Canvas Preview

**User Story:** As a user, I want to see a real-time preview of the icon grid as I make changes, so that I can iterate on the layout before exporting.

#### Acceptance Criteria

1. WHEN the user modifies any setting (icon size, labels, background, order, categories), THE Canvas SHALL re-render within 200ms to reflect the change
2. THE App SHALL display the Canvas preview in the main content area at a size that fits the viewport
3. WHILE the Canvas content exceeds the viewport, THE App SHALL allow the user to scroll or zoom to view the full grid

### Requirement 9: Icon Removal

**User Story:** As a user, I want to remove individual icons from the grid, so that I can refine my selection.

#### Acceptance Criteria

1. WHEN the user removes an icon from the Grid, THE App SHALL delete that icon and re-render the Canvas without it
2. THE App SHALL provide a visible remove control on each icon in the grid
