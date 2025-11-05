# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern, elegant monorepo for generating comprehensive model cards for healthcare ML models. Built with Next.js, TypeScript, Zod validation, and shadcn/ui components. Follows the **Google Model Card Standard** with healthcare-specific extensions.

**Key Features:**
- Multi-section form with real-time validation
- Live preview panel showing rendered model card
- AI-assisted field completion (OpenAI integration)
- Multiple export formats (JSON, PDF, Markdown, HTML)
- Auto-save to localStorage
- Dark mode support
- Healthcare-specific fields (clinical context, care settings, representativeness)

## Repository Structure

```
model-card/
├── packages/schema/          # Shared Zod schemas & TypeScript types
│   ├── src/
│   │   ├── index.ts         # Package exports
│   │   ├── modelcard.schema.ts  # Zod schema definitions (149 lines)
│   │   └── types.ts         # TypeScript type exports
│   ├── package.json         # Scripts: build, dev, type-check
│   └── tsconfig.json
│
├── frontend/                 # Next.js 14 application
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   │   ├── api/llm-assist/route.ts  # OpenAI API endpoint
│   │   │   ├── layout.tsx   # Root layout with theme provider
│   │   │   ├── page.tsx     # Main page (form + preview layout)
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── forms/
│   │   │   │   ├── model-card-form.tsx  # Main form component (223 lines)
│   │   │   │   └── sections/   # Form section components (9 files)
│   │   │   │       ├── basic-info-section.tsx
│   │   │   │       ├── model-details-section.tsx
│   │   │   │       ├── training-data-section.tsx
│   │   │   │       ├── implementation-section.tsx
│   │   │   │       ├── evaluation-section.tsx
│   │   │   │       ├── ethics-and-safety-section.tsx
│   │   │   │       ├── usage-and-limitations-section.tsx
│   │   │   │       ├── healthcare-extension-section.tsx
│   │   │   │       └── provenance-section.tsx
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── textarea-with-assist.tsx  # AI-enhanced textarea
│   │   │   │   ├── label.tsx
│   │   │   │   └── select.tsx
│   │   │   ├── model-card-preview.tsx  # Live preview component
│   │   │   ├── export-modal.tsx        # Export format selector
│   │   │   ├── instructions-modal.tsx
│   │   │   ├── llm-assist-button.tsx   # AI assistance button
│   │   │   ├── theme-provider.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── hooks/
│   │   │   └── use-toast.tsx
│   │   └── lib/
│   │       ├── exporters/
│   │       │   └── index.ts  # Export functions (JSON, PDF, MD, HTML)
│   │       └── utils.ts
│   ├── package.json         # Scripts: dev, build, start, lint, type-check
│   ├── next.config.js       # Transpiles @modelcard/schema
│   ├── tailwind.config.ts   # Tailwind + shadcn/ui theme
│   ├── tsconfig.json
│   ├── .env.local.example   # OPENAI_API_KEY template
│   └── components.json      # shadcn/ui config
│
├── package.json             # Root scripts: setup, start, dev
├── run.sh                   # Convenience script (builds schema, starts dev)
├── README.md                # User-facing documentation
└── QUICKSTART.md            # Quick start guide
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14.2 (App Router)
- **Language:** TypeScript 5.3
- **Validation:** Zod 3.23 (shared schema package)
- **Forms:** react-hook-form 7.50 + @hookform/resolvers
- **UI Components:** shadcn/ui + Radix UI primitives
- **Styling:** Tailwind CSS 3.4 + tailwindcss-animate
- **Icons:** lucide-react 0.316
- **Theme:** next-themes 0.2 (dark mode)
- **PDF Export:** jsPDF 2.5
- **AI Assistance:** OpenAI SDK 6.8 (gpt-4o-mini)

### Schema Package
- **Validation:** Zod 3.23
- **Build Tool:** tsup 8.0 (bundles CJS, ESM, DTS)
- **TypeScript:** 5.3

## Development Workflows

### Setup & Installation

**Initial Setup:**
```bash
# Option 1: Using root package.json
npm run setup  # Installs all deps + builds schema

