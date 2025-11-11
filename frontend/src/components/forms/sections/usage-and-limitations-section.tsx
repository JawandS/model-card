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
import { Textarea } from '@/components/ui/textarea'

interface UsageAndLimitationsSectionProps {
  form: UseFormReturn<ModelCard>
}

export function UsageAndLimitationsSection({ form }: UsageAndLimitationsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          Uses
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          How the model is intended to be used and out-of-scope uses
        </p>
      </div>

      <FormField
        control={form.control}
        name="uses.direct_use"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Direct Use</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Explain how the model can be used without fine-tuning, post-processing, or plugging into a pipeline..."
                className="min-h-[100px]"
                {...field}
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
            <FormLabel>Downstream Use (optional)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Explain how this model can be used when fine-tuned for a task or plugged into a larger ecosystem/app..."
                className="min-h-[100px]"
                {...field}
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
            <FormLabel>Out-of-Scope Use</FormLabel>
            <FormControl>
              <Textarea
                placeholder="List how the model may foreseeably be misused and address what users ought not do with the model..."
                className="min-h-[120px]"
                {...field}
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
