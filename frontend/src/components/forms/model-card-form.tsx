'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ModelCardSchema, type ModelCard, type PartialModelCard } from '@modelcard/schema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { BasicInfoSection } from './sections/basic-info-section'
import { IntendedUseSection } from './sections/intended-use-section'
import { DataSection } from './sections/data-section'
import { EvaluationSection } from './sections/evaluation-section'
import { RiskManagementSection } from './sections/risk-management-section'
import { ProvenanceSection } from './sections/provenance-section'
import { ModelCardPreview } from '../model-card-preview'
import { Eye, EyeOff } from 'lucide-react'

export function ModelCardForm() {
  const [showPreview, setShowPreview] = React.useState(true)
  const [formData, setFormData] = React.useState<PartialModelCard>({})

  const form = useForm<ModelCard>({
    resolver: zodResolver(ModelCardSchema),
    defaultValues: {
      name: '',
      model_version: '',
      owner: {
        organization: '',
        contact: '',
      },
      intended_use: {
        summary: '',
        clinical_context: undefined,
        care_setting: undefined,
        contraindications: '',
      },
      data: {
        source: undefined,
        time_window: '',
        geography: '',
        codesets: [],
        representativeness: {
          population_frame: '',
          payer_mix: '',
          age_distribution: '',
          sex_distribution: '',
          race_ethnicity_notes: '',
          missingness: '',
        },
      },
      evaluation: {
        overall_metrics: '',
        subgroup_analysis: '',
        external_validation: '',
        limitations: '',
      },
      risk_management: {
        failure_modes: '',
        human_oversight: '',
        monitoring_plan: '',
      },
      provenance: {
        created_at: '',
        created_by: '',
        dataset_id: '',
        artifact_hash: '',
      },
    },
    mode: 'onChange',
  })

  // Watch form values for preview
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData(value as PartialModelCard)
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Save to localStorage
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('modelcard-draft', JSON.stringify(value))
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Load from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('modelcard-draft')
    if (saved) {
      try {
        const parsedData = JSON.parse(saved)
        form.reset(parsedData)
      } catch (error) {
        console.error('Failed to load saved data:', error)
      }
    }
  }, [form])

  const onSubmit = (data: ModelCard) => {
    console.log('Form submitted:', data)
    // Validation passed, ready to export or save
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full animate-in fade-in slide-in-from-bottom duration-700">
      {/* Form Section */}
      <div className="flex flex-col min-h-0">
        <Card className="overflow-hidden flex flex-col h-full">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-border/50 flex-shrink-0">
            <CardTitle className="text-2xl">Model Card Information</CardTitle>
            <CardDescription className="text-base">
              Fill out the required fields to document your healthcare ML model
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 overflow-y-auto flex-1 min-h-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <BasicInfoSection form={form} />
                <IntendedUseSection form={form} />
                <DataSection form={form} />
                <EvaluationSection form={form} />
                <RiskManagementSection form={form} />
                <ProvenanceSection form={form} />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className="flex flex-col min-h-0">
        <Card className="overflow-hidden flex flex-col h-full">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-border/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(!showPreview)}
                className="rounded-lg"
              >
                {showPreview ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            </div>
            <CardDescription>
              Real-time preview of your documentation
            </CardDescription>
          </CardHeader>
          {showPreview && (
            <CardContent className="p-6 overflow-y-auto flex-1 min-h-0">
              <ModelCardPreview data={formData} />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
