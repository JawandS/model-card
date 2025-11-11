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

      <FormField
        control={form.control}
        name="model_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Provide a longer summary of what this model is, including architecture, version, and key characteristics"
                className="min-h-[100px] pr-24"
                fieldName="Model Description"
                fieldDescription="A comprehensive description of what the model does, its architecture, and key characteristics"
                contextData={form.getValues()}
                onValueChange={field.onChange}
                {...field}
              />
            </FormControl>
            <FormDescription>
              A comprehensive description of the model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="developers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Developed by *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., John Doe, Acme Corp" {...field} />
            </FormControl>
            <FormDescription>
              List the people or organization who built the model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {showOptionalFields && (
        <>
          <FormField
            control={form.control}
            name="funded_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Funded by</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., NSF Grant #12345, Internal R&D" {...field} />
                </FormControl>
                <FormDescription>
                  Funding sources that supported development of this model
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shared_by"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shared by</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., HuggingFace, GitHub User" {...field} />
                </FormControl>
                <FormDescription>
                  The person/organization making the model available online
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Transformer, CNN, Supervised Learning" {...field} />
                </FormControl>
                <FormDescription>
                  Type of model (architecture, learning method, or modality)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language(s)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., English, Multilingual (en, es, fr)" {...field} />
                </FormControl>
                <FormDescription>
                  Natural language(s) for NLP models
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., apache-2.0, mit, cc-by-4.0" {...field} />
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
            name="base_model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Finetuned from Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., bert-base-uncased, gpt-3" {...field} />
                </FormControl>
                <FormDescription>
                  If this model was finetuned, link to the base model
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
