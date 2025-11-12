'use client'

import { ModelCardForm } from '@/components/forms/model-card-form'
import { ThemeToggle } from '@/components/theme-toggle'
import { InstructionsModal } from '@/components/instructions-modal'
import { ExportModal } from '@/components/export-modal'

export default function Home() {
  return (
    <main className="h-screen gradient-bg relative overflow-hidden flex flex-col">
      {/* Subtle professional background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="flex justify-between items-center gap-4 py-6 px-8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold accent-gradient">
              Model Card Generator
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <InstructionsModal />
            <ExportModal />
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden pb-6">
          <ModelCardForm />
        </div>
      </div>
    </main>
  )
}
