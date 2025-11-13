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
interface EvaluationSectionProps {
  form: UseFormReturn<ModelCard>
}
export function EvaluationSection({ form }: EvaluationSectionProps) {
  return (
    <div className="space-y-6 pt-2">
      <FormField
        control={form.control}
        name="evaluation.testing_data"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Testing Data <span className="text-foreground">*</span></FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Describe testing data or link to its Dataset Card..."
                className="min-h-[80px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="Testing Data"
                fieldDescription="Dataset(s) used for evaluation"
                contextData={form.getValues()}
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
            <FormLabel>Factors <span className="text-foreground">*</span></FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Describe characteristics that influence model behavior (e.g., subpopulations, domains)..."
                className="min-h-[100px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="Factors"
                fieldDescription="Factors for disaggregated evaluation (subgroups, domains, etc.)"
                contextData={form.getValues()}
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
            <FormLabel>Metrics <span className="text-foreground">*</span></FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="List evaluation metrics used (e.g., Accuracy, Precision, Recall, F1, BLEU, ROUGE)..."
                className="min-h-[100px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="Metrics"
                fieldDescription="Metrics used for evaluation"
                contextData={form.getValues()}
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
            <FormLabel>Results <span className="text-foreground">*</span></FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Provide evaluation results based on the factors and metrics defined above..."
                className="min-h-[120px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="Results"
                fieldDescription="Evaluation results (should be based on factors and metrics above)"
                contextData={form.getValues()}
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
            <FormLabel>Results Summary <span className="text-foreground">*</span></FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Provide a brief summary/TL;DR of the results for general audiences..."
                className="min-h-[80px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="Results Summary"
                fieldDescription="Summary of results (TL;DR for general audiences)"
                contextData={form.getValues()}
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
