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
    <div className="space-y-6">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
          Evaluation
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Testing data, metrics, and performance results
        </p>
      </div>

      <FormField
        control={form.control}
        name="evaluation.testing_data"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Testing Data</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe testing data or link to its Dataset Card..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Dataset(s) used for evaluation
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="evaluation.testing_factors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Factors</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe characteristics that influence model behavior (e.g., subpopulations, domains)..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Factors for disaggregated evaluation (subgroups, domains, etc.)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="evaluation.testing_metrics"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Metrics</FormLabel>
            <FormControl>
              <Textarea
                placeholder="List evaluation metrics used (e.g., Accuracy, Precision, Recall, F1, BLEU, ROUGE)..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Metrics used for evaluation
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="evaluation.results"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Results</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide evaluation results based on the factors and metrics defined above..."
                className="min-h-[120px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Evaluation results (should be based on factors and metrics above)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="evaluation.results_summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Results Summary</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide a brief summary/TL;DR of the results for general audiences..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Summary of results (TL;DR for general audiences)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
