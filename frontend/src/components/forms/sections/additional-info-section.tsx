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
interface AdditionalInfoSectionProps {
  form: UseFormReturn<ModelCard>
}
export function AdditionalInfoSection({ form }: AdditionalInfoSectionProps) {
  return (
    <div className="space-y-6 pt-2">
      <FormField
        control={form.control}
        name="get_started_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How to Get Started with the Model (optional)</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Provide a code snippet showing how to use the model...&#10;&#10;from transformers import AutoModel&#10;model = AutoModel.from_pretrained('model-name')"
                className="min-h-[120px] font-mono text-sm"
                onValueChange={field.onChange}
                {...field}
                fieldName="How to Get Started with the Model"
                fieldDescription="Code snippet to show how to use the model"
                contextData={form.getValues()}
              />
            </FormControl>
            <FormDescription>
              Code snippet to show how to use the model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="additional_info.model_examination"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model Examination (optional)</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Describe explainability/interpretability work for the model..."
                className="min-h-[80px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="Model Examination"
                fieldDescription="Experimental section for explainability/interpretability work"
                contextData={form.getValues()}
              />
            </FormControl>
            <FormDescription>
              Experimental section for explainability/interpretability work
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="additional_info.glossary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Glossary (optional)</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Define terms and calculations to help readers understand the model..."
                className="min-h-[80px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="Glossary"
                fieldDescription="Define common terms and metrics"
                contextData={form.getValues()}
              />
            </FormControl>
            <FormDescription>
              Define common terms and metrics
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="additional_info.more_information"
        render={({ field }) => (
          <FormItem>
            <FormLabel>More Information (optional)</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Links to dataset creation, technical specs, lessons learned, etc..."
                className="min-h-[80px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="More Information"
                fieldDescription="Additional resources and links"
                contextData={form.getValues()}
              />
            </FormControl>
            <FormDescription>
              Additional resources and links
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="additional_info.model_card_authors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model Card Authors (optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Jane Doe, John Smith" {...field} />
            </FormControl>
            <FormDescription>
              People who created the model card
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="additional_info.model_card_contact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model Card Contact (optional)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., contact@example.com" type="email" {...field} />
            </FormControl>
            <FormDescription>
              Contact information for questions or updates
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
