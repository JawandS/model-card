'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ModelCardSchema, type ModelCard, type PartialModelCard } from '@modelcard/schema'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
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
import { ProgressTracker } from '../progress-tracker'
import { SaveIndicator } from '../save-indicator'
import { SectionProgressIndicator } from '../section-progress-indicator'
import { ResetConfirmationModal } from '../reset-confirmation-modal'
import { SECTION_CONFIGS } from '@/lib/section-config'
import { Eye, RotateCcw } from 'lucide-react'

interface ModelCardFormProps {
  showPreview?: boolean
}

export function ModelCardForm({ showPreview = true }: ModelCardFormProps) {
  const [formData, setFormData] = React.useState<PartialModelCard>({})
  const [isSaving, setIsSaving] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState<Date | undefined>()
  const [isResetModalOpen, setIsResetModalOpen] = React.useState(false)
  const [previewKey, setPreviewKey] = React.useState(0)

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

  // Save to localStorage with debounce
  React.useEffect(() => {
    const saveTimeoutRef = { current: null as NodeJS.Timeout | null }

    const subscription = form.watch((value) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      // Debounce save by 1 second
      saveTimeoutRef.current = setTimeout(() => {
        setIsSaving(true)
        localStorage.setItem('modelcard-draft', JSON.stringify(value))

        // Show "Saving..." briefly then update to "Saved"
        setTimeout(() => {
          setIsSaving(false)
          setLastSaved(new Date())
        }, 500)
      }, 1000) // Wait 1 second after user stops typing
    })

    return () => {
      subscription.unsubscribe()
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
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

  // Force preview to update when it becomes visible
  React.useEffect(() => {
    if (showPreview) {
      setPreviewKey(prev => prev + 1)
    }
  }, [showPreview])

  const handleReset = () => {
    // Reset the form to default values with all nested objects explicitly cleared
    form.reset({
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
    })

    // Clear localStorage
    localStorage.removeItem('modelcard-draft')

    // Reset save state
    setLastSaved(undefined)
  }

  const onSubmit = (data: ModelCard) => {
    console.log('Form submitted:', data)
    // Validation passed, ready to export or save
  }

  return (
    <div className={`grid gap-6 h-full animate-in fade-in slide-in-from-bottom duration-700 ${
      showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
    }`}>
      {/* Form Section */}
      <div className="flex flex-col min-h-0">
        <Card className="overflow-hidden flex flex-col h-full shadow-sm">
          <CardHeader className="bg-primary/5 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div>
                <CardTitle className="text-2xl text-primary">Model Card Information</CardTitle>
                <CardDescription className="text-base mt-2">
                  Document your ML model following the HuggingFace Model Card standard
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsResetModalOpen(true)}
                className="rounded-lg hover:bg-destructive/10 hover:text-destructive"
                title="Reset all fields"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <ProgressTracker formData={formData} showOptionalFields={true} />
              <SaveIndicator isSaving={isSaving} lastSaved={lastSaved} />
            </div>
          </CardHeader>
          <CardContent className="p-6 overflow-y-auto flex-1 min-h-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="basic-info">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>
                          Basic Information <span className="text-destructive">*</span>
                        </span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[0]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <BasicInfoSection form={form} showOptionalFields={true} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="model-details">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>
                          Model Details <span className="text-destructive">*</span>
                        </span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[1]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ModelDetailsSection form={form} showOptionalFields={true} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="model-sources">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>Model Sources</span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[2]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ModelSourcesSection form={form} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="uses">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>Uses</span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[3]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <UsageAndLimitationsSection form={form} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="bias-risks">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>Bias, Risks, and Limitations</span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[4]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <EthicsAndSafetySection form={form} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="training">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>Training Details</span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[5]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <TrainingDataSection form={form} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="evaluation">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>Evaluation</span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[6]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <EvaluationSection form={form} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="environmental">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>Environmental Impact</span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[7]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <EnvironmentalImpactSection form={form} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="technical">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>Technical Specifications</span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[8]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <TechnicalSpecsSection form={form} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="citation">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>Citation</span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[9]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <CitationSection form={form} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="additional">
                    <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-2">
                        <span>Additional Information</span>
                        <SectionProgressIndicator
                          formData={formData}
                          section={SECTION_CONFIGS[10]}
                        />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <AdditionalInfoSection form={form} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Preview Section */}
      {showPreview && (
        <div className="flex flex-col min-h-0" key="preview-panel">
          <Card className="overflow-hidden flex flex-col h-full shadow-sm">
            <CardHeader className="bg-accent/5 border-b border-border flex-shrink-0">
              <CardTitle className="text-xl flex items-center gap-2 text-accent">
                <Eye className="h-5 w-5" />
                Live Preview
              </CardTitle>
              <CardDescription>
                Real-time preview of your documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto flex-1 min-h-0">
              <ModelCardPreview data={formData} key={previewKey} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ResetConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
      />
    </div>
  )
}
