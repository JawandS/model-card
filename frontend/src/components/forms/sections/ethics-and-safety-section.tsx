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
import { TextareaWithAssist } from '@/components/ui/textarea-with-assist'

interface EthicsAndSafetySectionProps {
  form: UseFormReturn<ModelCard>
}

export function EthicsAndSafetySection({ form }: EthicsAndSafetySectionProps) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
          Bias, Risks, and Limitations
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Known issues, biases, risks, and limitations of the model
        </p>
      </div>

      <FormField
        control={form.control}
        name="bias_risks.bias_risks_limitations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bias, Risks, and Limitations</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Describe known or foreseeable issues including bias (stereotypes, skew), risks (socially-relevant issues), and limitations (failure modes)..."
                className="min-h-[150px] pr-24"
                fieldName="Bias, Risks, and Limitations"
                fieldDescription="Analysis of bias (stereotypes, performance skew), risks (socially-relevant issues), and limitations (technical failure modes) of the model"
                contextData={form.getValues()}
                onValueChange={field.onChange}
                {...field}
              />
            </FormControl>
            <FormDescription>
              What are the known or foreseeable issues stemming from this model? Include bias, risks, and limitations.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bias_risks.bias_recommendations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Recommendations</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Provide recommendations to address the foreseeable issues (e.g., filtering content, downsampling, monitoring for drift)..."
                className="min-h-[120px] pr-24"
                fieldName="Bias Recommendations"
                fieldDescription="Recommendations with respect to bias, risks, and limitations identified above, including mitigation strategies"
                contextData={form.getValues()}
                onValueChange={field.onChange}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Recommendations to address the identified issues (mitigation strategies, usage guidelines, monitoring)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
