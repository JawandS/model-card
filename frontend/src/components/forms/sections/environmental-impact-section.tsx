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
import { Input } from '@/components/ui/input'

interface EnvironmentalImpactSectionProps {
  form: UseFormReturn<ModelCard>
}

export function EnvironmentalImpactSection({ form }: EnvironmentalImpactSectionProps) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border">
        <h3 className="section-header">
          Environmental Impact
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Information to calculate environmental impacts (optional)
        </p>
      </div>

      <FormField
        control={form.control}
        name="environmental_impact.hardware_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hardware Type</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 8x NVIDIA A100 80GB" {...field} />
            </FormControl>
            <FormDescription>
              Type of hardware used for training
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="environmental_impact.hours_used"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hours Used</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 100 hours" {...field} />
            </FormControl>
            <FormDescription>
              Total training time in hours
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="environmental_impact.cloud_provider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cloud Provider</FormLabel>
            <FormControl>
              <Input placeholder="e.g., AWS, Google Cloud, Azure" {...field} />
            </FormControl>
            <FormDescription>
              Cloud provider used (if applicable)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="environmental_impact.cloud_region"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Compute Region</FormLabel>
            <FormControl>
              <Input placeholder="e.g., us-east-1, eu-west-1" {...field} />
            </FormControl>
            <FormDescription>
              Cloud region where training was performed
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="environmental_impact.co2_emitted"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Carbon Emitted</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 125 kg CO2eq" {...field} />
            </FormControl>
            <FormDescription>
              Carbon emissions (use ML Impact calculator: https://mlco2.github.io/impact)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
