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

interface BasicInfoSectionProps {
  form: UseFormReturn<ModelCard>
  showOptionalFields?: boolean
}

export function BasicInfoSection({ form, showOptionalFields = true }: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Basic Information
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Essential identifier and summary for your model
        </p>
      </div>

      <FormField
        control={form.control}
        name="model_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model ID *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., my-awesome-model" {...field} />
            </FormControl>
            <FormDescription>
              The unique identifier for your machine learning model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {showOptionalFields && (
        <FormField
          control={form.control}
          name="model_summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Summary</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a quick 1-2 sentence summary of what the model is"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief summary of what the model does (1-2 sentences)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
