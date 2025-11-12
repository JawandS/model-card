# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern, elegant monorepo for generating comprehensive model cards for ML models. Built with Next.js, TypeScript, Zod validation, and shadcn/ui components. Follows the **HuggingFace Model Card Standard**.

**Key Features:**
- Multi-section accordion form with real-time validation
- Progress tracking (overall and per-section)
- Live preview panel with toggle
- AI-assisted field completion (OpenAI integration)
- Multiple export formats (JSON, PDF, Markdown, HTML)
- Debounced auto-save to localStorage with status indicator
- Reset functionality with confirmation
- Dark mode support
- Professional UI with custom scrollbars and glass effects

## Repository Structure

```
model-card/
├── packages/schema/          # Shared Zod schemas & TypeScript types
│   ├── src/
│   │   ├── index.ts         # Package exports
│   │   ├── modelcard.schema.ts  # Zod schema (141 lines)
│   │   ├── types.ts         # TypeScript type exports
│   │   ├── modelcard_template.md
│   │   └── annotated_modecard.md
│   ├── package.json         # Scripts: build, dev, type-check
│   └── tsconfig.json
│
├── frontend/                 # Next.js 14 application
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   │   ├── api/
│   │   │   │   ├── llm-assist/route.ts  # OpenAI API endpoint
│   │   │   │   └── config/route.ts
│   │   │   ├── layout.tsx   # Root layout with providers
│   │   │   ├── page.tsx     # Main page (form + preview)
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── forms/
│   │   │   │   ├── model-card-form.tsx  # Main form (488 lines)
│   │   │   │   └── sections/   # Form section components (11 files)
│   │   │   │       ├── basic-info-section.tsx
│   │   │   │       ├── model-details-section.tsx
│   │   │   │       ├── model-sources-section.tsx
│   │   │   │       ├── usage-and-limitations-section.tsx
│   │   │   │       ├── ethics-and-safety-section.tsx
│   │   │   │       ├── training-data-section.tsx
│   │   │   │       ├── evaluation-section.tsx
│   │   │   │       ├── environmental-impact-section.tsx
│   │   │   │       ├── technical-specs-section.tsx
│   │   │   │       ├── citation-section.tsx
│   │   │   │       └── additional-info-section.tsx
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   │   ├── button.tsx, card.tsx, form.tsx
│   │   │   │   ├── input.tsx, textarea.tsx, label.tsx
│   │   │   │   ├── select.tsx, accordion.tsx
│   │   │   │   └── textarea-with-assist.tsx  # AI-enhanced
│   │   │   ├── model-card-preview.tsx        # Live preview
│   │   │   ├── export-modal.tsx              # Export selector
│   │   │   ├── instructions-modal.tsx        # Help modal
│   │   │   ├── alert-modal.tsx               # Alert system
│   │   │   ├── reset-confirmation-modal.tsx  # Reset confirm
│   │   │   ├── progress-tracker.tsx          # Overall progress
│   │   │   ├── section-progress-indicator.tsx # Section progress
│   │   │   ├── save-indicator.tsx            # Save status
│   │   │   ├── llm-assist-button.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── hooks/
│   │   │   ├── use-toast.tsx
│   │   │   └── use-alert-modal.tsx  # Alert modal hook
│   │   └── lib/
│   │       ├── exporters/index.ts   # Export functions
│   │       ├── section-config.ts    # Section/progress config
│   │       └── utils.ts
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── .env.local.example
│   └── components.json
│
├── package.json             # Root scripts
├── run.sh                   # Dev server script
└── README.md
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript 5.3
- **Validation:** Zod 3.23
- **Forms:** react-hook-form 7.50 + @hookform/resolvers
- **UI Components:** shadcn/ui + Radix UI primitives
- **Styling:** Tailwind CSS 3.4 + tailwindcss-animate
- **Icons:** lucide-react 0.316
- **Theme:** next-themes 0.2
- **PDF Export:** jsPDF 2.5
- **AI Assistance:** OpenAI SDK 6.8 (gpt-4o-mini)

### Schema Package
- **Validation:** Zod 3.23
- **Build Tool:** tsup 8.0
- **TypeScript:** 5.3

## Development Workflows

### Setup & Installation

```bash
# Initial setup
npm run setup  # Installs all deps + builds schema

