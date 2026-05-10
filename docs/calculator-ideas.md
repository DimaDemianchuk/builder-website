# Calculator Ideas

Dropdown starts with five material calculation directions:

- Розрахунок штукатурних матеріалів
- Розрахунок бетонних матеріалів
- Розрахунок малярних матеріалів
- Розрахунок електричних матеріалів
- Розрахунок плитки

Current implementation:

- Dropdown links open one reusable popup.
- Calculator content is stored in `assets/js/calculator-definitions.js`.
- `assets/js/main.js` reads definitions and renders popup content.

Future direction:

- Move calculator definitions to JSON or WordPress CMS.
- Add input schemas for fields.
- Add formula schemas or named calculation functions.
- Add consumption coefficients per material type.
- Keep popup UI reusable for all calculator categories.
