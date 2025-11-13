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
import { TextareaWithAssist } from '@/components/ui/textarea-with-assist'
interface UsageAndLimitationsSectionProps {
  form: UseFormReturn<ModelCard>
}
export function UsageAndLimitationsSection({ form }: UsageAndLimitationsSectionProps) {
  return (
    <div className="space-y-6 pt-2">
      <FormField
        control={form.control}
        name="uses.direct_use"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Direct Use <span className="text-foreground">*</span></FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Explain how the model can be used without fine-tuning, post-processing, or plugging into a pipeline..."
                className="min-h-[100px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="Direct Use"
                fieldDescription="How the model can be used directly (without fine-tuning)"
                contextData={form.getValues()}
              />
            </FormControl>
            <FormDescription>
              How the model can be used directly (without fine-tuning)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="uses.downstream_use"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Downstream Use <span className="text-foreground">*</span></FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Explain how this model can be used when fine-tuned for a task or plugged into a larger ecosystem/app..."
                className="min-h-[100px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="Downstream Use"
                fieldDescription="How the model can be used when fine-tuned or integrated into larger systems"
                contextData={form.getValues()}
              />
            </FormControl>
            <FormDescription>
              How the model can be used when fine-tuned or integrated into larger systems
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="uses.out_of_scope_use"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Out-of-Scope Use <span className="text-foreground">*</span></FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="List how the model may foreseeably be misused and address what users ought not do with the model..."
                className="min-h-[120px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="Out-of-Scope Use"
                fieldDescription="Foreseeable misuse cases and what the model should NOT be used for"
                contextData={form.getValues()}
              />
            </FormControl>
            <FormDescription>
              Foreseeable misuse cases and what the model should NOT be used for
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
