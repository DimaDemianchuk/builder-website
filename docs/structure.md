# Project Structure

This project starts as a static HTML/CSS/JavaScript frontend. The structure is intentionally close to a future WordPress theme, so pages, sections, assets, and tool logic can be moved into templates later.

```text
assets/
  css/          Compiled or plain CSS used by the site
  js/           Shared JavaScript entry files
  images/       Site images and article/tool visuals
  icons/        SVG icons and UI icon assets
  fonts/        Local font files, if needed
src/
  pages/        Extra static pages during frontend development
  partials/     Reusable HTML sections before WordPress templating
  tools/        Tool-specific logic and markup drafts
  data/         JSON or content mock data
docs/           Notes, decisions, and project documentation
index.html      Main page
```

Suggested first tools:

- Paint calculator
- Tile calculator
- Renovation budget estimator
- Room measurement checklist
