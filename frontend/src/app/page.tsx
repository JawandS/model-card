'use client'

import { ModelCardForm } from '@/components/forms/model-card-form'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Healthcare Model Card Generator
            </h1>
            <p className="text-muted-foreground">
              Create comprehensive documentation for your ML models
            </p>
          </div>
          <ThemeToggle />
        </div>
        <ModelCardForm />
      </div>
    </main>
  )
}