# Or manual
cd packages/schema && npm install && npm run build
cd ../../frontend && npm install
```

### Development

```bash
# Start dev server (recommended)
./run.sh  # Checks deps, kills port 3000, starts dev

# Or using npm
npm run dev  # Builds schema + starts Next.js dev

# Development server runs at http://localhost:3000
```

### Building & Type Checking

```bash
# Production build
cd packages/schema && npm run build
cd ../../frontend && npm run build

# Type checking
cd frontend && npm run type-check && npm run lint
```

## Architecture

### 1. Schema Architecture (HuggingFace Standard)

**File: packages/schema/src/modelcard.schema.ts (141 lines)**

Based on the HuggingFace Model Card standard (https://huggingface.co/docs/hub/model-cards).

**Schema Hierarchy:**
```
ModelCardSchema
├── name: string (required)
├── model_details: ModelDetailsSchema (required)
│   ├── model_id: string (required)
│   ├── description?: string
│   ├── developers?: string[]
│   ├── shared_by?: string
│   ├── model_type?: string
│   ├── model_languages?: string[]
│   ├── license?: string
│   ├── finetuned_from?: string
│   ├── model_function?: string
│   └── feedback?: string
├── model_sources?: ModelSourcesSchema
│   ├── repository?: string (URL)
│   ├── paper?: string (URL)
│   ├── demo?: string (URL)
├── uses?: UsesSchema
│   ├── direct_use?: string
│   ├── downstream_use?: string
│   ├── out_of_scope_use?: string
├── bias_risks_limitations?: BiasRisksLimitationsSchema
├── training_details?: TrainingDetailsSchema
├── evaluation?: EvaluationSchema
├── environmental_impact?: EnvironmentalImpactSchema
├── technical_specifications?: TechnicalSpecificationsSchema
├── citation?: CitationSchema
├── additional_information?: AdditionalInformationSchema
```

**Exports (packages/schema/src/index.ts):**
- All Zod schemas for validation
- TypeScript types (inferred from schemas)
- Helper functions: `validateModelCard()`, `parseModelCard()`
- `PartialModelCard` type for progressive form filling

### 2. Form Architecture & Data Flow

**Main Form Component: frontend/src/components/forms/model-card-form.tsx (488 lines)**

**Data Flow:**
```
User Input
    ↓
react-hook-form (useForm with zodResolver)
    ↓
Real-time validation (ModelCardSchema)
    ↓
Debounced save (1 second)
    ↓
├── localStorage.setItem('modelcard-draft')
├── SaveIndicator update ("Saving..." → "Saved Xs ago")
└── Progress calculation
    ↓
    ├── calculateSectionCompletion() for each section
    └── calculateOverallCompletion() for overall progress
```

**Form Features:**
- **11 accordion sections** (collapsible, multiple open)
- **Progress tracking** (overall + per-section indicators)
- **Save indicator** (real-time status with time-ago)
- **Reset button** (with confirmation modal)
- **Preview toggle** (show/hide right panel)
- **Auto-save** (debounced 1s)
- **Auto-load** (from localStorage on mount)
- **AI assistance** (on select textarea fields)

**Form Sections:**
1. Basic Information* (required)
2. Model Details* (required)
3. Model Sources
4. Uses
5. Bias, Risks, and Limitations
6. Training Details
7. Evaluation
8. Environmental Impact
9. Technical Specifications
10. Citation
11. Additional Information

Each section component receives `form` prop and renders `FormField` components with validation.

### 3. Progress Tracking System

**Components:**
- **`progress-tracker.tsx`**: Overall completion percentage, circular indicator, progress bar
- **`section-progress-indicator.tsx`**: Per-section field completion with CheckCircle when complete
- **`section-config.ts`**: Centralized section configuration and completion calculation logic

**Functions:**
- `calculateSectionCompletion(formData, section)`: Returns { filledFields, totalFields, percentage }
- `calculateOverallCompletion(formData, showOptionalFields)`: Returns overall completion percentage
- `getNestedValue(obj, path)`: Get nested object values via dot notation
- `isFieldFilled(value)`: Check if field has meaningful content

### 4. Alert Modal System

**Components:**
- **`alert-modal.tsx`**: Modal with variants (error, warning, info, success), custom actions
- **`use-alert-modal.tsx`**: Context provider and hook for global alert state

**Usage:**
```typescript
const { showAlert } = useAlertModal()

