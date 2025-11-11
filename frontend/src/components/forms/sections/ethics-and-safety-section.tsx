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
          Ethics and Safety
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Ethical considerations, safety evaluation, and bias analysis
        </p>
      </div>

      <FormField
        control={form.control}
        name="ethics_and_safety.approach"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Evaluation Approach</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the approach used to evaluate ethical and safety considerations..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Methodology for ethics and safety evaluation
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ethics_and_safety.risks"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Risks</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe potential risks from model deployment and use..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Identified risks and potential negative impacts
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ethics_and_safety.harms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Potential Harms</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe potential harms to individuals or groups..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Potential harms including representational harms
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ethics_and_safety.bias_analysis"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bias Analysis</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Describe bias testing, measurements, and findings across different groups..."
                className="min-h-[120px] pr-24"
                fieldName="Bias Analysis"
                fieldDescription="Analysis of bias in model predictions and outcomes across different demographic and subgroup factors"
                contextData={form.getValues()}
                onValueChange={field.onChange}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Analysis of bias in model predictions and outcomes
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ethics_and_safety.fairness_assessment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fairness Assessment</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Describe fairness metrics, disparities across groups, and mitigation strategies..."
                className="min-h-[120px] pr-24"
                fieldName="Fairness Assessment"
                fieldDescription="Assessment of fairness across demographic and other relevant groups, including fairness metrics and mitigation strategies"
                contextData={form.getValues()}
                onValueChange={field.onChange}
                {...field}
              />
            </FormControl>
            <FormDescription>
              Assessment of fairness across demographic and other relevant groups
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
