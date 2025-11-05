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
    <div className="space-y-6">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Basic Information
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Essential identifier for your model
        </p>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model Name *</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Image Classification Model" {...field} />
            </FormControl>
            <FormDescription>
              The unique name of your machine learning model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
