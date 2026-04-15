# Online Document Editor (Online Word)

A web-based rich text document editing and management system that provides a desktop Word-like editing experience, supporting document creation, formatting, insertion of multimedia elements, signatures, and export/import of DOCX files.

## Key Features

- **Rich Text Editing**: Supports text formatting such as bold, italic, underline, strikethrough, superscript/subscript, font color, and background highlighting.
- **Paragraph Layout**: Left, center, right, and justified alignment; first-line indentation; line spacing settings.
- **Lists**: Numbered lists, bullet lists, checkbox lists.
- **Insert Elements**: Images, tables, dividers, headers/footers, watermarks, code blocks, LaTeX formulas, date pickers.
- **Page Settings**: Paper size, orientation, margins, headers/footers, print preview.
- **Find and Replace**: Supports regex-based search and bulk replacement.
- **Handwritten Signature**: Provides a signature panel for drawing signatures and embedding them directly into the document.
- **Automatic Table of Contents**: Generates a table of contents based on document heading hierarchy.
- **DOCX Import/Export**: Full DOCX file parsing and generation, preserving most formatting styles.
- **Multi-language Support**: Built-in Chinese and English language packs; supports internationalization configuration.
- **Responsive Layout**: Adapts to different screen sizes for desktop and mobile devices.
- **Theme Switching**: Supports light/dark themes (based on Arco Design).

## Technology Stack

- **Frontend Framework**: Vue 3 + TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **UI Component Library**: Arco Design
- **Style Preprocessing**: Less + PostCSS
- **Code Quality**: ESLint, Stylelint, Prettier, commitlint
- **Deployment**: Supports environment variable configuration (development/production)

## Project Structure

```
src
├── api               # API request encapsulation
├── assets            # Static assets (images, fonts, style files)
├── components        # Shared components
├── config            # Build configuration, Vite plugins
├── directive         # Custom directives (e.g., permission control)
├── hooks             # Composition functions (reusable logic)
├── locales           # Internationalization language packs
├── router            # Routing configuration and guards
├── store             # Pinia state stores
├── types             # Type declarations
├── utils             # Utility functions (authentication, requests, uploads, exports, etc.)
└── views             # Page views
    ├── word          # Main editor (Word-style)
    ├── words         # Word variant (supports enhanced import/export features)
    ├── wordsbeat     # Alternative editor implementation
    └── ...
```

> The directory structure follows a modular, feature-based organization for easier maintenance and future expansion.

## Quick Start

### Prerequisites

- Node.js ≥ 16
- pnpm ≥ 7 (The project uses pnpm for dependency management)

### Install Dependencies

```bash
pnpm install
```

### Start Development Server

```bash
pnpm dev
```

The development server with hot-reload will start by default at `http://localhost:5173`.

### Build Production Version

```bash
pnpm build
```

The build output will be generated in the `dist` directory and can be deployed directly to a static server.

### Code Linting and Fixing

```bash
# ESLint check
pnpm lint

# Stylelint check
pnpm lint:style

# Auto-fix code formatting
pnpm lint:fix
```

## Common Feature Examples

### Adding a Handwritten Signature

1. Click the **Signature** icon in the toolbar to open the signature drawing panel;
2. Draw your signature using a mouse or touchscreen;
3. Click **Confirm** after completion to embed the signature at the cursor position.

### Importing a Local DOCX File

Click **Import** in the top-left corner of the editing page, then select a local `.docx` file. The system will automatically parse and convert it into editable rich text content.

### Exporting as DOCX

After editing, click the **Export** button to generate a `.docx` file compatible with Microsoft Word for download.

## Environment Variables

Two environment variable files are provided in the project root:

- `.env.development` — Development environment configuration
- `.env.production` — Production environment configuration

Common configuration options include:

- `VITE_API_BASE_URL` — Backend API endpoint
- `VITE_APP_TITLE` — Page title

> Please modify the appropriate environment file according to your actual needs.

## Contribution Guidelines

Issues and pull requests are welcome! Before submitting code, please ensure:

1. Your code adheres to the project’s ESLint and Stylelint standards;
2. Commit messages follow commitlint conventions (e.g., `feat:`, `fix:`, `docs:`);
3. New or modified features have been tested locally.

## Open Source License

The project has not yet explicitly declared an open-source license. Please refer to the latest repository documentation for usage terms.

---

For more details, consult the in-code documentation or visit the project repository. Happy editing!