# Option 2: Manual
cd packages/schema && npm install && npm run build && cd ../..
cd frontend && npm install && cd ..
```

### Development

**Start dev server:**
```bash
# Option 1: Using convenience script (recommended)
./run.sh  # Checks deps, kills port 3000, starts dev server

# Option 2: Using root package.json
npm run dev  # Builds schema + starts Next.js dev

# Option 3: Manual
cd packages/schema && npm run build && cd ../../frontend && npm run dev
```

**Development server:** http://localhost:3000

**Watch mode for schema:**
```bash
cd packages/schema
npm run dev  # Watches for changes and rebuilds
```

### Building

**Production build:**
```bash
# Frontend only (requires schema already built)
cd frontend
npm run build  # Creates .next/standalone output

# Full production build
cd packages/schema && npm run build && cd ../../frontend && npm run build
```

**Start production server:**
```bash
cd frontend
npm start  # Starts production server on port 3000
```

### Type Checking

```bash
# Schema package
cd packages/schema
npm run type-check

# Frontend
cd frontend
npm run type-check
npm run lint
```

## Architecture Deep Dive

### 1. Monorepo Structure & Dependencies

**Dependency Flow:**
```
packages/schema (independent)
    ↓
frontend (depends on @modelcard/schema via file:../packages/schema)
```

**Key Configuration:**
- `frontend/next.config.js`: Transpiles `@modelcard/schema` using `transpilePackages`
- Schema built to `packages/schema/dist/` with CJS, ESM, and TypeScript definitions
- Frontend imports: `import { ModelCardSchema, type ModelCard } from '@modelcard/schema'`

### 2. Schema Package Architecture

**File: packages/schema/src/modelcard.schema.ts (149 lines)**

Based on Google Model Card Standard with healthcare extensions:

**Schema Hierarchy:**
```
ModelCardSchema
├── name: string (required)
├── model_details: ModelDetailsSchema (required)
│   ├── version: string (required)
│   ├── description?: string
│   ├── owners?: OwnerSchema[]
│   ├── license?: string
│   ├── citation?: string
│   ├── references?: string[]
│   ├── input_format?: string
│   └── output_format?: string
├── training_data?: TrainingDataSchema
├── implementation?: ImplementationSchema
├── evaluation?: EvaluationSchema
├── ethics_and_safety?: EthicsAndSafetySchema
│   ├── bias_analysis?: string
│   ├── fairness_assessment?: string
│   └── ...
├── usage_and_limitations?: UsageAndLimitationsSchema
├── healthcare?: HealthcareExtensionSchema
│   ├── clinical_context?: ClinicalContextEnum
│   ├── care_setting?: CareSettingEnum
│   ├── representativeness?: RepresentativenessSchema
│   └── ...
└── provenance?: ProvenanceSchema
```

**Exports (packages/schema/src/index.ts):**
- All Zod schemas (for validation)
- All TypeScript types (inferred from schemas)
- Helper functions: `validateModelCard()`, `parseModelCard()`
- `PartialModelCard` type (for progressive form filling)

**Healthcare-Specific Enums:**
```typescript
ClinicalContextEnum: 'screening' | 'triage' | 'diagnosis' | 'monitoring' | ...
CareSettingEnum: 'inpatient' | 'outpatient' | 'ed' | 'telehealth' | ...
```

### 3. Form Architecture & Data Flow

**Main Form Component: frontend/src/components/forms/model-card-form.tsx (223 lines)**

**Data Flow:**
```
User Input
    ↓
react-hook-form (useForm with zodResolver)
    ↓
Real-time validation (ModelCardSchema)
    ↓
form.watch() subscription
    ↓
