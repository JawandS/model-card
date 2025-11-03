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

interface EvaluationSectionProps {
  form: UseFormReturn<ModelCard>
}

export function EvaluationSection({ form }: EvaluationSectionProps) {
  return (
    <div className="space-y-4 border-t pt-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Model Evaluation</h3>
      </div>

      <FormField
        control={form.control}
        name="evaluation.overall_metrics"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Overall Metrics *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., AUROC: 0.85, Sensitivity: 0.78, Specificity: 0.82..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Overall performance metrics on the validation/test set
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="evaluation.subgroup_analysis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subgroup Analysis</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe performance across different demographic subgroups..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Analysis of model performance across different patient subgroups (age, sex, race, etc.)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="evaluation.external_validation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>External Validation</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe any external validation studies..."
                {...field}
              />
            </FormControl>
            <FormDescription>
              Results from validation on external datasets or at different institutions
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="evaluation.limitations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Limitations</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe known limitations of the model's performance..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Known limitations, biases, or caveats about the model's performance
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
