# Quick Start Guide

## Installation & Setup

### 1. Install All Dependencies

From the root directory, run:

```bash
# Install schema package dependencies
cd packages/schema
npm install
npm run build
cd ../..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

Or use the convenience script:

```bash
npm run install:all
```

### 2. Start Development Server

```bash
npm run dev
```

This will start the Next.js development server at [http://localhost:3000](http://localhost:3000)

## First Steps

1. Open your browser to `http://localhost:3000`
2. Fill out the model card form:
   - Start with basic information (model name, version, owner)
   - Describe the intended use and clinical context
   - Document your data sources
   - Add evaluation metrics
   - Optionally add risk management and provenance info
3. Watch the live preview update as you type
4. Export your model card in any format (JSON, PDF, Markdown, HTML)

## Dark Mode

Click the sun/moon icon in the top right to toggle between light and dark themes.

## Auto-save

Your form data is automatically saved to localStorage, so you won't lose your work if you close the browser.

## Production Build

To build for production:

```bash
npm run build
```

This will:
1. Build the schema package
2. Build the Next.js frontend

To run the production build:

```bash
cd frontend
npm start
```

## Troubleshooting

**Issue**: Dependencies not resolving

**Solution**: Make sure you've built the schema package first:
```bash
cd packages/schema
npm run build
```

**Issue**: Types not found

**Solution**: Restart your TypeScript server in your IDE

**Issue**: CSS not loading

**Solution**: Clear `.next` cache:
```bash
cd frontend
rm -rf .next
npm run dev
```

## Next Steps

- Customize the Tailwind theme in `frontend/tailwind.config.ts`
- Add custom validation rules in `packages/schema/src/modelcard.schema.ts`
- Extend the form with additional fields
- Set up a backend with FastAPI (future enhancement)
