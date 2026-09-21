# Weavly

**AI-Powered Jacquard Saree Design Studio**

Weavly is a full-stack web application for designing traditional and contemporary Indian Jacquard sarees. It combines a real-time visual design canvas with AI-assisted pattern generation, authentic textile motif libraries, and production-ready export capabilities. Designers can craft complete saree compositions -- body, border, pallu, and blouse -- using procedural engines that simulate actual Jacquard loom weaving structures.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Motif Library](#motif-library)
- [AI Design Generation](#ai-design-generation)
- [Export Formats](#export-formats)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [API Reference](#api-reference)
- [License](#license)

---

## Features

### Design Canvas
- Interactive real-time canvas for composing full saree layouts
- Four independent design regions: body, border, pallu, and blouse
- Region-level controls for pattern type, density, scale, rotation, symmetry, and repeat mode
- Multiple view modes: full color, monochrome, grid, high contrast, and technical

### Procedural Pattern Engine
- Grid-based rendering engine that simulates Jacquard hook-and-pick weaving grids
- Symmetry engine supporting horizontal, vertical, radial, mirror, dual, and rotational symmetries
- Repeat engine with tile, half-drop, brick, mirror, and radial repeat strategies
- Configurable Jacquard parameters: hook width/height, grid dimensions, repeat size, border width, pallu and body lengths

### AI-Assisted Design
- Integration with Groq API for intelligent saree design generation
- Natural language prompts for each saree region
- AI selects appropriate motifs, patterns, color palettes, and weaving parameters based on saree type and style
- Per-region regeneration without affecting the rest of the design
- Deterministic fallback designs when the API is unavailable

### Motif Library
- 16 built-in SVG motifs drawn from traditional Indian textile heritage
- Categories include traditional, floral, geometric, and animal motifs
- Support for custom user-uploaded motifs

### Color Palette Management
- Role-based color system: primary, secondary, accent, background, zari, and custom
- Predefined palettes suited for traditional silk saree colorways
- Full palette customization per project

### Export and Production
- High-resolution PNG export (up to 2400x1200 default)
- SVG vector export
- PDF technical specification sheets via jsPDF
- Server-side export endpoints for batch processing

### Project Management
- File-based project persistence (JSON)
- Autosave functionality
- Design versioning with thumbnail snapshots
- Welcome screen for project creation and loading

### User Experience
- Dark and light theme support
- Configurable keyboard shortcuts (undo, redo, save, zoom, region selection)
- Toast notification system
- Collapsible inspector panels for a flexible workspace layout

---

## Architecture

Weavly follows a monorepo structure with two independent packages:

```
Weavly/
  client/     React + Vite frontend (design studio UI)
  server/     Express.js backend (project storage, AI generation, exports)
  data/       Runtime data directory (projects, motifs, exports)
  logs/       Server-side log files
```

The client communicates with the server over a REST API. Projects are stored as JSON files on the server filesystem. AI design generation is handled server-side through the Groq API, with results merged into the project model and returned to the client.

---

## Tech Stack

### Client
| Layer        | Technology                  |
|--------------|-----------------------------|
| Framework    | React 19                    |
| Build Tool   | Vite 8                      |
| Language     | TypeScript                  |
| State        | Zustand                     |
| Styling      | Tailwind CSS 3              |
| PDF Export   | jsPDF                       |
| Screenshot   | html2canvas                 |
| Linter       | oxlint                      |

### Server
| Layer        | Technology                  |
|--------------|-----------------------------|
| Runtime      | Node.js                     |
| Framework    | Express 4                   |
| Language     | TypeScript                  |
| AI Provider  | Groq API (OpenAI-compatible)|
| File Uploads | Multer                      |
| Dev Runner   | tsx (watch mode)             |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- A Groq API key (optional, required only for AI design generation)

### Installation

Clone the repository and install dependencies for all packages:

```bash
git clone https://github.com/your-username/Weavly.git
cd Weavly

# Install root dependencies (concurrently)
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Required for AI-powered design generation
GROQ_API_KEY=your_groq_api_key_here

# Optional overrides
GROQ_MODEL=openai/gpt-oss-20b
PORT=3001
NODE_ENV=development
```

If no API key is provided, the application will use deterministic fallback designs instead of AI-generated ones.

### Running the Application

Start both the client and server concurrently from the project root:

```bash
npm run dev
```

Or run them individually:

```bash
# Client only (default: http://localhost:5173)
npm run dev:client

# Server only (default: http://localhost:3001)
npm run dev:server
```

For a production build:

```bash
npm run build
npm start
```

---

## Project Structure

```
client/
  src/
    App.tsx                         Main application shell
    main.tsx                        Entry point
    components/
      ai/                           AI generation UI components
      canvas/                       Design canvas, grid view, saree layout, toolbar
      common/                       Shared UI (toasts, buttons)
      designer/                     Design input panel, color palette picker
      export/                       Export panel
      grid/                         Grid editing components
      layout/                       App shell, right inspector
      motifs/                       Motif selection and management
      project/                      Project creation and loading
      versions/                     Version history UI
      welcome/                      Welcome screen
    engine/
      GridEngine.ts                 Core hook-and-pick grid operations
      ProceduralEngine.ts           Full saree procedural rendering
      RepeatEngine.ts               Tile, half-drop, brick, mirror, radial repeats
      SymmetryEngine.ts             Symmetry transformations
      motifs.ts                     Built-in SVG motif definitions
    hooks/
      useAutosave.ts                Periodic project autosave
      useKeyboardShortcuts.ts       Global keyboard shortcut bindings
    stores/
      projectStore.ts               Project state and mutations (Zustand)
      uiStore.ts                    UI state: theme, panels, view mode
      historyStore.ts               Undo/redo history tracking
    types/
      project.ts                    Core domain types and defaults
      motif.ts                      Motif type definitions
      ai.ts                         AI request/response types
    utils/
      api.ts                        HTTP client for server API
      exporters.ts                  Client-side PNG, SVG, PDF export

server/
  src/
    server.ts                       Express app setup and startup
    ai/
      groqProvider.ts               Groq API client with fallback logic
    routes/
      projects.ts                   CRUD endpoints for projects
      generate.ts                   AI design generation endpoints
      exports.ts                    Server-side export endpoints
      motifs.ts                     Motif management endpoints
    services/                       Business logic layer
    storage/
      fileStorage.ts                JSON file-based project persistence
    utils/
      logger.ts                     Server-side logging
```

---

## Motif Library

Weavly ships with 16 heritage motifs, each defined as an SVG path:

| ID                 | Name                        | Category    |
|--------------------|-----------------------------|-------------|
| kalka_classic      | Kalka / Paisley             | Traditional |
| temple_spire       | Gopuram / Temple Peak       | Geometric   |
| kamal_lotus        | Kamal / Royal Lotus         | Floral      |
| mayil_peacock      | Mayil / Sacred Peacock      | Animal      |
| gaja_elephant      | Gaja / Royal Elephant       | Animal      |
| kairi_mango        | Kairi / Raw Mango           | Traditional |
| floral_bel         | Bel / Flowing Floral Vine   | Floral      |
| rudraksha_bead     | Rudraksha / Sacred Bead     | Geometric   |
| jali_lattice       | Jali / Mughal Lattice       | Geometric   |
| leheriya_wave      | Leheriya / Zigzag Wave      | Geometric   |
| butti_coin         | Ashoka Butti / Coin Medallion | Traditional |
| kalash_sacred      | Kalash / Sacred Urn         | Traditional |
| sun_suryamukhi     | Suryamukhi / Radiant Sun    | Floral      |
| shikargah_deer     | Shikargah / Running Deer    | Animal      |
| ashavali_flower    | Ashavali / Ahmedabad Rosette | Floral     |
| kili_parrot        | Kili / Twin Parrots         | Animal      |

---

## AI Design Generation

The AI generation system uses the Groq API (OpenAI-compatible) to produce complete saree design specifications from natural language descriptions.

### How It Works

1. The designer provides saree metadata (type, fabric, style) and optional region-specific prompts
2. The server constructs a detailed system prompt that includes the full motif catalog, available patterns, repeat types, and symmetry options
3. The Groq model returns a structured JSON specification containing motif selections, pattern parameters, a color palette, and Jacquard weaving notes
4. The specification is merged into the project and sent back to the client for rendering

### Generation Modes

- **Full Design**: Generates all four regions (body, border, pallu, blouse) in one request
- **Single Region**: Regenerates a specific region while preserving the rest of the design
- **Direct Generation**: Standalone endpoint that generates a design without requiring a saved project

### Fallback Behavior

When the Groq API is unreachable or no API key is configured, the system returns a deterministic fallback design with traditional patterns and a heritage color palette. This ensures the application remains fully functional offline.

---

## Export Formats

| Format | Description                                              |
|--------|----------------------------------------------------------|
| PNG    | High-resolution raster export, configurable dimensions   |
| SVG    | Scalable vector representation of the full saree design  |
| PDF    | Technical specification sheet with design parameters     |

Exports can be triggered from both the client-side export panel and through server-side API endpoints.

---

## Keyboard Shortcuts

| Shortcut         | Action              |
|------------------|----------------------|
| Ctrl/Cmd + Z     | Undo                |
| Ctrl/Cmd + Y     | Redo                |
| Ctrl/Cmd + S     | Save project        |
| Ctrl/Cmd + +     | Zoom in             |
| Ctrl/Cmd + -     | Zoom out            |

Additional shortcuts for region selection and tool switching are available and can be found in the keyboard shortcuts hook.

---

## API Reference

All endpoints are prefixed with `/api`.

### Projects

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /api/projects         | List all projects        |
| GET    | /api/projects/:id     | Get a single project     |
| POST   | /api/projects         | Create a new project     |
| PUT    | /api/projects/:id     | Update a project         |
| DELETE | /api/projects/:id     | Delete a project         |

### Design Generation

| Method | Endpoint                          | Description                        |
|--------|-----------------------------------|------------------------------------|
| POST   | /api/generate/direct              | Generate design without a project  |
| POST   | /api/projects/:id/generate        | Generate full design for a project |
| POST   | /api/projects/:id/generate/:region| Regenerate a single region         |

### Motifs

| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| GET    | /api/motifs       | List available motifs|

### Health

| Method | Endpoint       | Description           |
|--------|----------------|-----------------------|
| GET    | /api/health    | Server health check   |

---

## License

This project is private and not currently published under an open-source license.
