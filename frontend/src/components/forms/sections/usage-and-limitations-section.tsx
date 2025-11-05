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
          Usage and Limitations
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Intended use cases, limitations, and ethical considerations
        </p>
      </div>

      <FormField
        control={form.control}
        name="usage_and_limitations.intended_use"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Intended Use</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the intended use cases and contexts for this model..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              How the model is intended to be used
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="usage_and_limitations.limitations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Limitations</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe known limitations, edge cases, and when the model should not be used..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Technical and practical limitations of the model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="usage_and_limitations.ethical_considerations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ethical Considerations</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe ethical considerations for deploying and using this model..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Important ethical considerations for model deployment
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="usage_and_limitations.benefits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Benefits</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the expected benefits and positive impacts of using this model..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Expected benefits and positive outcomes
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
