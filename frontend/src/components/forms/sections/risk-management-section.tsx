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
    <div className="space-y-4 border-t pt-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Risk Management</h3>
        <p className="text-sm text-muted-foreground">Optional section</p>
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
