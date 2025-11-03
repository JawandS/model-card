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
import { exportToJSON, exportToPDF, exportToMarkdown, exportToHTML } from '@/lib/exporters'
import { Download, FileJson, FileText, FileType, Eye, EyeOff } from 'lucide-react'

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

  const handleExport = (format: 'json' | 'pdf' | 'markdown' | 'html') => {
    const result = ModelCardSchema.safeParse(formData)

    if (!result.success) {
      alert('Please complete all required fields before exporting.')
      return
    }

    const validData = result.data

    switch (format) {
      case 'json':
        exportToJSON(validData)
        break
      case 'pdf':
        exportToPDF(validData)
        break
      case 'markdown':
        exportToMarkdown(validData)
        break
      case 'html':
        exportToHTML(validData)
        break
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Form Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Model Card Information</CardTitle>
            <CardDescription>
              Fill out the required fields to document your healthcare ML model
            </CardDescription>
          </CardHeader>
          <CardContent>
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

        {/* Export Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Export Model Card</CardTitle>
            <CardDescription>
              Download your model card in various formats
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('json')}
              className="w-full"
            >
              <FileJson className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="w-full"
            >
              <FileType className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('markdown')}
              className="w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              Markdown
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleExport('html')}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              HTML
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      <div className="sticky top-8 h-fit">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Preview</CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <CardDescription>
              Live preview of your model card
            </CardDescription>
          </CardHeader>
          {showPreview && (
            <CardContent>
              <ModelCardPreview data={formData} />
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
