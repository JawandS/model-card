'use client'

import { ModelCardForm } from '@/components/forms/model-card-form'
import { ThemeToggle } from '@/components/theme-toggle'
import { InstructionsModal } from '@/components/instructions-modal'

export default function Home() {
  return (
    <main className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto py-8 px-4 relative z-10">
        {/* Header */}
        <div className="flex justify-start items-center gap-3 mb-8 pl-8">
          <InstructionsModal />
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <ModelCardForm />
      </div>
    </main>
  )
}