showAlert({
  variant: 'error',
  title: 'Validation Error',
  message: 'Please fix the following errors...',
  actions: [{ label: 'OK', variant: 'default' }]
})
```

**Integration:** Added to `layout.tsx` as `<AlertModalProvider>`

### 5. AI Assistance Feature

**Architecture:**
```
TextareaWithAssist Component
    ↓ (user clicks "AI Assist")
LLMAssistButton
    ↓ (POST /api/llm-assist)
Next.js API Route (Edge Runtime)
    ↓
OpenAI API (gpt-4o-mini)
    ↓ (suggestion returned)
field.onChange (react-hook-form)
```

**API Route: frontend/src/app/api/llm-assist/route.ts**
- **Runtime:** Edge (for faster responses)
- **Model:** gpt-4o-mini (temperature 0.7, max 500 tokens)
- **Input:** `{ fieldName, fieldDescription, contextData }`
- **Output:** `{ suggestion }` or `{ error }`

**Configuration:** Requires `OPENAI_API_KEY` in `frontend/.env.local`

### 6. Export Architecture

**Component: frontend/src/components/export-modal.tsx**

**Export Flow:**
```
User clicks export button
    ↓
Load from localStorage
    ↓
cleanEmptyStrings() (convert empty strings to undefined)
    ↓
Validate with ModelCardSchema.safeParse()
    ↓ (if valid)
Call exporter function (JSON/PDF/MD/HTML)
    ↓
