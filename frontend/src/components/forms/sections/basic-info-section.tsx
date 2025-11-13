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
import { TextareaWithAssist } from '@/components/ui/textarea-with-assist'

interface BasicInfoSectionProps {
  form: UseFormReturn<ModelCard>
  showOptionalFields?: boolean
}

export function BasicInfoSection({ form, showOptionalFields = true }: BasicInfoSectionProps) {
  return (
    <div className="space-y-6 pt-2">
      <FormField
        control={form.control}
        name="model_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model ID <span className="text-destructive">*</span></FormLabel>
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
              <FormLabel>Model Summary <span className="text-foreground">*</span></FormLabel>
              <FormControl>
                <TextareaWithAssist
                  placeholder="Provide a quick 1-2 sentence summary of what the model is"
                  className="min-h-[80px]"
                  fieldName="Model Summary"
                  fieldDescription="A brief summary of what the model does (1-2 sentences)"
                  contextData={form.getValues()}
                  onValueChange={field.onChange}
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
