# Model Card Generator

A modern, elegant monorepo for generating comprehensive model cards for machine learning models. Built with Next.js, TypeScript, Zod validation, and shadcn/ui components. Follows the **HuggingFace Model Card Standard**.

## Features

- **Elegant Next.js Frontend**: Modern, responsive UI with dark mode support
- **Comprehensive Form**: 11-section accordion form covering all aspects of ML model documentation
- **Progress Tracking**: Visual indicators for overall and per-section completion
- **Real-time Validation**: Zod schema validation with instant feedback
- **Live Preview**: See your model card as you fill out the form (with toggle)
- **Multiple Export Formats**: Export to JSON, PDF, Markdown, and HTML
- **Auto-save**: Form data persists to localStorage with debounced saving and status indicator
- **Reset Functionality**: Clear all fields with confirmation modal
- **AI-Assisted Field Completion** (Optional): OpenAI-powered suggestions for model card fields
- **Professional UI**: Custom scrollbars, glass morphism effects, smooth animations

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
│           ├── types.ts
│           ├── modelcard_template.md
│           └── annotated_modecard.md
└── frontend/                      # Next.js application
    ├── package.json
    ├── next.config.js
    ├── tailwind.config.ts
    └── src/
        ├── app/                   # Next.js app router
        ├── components/            # React components
        │   ├── ui/               # shadcn/ui components
        │   └── forms/            # Model card form components
        ├── hooks/                # Custom React hooks
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

When configured, an "AI Assist" button will appear on text fields throughout the form. If no API key is configured, the application works perfectly fine without this feature.

**Note:** AI assist uses the GPT-4o-mini model, which incurs costs based on usage. See [OpenAI's pricing](https://openai.com/api/pricing/) for details.

## Usage

1. **Navigate the form**: Use the accordion sections to navigate between different parts of the model card
2. **Track progress**: View completion percentages for each section and overall progress in the header
3. **Fill out required fields**: Complete all required fields (marked with *) - Basic Information and Model Details
4. **Add optional information**: Expand and fill optional sections like Environmental Impact, Technical Specifications, and Citation
5. **Watch auto-save**: The save indicator shows when your work is being saved to local storage
6. **Preview your model card**: Toggle the preview panel on/off to see the rendered model card
7. **Reset if needed**: Use the reset button to clear all fields (with confirmation)
8. **Export**: Once complete, export your model card in your preferred format:
   - **JSON**: Machine-readable format for API integration
   - **PDF**: Professional document for sharing
   - **Markdown**: Version-controlled documentation
   - **HTML**: Web-friendly format

## Model Card Schema

The model card follows the [HuggingFace Model Card standard](https://huggingface.co/docs/hub/model-cards) and includes:

### Required Sections
- **Basic Information**: Model name
- **Model Details**: Model ID, description, developers, model type, languages, license, and more

### Optional Sections
- **Model Sources**: Repository, paper, and demo URLs
- **Uses**: Direct use cases, downstream applications, and out-of-scope uses
- **Bias, Risks, and Limitations**: Analysis of potential biases and recommendations
- **Training Details**: Training data, preprocessing, and training regime
- **Evaluation**: Testing data, factors, metrics, and results
- **Environmental Impact**: Hardware type, compute hours, cloud provider, and CO2 emissions
- **Technical Specifications**: Model architecture, compute infrastructure, hardware/software requirements
- **Citation**: BibTeX and APA citations
- **Additional Information**: Getting started code, model examination, glossary, and authors

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Validation**: Zod
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Forms**: react-hook-form
- **Dark Mode**: next-themes
- **PDF Export**: jsPDF
- **AI Assistance**: OpenAI SDK (gpt-4o-mini)

## Future Enhancements

- **Backend API**: FastAPI backend with uv for model card storage and retrieval
- **User Authentication**: Multi-user support with access control
- **Version History**: Track changes to model cards over time
- **Collaboration**: Real-time collaboration features
- **Templates**: Pre-filled templates for common model types
- **Validation Reports**: Automated validation against regulatory requirements
- **Import from HuggingFace**: Directly import existing model cards from HuggingFace Hub

## Additional Resources

- **HuggingFace Model Cards**: https://huggingface.co/docs/hub/model-cards
- **Project Documentation**: See `.claude/CLAUDE.md` for technical details
