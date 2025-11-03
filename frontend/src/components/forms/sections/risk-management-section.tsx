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

interface RiskManagementSectionProps {
  form: UseFormReturn<ModelCard>
}

export function RiskManagementSection({ form }: RiskManagementSectionProps) {
  return (
    <div className="space-y-6 border-t border-border/30 pt-8">
      <div className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Risk Management
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Safety considerations and oversight (Optional)
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
            Optional
          </span>
        </div>
      </div>

      <FormField
        control={form.control}
        name="risk_management.failure_modes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Failure Modes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe potential failure modes and how they might manifest..."
                {...field}
              />
            </FormControl>
            <FormDescription>
              Potential ways the model could fail and their clinical implications
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="risk_management.human_oversight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Human Oversight</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the human oversight procedures..."
                {...field}
              />
            </FormControl>
            <FormDescription>
              How clinicians should review and validate model outputs
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="risk_management.monitoring_plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monitoring Plan</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the ongoing monitoring strategy..."
                {...field}
              />
            </FormControl>
            <FormDescription>
              Plans for ongoing monitoring of model performance in production
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
