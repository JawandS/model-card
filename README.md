# Healthcare Model Card Generator

A modern, elegant monorepo for generating comprehensive model cards for healthcare ML models. Built with Next.js, TypeScript, Zod validation, and shadcn/ui components.

## Features

- **Elegant Next.js Frontend**: Modern, responsive UI with dark mode support
- **Comprehensive Form**: Multi-section form covering all aspects of healthcare model documentation
- **Real-time Validation**: Zod schema validation with instant feedback
- **Live Preview**: See your model card as you fill out the form
- **Multiple Export Formats**: Export to JSON, PDF, Markdown, and HTML
- **Auto-save**: Form data persists in localStorage
- **AI-Assisted Field Completion** (Optional): OpenAI-powered suggestions for model card fields
- **Healthcare-Specific**: Tailored schema for clinical ML models with fields for:
  - Clinical context and care settings
  - Data sources (EHR, claims, imaging, etc.)
  - Subgroup analysis and fairness metrics
  - Risk management and human oversight
  - Model provenance

## Project Structure

```
model-card/
├── schema/                        # Original JSON schema (reference)
│   └── modelcard.schema.json
├── packages/
│   └── schema/                    # Shared Zod schemas & TypeScript types
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── modelcard.schema.ts
│           └── types.ts
└── frontend/                      # Next.js application
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.ts
    └── src/
        ├── app/                   # Next.js app router
        ├── components/            # React components
        │   ├── ui/               # shadcn/ui components
        │   └── forms/            # Model card form components
        └── lib/                  # Utilities & exporters
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Quick Start

**Option 1: Using scripts (recommended)**

```bash
# Build everything
./build.sh

# Start development server
./run.sh
```

**Option 2: Manual setup**

1. **Install schema package dependencies**:
   ```bash
   cd packages/schema
   npm install
   npm run build
   cd ../..
   ```

2. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

### Development

Start the Next.js development server:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build everything
./build.sh

# Start production server
cd frontend
npm start
```

## Configuration

### AI-Assisted Field Completion (Optional)

The application includes an optional AI assist feature that uses OpenAI's API to help generate content for model card fields.

**To enable AI assist:**

1. Create a `.env.local` file in the `frontend/` directory:
   ```bash
   cd frontend
   cp .env.local.example .env.local
   ```

2. Add your OpenAI API key:
   ```bash
   OPENAI_API_KEY=sk-proj-your-key-here
   ```

3. Restart the development server

When configured, an "AI Assist" button will appear on text fields throughout the form. If no API key is configured, the application works perfectly fine without this feature - the AI assist buttons simply won't be displayed.

**Note:** AI assist uses the GPT-4o-mini model, which incurs costs based on usage. See [OpenAI's pricing](https://openai.com/api/pricing/) for details.

## Usage

1. **Fill out the form**: Complete all required fields (marked with *) in the model card form
2. **Preview your model card**: View the live preview in the right panel
3. **Export**: Once complete, export your model card in your preferred format:
   - **JSON**: Machine-readable format for API integration
   - **PDF**: Professional document for sharing
   - **Markdown**: Version-controlled documentation
   - **HTML**: Web-friendly format

## Model Card Schema

The healthcare model card includes:

### Required Fields
- **Basic Info**: Model name, version, owner organization
- **Intended Use**: Summary, clinical context, care setting
- **Data**: Source type, time window, geography
- **Evaluation**: Overall metrics, subgroup analysis, limitations

### Optional Fields
- **Risk Management**: Failure modes, human oversight, monitoring plans
- **Provenance**: Creation metadata, dataset tracking

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Validation**: Zod
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: react-hook-form
- **Dark Mode**: next-themes
- **PDF Export**: jsPDF

## Future Enhancements

- **Backend API**: FastAPI backend with uv for model card storage and retrieval
- **User Authentication**: Multi-user support with access control
- **Version History**: Track changes to model cards over time
- **Collaboration**: Real-time collaboration features
- **Templates**: Pre-filled templates for common model types
- **Validation Reports**: Automated validation against regulatory requirements
