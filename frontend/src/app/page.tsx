'use client'

import { ModelCardForm } from '@/components/forms/model-card-form'
import { ThemeToggle } from '@/components/theme-toggle'
import { Stethoscope } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen gradient-bg relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-60 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto py-12 px-4 relative z-10">
        {/* Header */}
        <div className="glass rounded-2xl p-8 mb-8 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Healthcare Model Card Generator
                </h1>
                <p className="text-muted-foreground text-lg">
                  Create comprehensive, compliant documentation for your ML models
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Main Content */}
        <ModelCardForm />
      </div>
    </main>
  )
}
