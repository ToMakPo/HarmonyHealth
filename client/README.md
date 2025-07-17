
# Harmony Health & Beauty Clinic Website

This is a React + TypeScript website for a health and beauty clinic, styled with SASS and supporting light/dark themes. The design is inspired by honeyglowhealth.com and ageless-in-seattle.com.

## Features
- Modern, elegant homepage mockup
- Theming: Light (off-white/gold) & Dark (charcoal/gold)
- SASS-based modular styling
- Sections: Hero, Services, Testimonials, Contact, Footer

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:5173` in your browser.

## Customization
- Update SASS variables in `src/styles/theme.sass` for colors/fonts.
- Add real content and images as needed.

## Folder Structure
- `src/components`: For reusable components
- `src/pages`: For page-level components
- `src/styles`: SASS stylesheets

## License
MIT

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
