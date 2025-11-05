import { UseFormReturn } from 'react-hook-form'
import { ModelCard } from '@modelcard/schema'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TextareaWithAssist } from '@/components/ui/textarea-with-assist'

interface ModelDetailsSectionProps {
  form: UseFormReturn<ModelCard>
  showOptionalFields?: boolean
}

export function ModelDetailsSection({ form, showOptionalFields = true }: ModelDetailsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Model Details
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed information about the model
        </p>
      </div>

      {/* Version field is always shown as it's required */}
      <FormField
        control={form.control}
        name="model_details.version"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Version *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 1.0.0" {...field} />
            </FormControl>
            <FormDescription>
              Version identifier for this model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Optional fields - only show when showOptionalFields is true */}
      {showOptionalFields && (
        <>
          <FormField
            control={form.control}
            name="model_details.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Describe what this model does, its architecture, and key characteristics"
                className="min-h-[100px] pr-24"
                fieldName="Model Description"
                fieldDescription="A comprehensive description of what the model does, its architecture, and key characteristics"
                contextData={form.getValues()}
                onValueChange={field.onChange}
                {...field}
              />
            </FormControl>
            <FormDescription>
              A comprehensive description of the model (AI assistance available)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

          <FormField
            control={form.control}
            name="model_details.license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Apache 2.0, MIT, Proprietary" {...field} />
                </FormControl>
                <FormDescription>
                  The license under which the model is released
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model_details.citation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Citation</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="BibTeX or other citation format for this model"
                    className="min-h-[80px] font-mono text-sm"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  How others should cite this model
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model_details.input_format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input Format</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the expected input format, features, and data types"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Specification of model inputs
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model_details.output_format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Output Format</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the model output format, predictions, and interpretation"
                    className="min-h-[80px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Specification of model outputs
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  )
}
