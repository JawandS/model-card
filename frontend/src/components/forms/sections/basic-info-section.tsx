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

interface BasicInfoSectionProps {
  form: UseFormReturn<ModelCard>
}

export function BasicInfoSection({ form }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model Name *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Diabetes Risk Predictor v2" {...field} />
            </FormControl>
            <FormDescription>
              The name of your machine learning model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="model_version"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model Version *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 2.1.0" {...field} />
            </FormControl>
            <FormDescription>
              Version identifier for this model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="owner.organization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., HealthTech AI Labs" {...field} />
            </FormControl>
            <FormDescription>
              The organization that owns or developed this model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="owner.contact"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="e.g., ml-team@healthtech.com"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Optional contact email for inquiries about this model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