Download file
```

**Exporters: frontend/src/lib/exporters/index.ts**
- **JSON**: Machine-readable, full schema
- **Markdown**: Documentation, version control
- **HTML**: Web-friendly with embedded styles
- **PDF**: Professional document (uses jsPDF)

**Validation:** Shows detailed error messages in alert modal if validation fails.

### 7. UI Components & Styling

**Key UI Components:**
- **Accordion** (`ui/accordion.tsx`): Collapsible sections with animated expand/collapse
- **Alert Modal** (`alert-modal.tsx`): Professional modal system with backdrop blur
- **Save Indicator** (`save-indicator.tsx`): Real-time save status with pulse animation
- **Progress Indicators**: Circular progress with percentages and field counts

**Styling Features:**
- **Custom scrollbars**: Webkit and Firefox support, matches theme colors
- **Glass morphism**: `.glass` class for frosted glass effects
- **Professional color palette**: Society of Actuaries theme (navy blue + teal)
- **Dark mode**: High contrast with `next-themes`
- **Animations**: Fade-in, slide-in, smooth transitions

**Global Styles: frontend/src/app/globals.css**
- CSS variables for light/dark mode
- Custom utility classes (`.glass`, `.gradient-bg`, `.accent-gradient`)
- Custom scrollbar styling (lines 104-136)

## Common Development Tasks

### Adding a New Form Field

1. **Update Schema** (`packages/schema/src/modelcard.schema.ts`)
2. **Rebuild Schema** (`cd packages/schema && npm run build`)
3. **Add Form Field** (in appropriate section component)
4. **Update section-config.ts** (add field to section's `fields` array)
5. **Update Preview** (optional, in `model-card-preview.tsx`)
6. **Update Exporters** (optional, in `lib/exporters/index.ts`)

### Customizing AI Assistance

**Edit:** `frontend/src/app/api/llm-assist/route.ts`
- Modify system prompt
- Change model (e.g., `gpt-4`)
- Adjust temperature or max_tokens

### Styling Changes

**Global Styles:** `frontend/src/app/globals.css`
**Tailwind Config:** `frontend/tailwind.config.ts`
**Component Styles:** Inline Tailwind classes in components

## Environment Variables

**File:** `frontend/.env.local` (create from `.env.local.example`)

```bash
OPENAI_API_KEY=sk-...  # Required for AI assistance feature
```

**Note:** If not set, AI assist will show error prompting user to configure.

## Build Output

**Schema Package:**
```
packages/schema/dist/
├── index.js           # CommonJS
├── index.mjs          # ESM
├── index.d.ts         # TypeScript definitions
└── index.d.mts
```

**Frontend:**
```
frontend/.next/
├── standalone/        # Self-contained production build
├── static/           # Static assets
└── types/            # Generated TypeScript types
```

## Key Technical Decisions

### 1. Monorepo with Local Package
- **Why:** Share schema between frontend and potential future backend
- **Trade-off:** Must build schema before frontend

### 2. Zod for Validation
- **Why:** Type-safe runtime validation, single source of truth
- **Trade-off:** Schema changes require package rebuild

### 3. react-hook-form + zodResolver
- **Why:** Performant forms with minimal re-renders
- **Trade-off:** Learning curve for nested field names

### 4. localStorage with Debounced Auto-save
- **Why:** Prevent data loss, no backend needed
- **How:** 1-second debounce prevents excessive writes
- **Trade-off:** Limited to single browser

### 5. Accordion UI for Sections
- **Why:** Reduce scrolling, improve navigation for long forms
- **Trade-off:** Adds complexity to form layout

### 6. Progress Tracking System
- **Why:** User feedback, motivates completion
- **How:** Centralized section-config.ts for maintainability
- **Trade-off:** Additional calculation overhead

### 7. Modal System vs Toasts
- **Why:** Better visibility for important messages
- **How:** Context-based AlertModalProvider
- **Trade-off:** More intrusive than toasts

## Troubleshooting

**Issue:** `Cannot find module '@modelcard/schema'`
**Solution:** Build schema package
```bash
cd packages/schema && npm install && npm run build
```

**Issue:** Types not updating in frontend
**Solution:** Rebuild schema and restart TS server
```bash
cd packages/schema && npm run build
```

**Issue:** Port 3000 already in use
**Solution:** `./run.sh` handles this, or:
```bash
lsof -ti:3000 | xargs kill -9
```

**Issue:** AI assistance not working
**Solution:** Check `OPENAI_API_KEY` in `frontend/.env.local`

**Issue:** CSS not loading
**Solution:** Clear Next.js cache
```bash
cd frontend && rm -rf .next && npm run dev
```

## Commands Quick Reference

```bash
# Development
npm run dev                    # Root: build schema + start frontend
./run.sh                       # Convenience script with checks

# Schema Package
cd packages/schema
npm run build                  # Build to dist/
npm run dev                    # Watch mode
npm run type-check            # Type check only

# Frontend
cd frontend
npm run dev                    # Dev server (port 3000)
npm run build                 # Production build
npm start                     # Start production server
npm run lint                  # ESLint
npm run type-check           # TypeScript check

# Root
npm run setup                 # Initial setup (all deps + build)
```

## Dependencies Overview

**Key Frontend Dependencies:**
- `@modelcard/schema` (local): Validation schemas
- `next@^14.2.33`: Framework
- `react-hook-form@^7.50.1`: Form management
- `@hookform/resolvers@^3.3.4`: Zod integration
- `zod@^3.23.8`: Schema validation
- `openai@^6.8.0`: AI assistance
- `jspdf@^2.5.2`: PDF generation
- `next-themes@^0.2.1`: Dark mode
- `@radix-ui/react-accordion@^1.1.2`: Accordion UI
- `@radix-ui/*`: Other UI primitives
- `lucide-react@^0.316.0`: Icons
- `tailwindcss@^3.4.1`: Styling

**Key Schema Dependencies:**
- `zod@^3.23.8`: Validation
- `tsup@^8.0.1`: Bundler

## Additional Resources

- **HuggingFace Model Cards:** https://huggingface.co/docs/hub/model-cards
- **Zod Documentation:** https://zod.dev/
- **shadcn/ui:** https://ui.shadcn.com/
- **Next.js App Router:** https://nextjs.org/docs/app
- **react-hook-form:** https://react-hook-form.com/

---

**Last Updated:** 2025-11-12
**Reference:** HuggingFace Model Card Standard
