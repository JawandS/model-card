'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ModelCardSchema, type ModelCard, type PartialModelCard } from '@modelcard/schema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { BasicInfoSection } from './sections/basic-info-section'
import { ModelDetailsSection } from './sections/model-details-section'
import { ModelSourcesSection } from './sections/model-sources-section'
import { TrainingDataSection } from './sections/training-data-section'
import { EvaluationSection } from './sections/evaluation-section'
import { EthicsAndSafetySection } from './sections/ethics-and-safety-section'
import { UsageAndLimitationsSection } from './sections/usage-and-limitations-section'
import { EnvironmentalImpactSection } from './sections/environmental-impact-section'
import { TechnicalSpecsSection } from './sections/technical-specs-section'
import { CitationSection } from './sections/citation-section'
import { AdditionalInfoSection } from './sections/additional-info-section'
import { ModelCardPreview } from '../model-card-preview'
import { Eye, EyeOff, Filter, FilterX } from 'lucide-react'

export function ModelCardForm() {
  const [showPreview, setShowPreview] = React.useState(true)
  const [showOptionalFields, setShowOptionalFields] = React.useState(true)
  const [formData, setFormData] = React.useState<PartialModelCard>({})

  const form = useForm<ModelCard>({
    resolver: zodResolver(ModelCardSchema),
    defaultValues: {
      card_data: undefined,
      model_id: '',
      model_summary: '',
      model_description: '',
      developers: '',
      funded_by: '',
      shared_by: '',
      model_type: '',
      language: '',
      license: '',
      base_model: '',
      model_sources: {
        repo: '',
        paper: '',
        demo: '',
      },
      uses: {
        direct_use: '',
        downstream_use: '',
        out_of_scope_use: '',
      },
      bias_risks: {
        bias_risks_limitations: '',
        bias_recommendations: '',
      },
      get_started_code: '',
      training_details: {
        training_data: '',
        preprocessing: '',
        training_regime: '',
        speeds_sizes_times: '',
      },
      evaluation: {
        testing_data: '',
        testing_factors: '',
        testing_metrics: '',
        results: '',
        results_summary: '',
      },
      environmental_impact: {
        hardware_type: '',
        hours_used: '',
        cloud_provider: '',
        cloud_region: '',
        co2_emitted: '',
      },
      technical_specs: {
        model_specs: '',
        compute_infrastructure: '',
        hardware_requirements: '',
        software: '',
      },
      citation: {
        citation_bibtex: '',
        citation_apa: '',
      },
      additional_info: {
        model_examination: '',
        glossary: '',
        more_information: '',
        model_card_authors: '',
        model_card_contact: '',
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Model Card Information</CardTitle>
                <CardDescription className="text-base mt-2">
                  Document your ML model following the HuggingFace Model Card standard
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="rounded-lg"
                title={showOptionalFields ? "Hide optional fields" : "Show optional fields"}
              >
                {showOptionalFields ? (
                  <FilterX className="h-5 w-5" />
                ) : (
                  <Filter className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 overflow-y-auto flex-1 min-h-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <BasicInfoSection form={form} />
                <ModelDetailsSection form={form} showOptionalFields={showOptionalFields} />
                {showOptionalFields && (
                  <>
                    <ModelSourcesSection form={form} />
                    <UsageAndLimitationsSection form={form} />
                    <EthicsAndSafetySection form={form} />
                    <TrainingDataSection form={form} />
                    <EvaluationSection form={form} />
                    <EnvironmentalImpactSection form={form} />
                    <TechnicalSpecsSection form={form} />
                    <CitationSection form={form} />
                    <AdditionalInfoSection form={form} />
                  </>
                )}
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