├── Update preview (setFormData)
└── Save to localStorage (modelcard-draft)
```

**Form State Management:**
```typescript
const form = useForm<ModelCard>({
  resolver: zodResolver(ModelCardSchema),  // Zod validation
  defaultValues: { /* ... */ },
  mode: 'onChange'  // Real-time validation
})
```

**Key Features:**
1. **Auto-save:** `useEffect` watches form and saves to localStorage
2. **Auto-load:** On mount, loads from localStorage if available
3. **Live preview:** `useEffect` watches form and updates preview state
4. **Optional fields toggle:** Shows/hides non-required sections
5. **Preview toggle:** Shows/hides right panel

**Form Sections:**
Each section is a separate component that receives `form` prop:
- Renders `FormField` components from shadcn/ui
- Uses `form.control` for field registration
- Displays validation errors via `FormMessage`
- Some fields use `TextareaWithAssist` for AI assistance

**Example Section Pattern:**
```typescript
export function ModelDetailsSection({ form, showOptionalFields }) {
  return (
    <FormField
      control={form.control}
      name="model_details.description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <TextareaWithAssist
              fieldName="Model Description"
              contextData={form.getValues()}
              onValueChange={field.onChange}
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
```

### 4. AI Assistance Feature

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
onValueChange callback
    ↓
field.onChange (react-hook-form)
```

**API Route: frontend/src/app/api/llm-assist/route.ts**
- **Runtime:** Edge (for faster responses)
- **Model:** gpt-4o-mini (temperature 0.7, max 500 tokens)
- **Input:** `{ fieldName, fieldDescription, contextData }`
- **Output:** `{ suggestion }` or `{ error }`

**System Prompt:**
- Expert assistant for model card documentation
- Concise, professional, technical language
- Provides templates when context is limited
- Special attention to bias/fairness fields

**Configuration:**
- Requires `OPENAI_API_KEY` in `.env.local`
- Example file: `frontend/.env.local.example`

### 5. Preview Architecture

**Component: frontend/src/components/model-card-preview.tsx**

**Data Flow:**
```
form.watch() → setFormData(PartialModelCard) → ModelCardPreview component
```

**Rendering Logic:**
- Receives `data: PartialModelCard` (all fields optional)
- `hasContent(obj)` helper checks if section has any data
- Only renders sections with content
- Responsive text sizes and spacing
- Matches Google Model Card structure

**Example:**
```typescript
{hasContent(data.model_details) && (
  <div className="border-t pt-4">
    <h4 className="font-semibold">Model Details</h4>
    {data.model_details?.version && <p>Version: {data.model_details.version}</p>}
  </div>
)}
```

### 6. Export Architecture

**Component: frontend/src/components/export-modal.tsx**

**Export Flow:**
```
User clicks export button
    ↓
Load from localStorage
    ↓
Validate with ModelCardSchema.safeParse()
    ↓ (if valid)
Call exporter function (JSON/PDF/MD/HTML)
    ↓
Download file
```

**Exporters: frontend/src/lib/exporters/index.ts**

**Available Formats:**
1. **JSON:** `exportToJSON(data)` - Machine-readable, full schema
2. **Markdown:** `exportToMarkdown(data)` - Documentation, version control
3. **HTML:** `exportToHTML(data)` - Web-friendly with embedded styles
4. **PDF:** `exportToPDF(data)` - Professional document (uses jsPDF)

**Validation:**
- Exports only work if form data passes full schema validation
- Uses `ModelCardSchema.safeParse()` to check completeness
- Alerts user if required fields are missing

### 7. Routing & Page Structure

**Next.js App Router Structure:**
```
app/
├── layout.tsx           # Root layout (ThemeProvider, metadata)
├── page.tsx             # Main page (form + preview grid)
├── globals.css          # Global styles, CSS variables
└── api/llm-assist/route.ts  # AI assistance API
```

**Main Page (app/page.tsx):**
```
<main>  (gradient background)
  <header>  (InstructionsModal, ExportModal, ThemeToggle)
  <div>  (grid container)
    <ModelCardForm />  (left: form, right: preview)
  </div>
</main>
```

**Layout:**
- Uses client-side rendering (`'use client'`)
- Two-column grid on large screens (lg:grid-cols-2)
- Responsive single column on small screens
- Decorative gradient background elements
- Frosted glass effect (glass class) for modals

## Key Technical Decisions

### 1. Monorepo with Local Package
- **Why:** Share schema between frontend and potential future backend
- **How:** Local file dependency in package.json
- **Trade-off:** Must build schema before frontend (handled by scripts)

### 2. Zod for Validation
- **Why:** Type-safe runtime validation, DX benefits
- **How:** Single source of truth (schema) generates TypeScript types
- **Trade-off:** Schema changes require rebuild of package

### 3. react-hook-form + zodResolver
- **Why:** Performant forms with minimal re-renders
- **How:** Integrates Zod schema with react-hook-form
- **Trade-off:** Learning curve for nested field names

### 4. localStorage Auto-save
- **Why:** Prevent data loss, no backend needed
- **How:** Watch form values, JSON.stringify to localStorage
- **Trade-off:** Limited to single browser, not synced

### 5. Next.js App Router
- **Why:** Modern React patterns, built-in API routes
- **How:** App directory with server/client components
- **Trade-off:** Some features require 'use client' directive

### 6. Edge Runtime for AI API
- **Why:** Faster cold starts, global distribution
- **How:** Export `runtime = 'edge'` from API route
- **Trade-off:** Limited Node.js APIs available

### 7. shadcn/ui Components
- **Why:** Copy-paste components, full control, type-safe
- **How:** Components in src/components/ui, customizable
- **Trade-off:** No npm package updates (manual updates)

## Common Development Tasks

### Adding a New Form Field

1. **Update Schema:**
   ```typescript
   // packages/schema/src/modelcard.schema.ts
   export const MyNewSectionSchema = z.object({
     my_field: z.string().optional(),
   })

   export const ModelCardSchema = z.object({
     // ...
     my_section: MyNewSectionSchema.optional(),
   })
   ```

2. **Rebuild Schema:**
   ```bash
   cd packages/schema && npm run build
   ```

3. **Export Types:**
   ```typescript
   // packages/schema/src/index.ts
   export { MyNewSectionSchema } from './modelcard.schema'
   export type { MyNewSection } from './types'
   ```

4. **Add Form Section:**
   ```typescript
   // frontend/src/components/forms/sections/my-section.tsx
   export function MySection({ form }: { form: UseFormReturn<ModelCard> }) {
     return (
       <FormField
         control={form.control}
         name="my_section.my_field"
         render={({ field }) => (/* ... */)}
       />
     )
   }
   ```

5. **Add to Main Form:**
   ```typescript
   // frontend/src/components/forms/model-card-form.tsx
   import { MySection } from './sections/my-section'
   // Add to defaultValues
   // Add <MySection form={form} /> to form JSX
   ```

6. **Update Preview (optional):**
   ```typescript
   // frontend/src/components/model-card-preview.tsx
   {hasContent(data.my_section) && (
     <div>...</div>
   )}
   ```

### Updating Export Formats

**Edit:** `frontend/src/lib/exporters/index.ts`

Each exporter function receives `data: ModelCard` and triggers download.

**Example (adding new section to Markdown):**
```typescript
export function exportToMarkdown(data: ModelCard) {
  let markdown = `# ${data.name}\n\n`

  if (data.my_section?.my_field) {
    markdown += `## My Section\n\n${data.my_section.my_field}\n\n`
  }

  // ... download logic
}
```

### Customizing AI Assistance

**Edit:** `frontend/src/app/api/llm-assist/route.ts`

**Customize:**
- System prompt (lines 39-49)
- Model (`gpt-4o-mini` → `gpt-4`, etc.)
- Temperature, max_tokens
- Context building logic (lines 29-37)

### Styling Changes

**Global Styles:** `frontend/src/app/globals.css`
- CSS variables for light/dark mode
- Custom utility classes (.glass, .gradient-bg)

**Tailwind Config:** `frontend/tailwind.config.ts`
- Theme colors (HSL-based)
- Custom animations
- Border radius variables

**Component Styles:** Inline Tailwind classes
- Gradient text: `bg-gradient-to-r ... bg-clip-text text-transparent`
- Glass effect: `bg-background/95 backdrop-blur-sm`
- Animations: `animate-in fade-in slide-in-from-bottom`

## Environment Variables

**File:** `frontend/.env.local` (create from `.env.local.example`)

```bash
OPENAI_API_KEY=sk-...  # Required for AI assistance feature
```

**Note:** If not set, AI assist will return error message prompting user to configure.

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

## Testing Notes

**Currently:** No automated tests configured

**Type Safety:**
- All form fields are type-checked via Zod schema
- TypeScript catches type errors at build time
- Runtime validation via Zod during form submission

**Manual Testing:**
1. Fill out form, verify live preview updates
2. Test validation (required fields, email format, date format)
3. Test localStorage persistence (refresh page)
4. Test all export formats
5. Test AI assistance (requires API key)
6. Test dark mode toggle
7. Test optional fields toggle

## Known Limitations & Future Enhancements

**Current Limitations:**
1. No backend - data only stored in localStorage
2. No user authentication or multi-user support
3. No version history or change tracking
4. No collaboration features
5. PDF export is basic (uses jsPDF limitations)
6. No automated tests

**Planned Features (from README):**
1. FastAPI backend with uv for storage/retrieval
2. User authentication with access control
3. Version history tracking
4. Real-time collaboration
5. Pre-filled templates for common model types
6. Automated validation reports (regulatory compliance)

## Git Workflow

**Current Branch:** `claude/refine-google-model-card-011CUoeiZ7rvh8zoRdSvuxne`
**Main Branch:** `main`

**Recent Commits:**
- a286130: filter optional fields
- 866e209: update dependencies
- b88af70: Refactor to Google standard with healthcare extensions + AI
- 2f76b41: fix export
- f9c8564: mv export card

**No Special Git Rules:** Standard development workflow

## Performance Considerations

**Optimizations:**
1. **Form Performance:** react-hook-form minimizes re-renders
2. **Build Performance:** tsup for fast schema builds
3. **Bundle Size:** Next.js automatic code splitting
4. **Runtime Performance:** Zod validation is fast (<1ms)
5. **API Performance:** Edge runtime for AI assistance

**Potential Bottlenecks:**
1. Large form data in localStorage (JSON.stringify on every change)
2. PDF generation for large documents (jsPDF performance)
3. Preview re-renders (currently re-renders on every keystroke)

**Optimization Opportunities:**
1. Debounce localStorage saves
2. Memoize preview component
3. Virtual scrolling for long forms
4. Lazy load form sections
5. Streaming AI responses

## Troubleshooting

**Issue:** `Cannot find module '@modelcard/schema'`
**Solution:** Build schema package first
```bash
cd packages/schema && npm install && npm run build
```

**Issue:** Types not updating in frontend
**Solution:** Rebuild schema and restart TS server
```bash
cd packages/schema && npm run build
# Then restart TypeScript in IDE
```

**Issue:** Port 3000 already in use
**Solution:** `./run.sh` handles this automatically, or manually:
```bash
lsof -ti:3000 | xargs kill -9
```

**Issue:** AI assistance not working
**Solution:** Check OPENAI_API_KEY in `.env.local`

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
- `@radix-ui/*`: UI primitives
- `lucide-react@^0.316.0`: Icons
- `tailwindcss@^3.4.1`: Styling

**Key Schema Dependencies:**
- `zod@^3.23.8`: Validation
- `tsup@^8.0.1`: Bundler

## Additional Resources

- **Google Model Cards:** https://modelcards.withgoogle.com/
- **Zod Documentation:** https://zod.dev/
- **shadcn/ui:** https://ui.shadcn.com/
- **Next.js App Router:** https://nextjs.org/docs/app
- **react-hook-form:** https://react-hook-form.com/

---

**Last Updated:** 2025-11-04
**Codebase Version:** Git commit a286130 (filter optional fields)
