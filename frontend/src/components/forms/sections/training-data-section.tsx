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
import { Textarea } from '@/components/ui/textarea'

interface TrainingDataSectionProps {
  form: UseFormReturn<ModelCard>
}

export function TrainingDataSection({ form }: TrainingDataSectionProps) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
          Training Data
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Information about the data used to train the model
        </p>
      </div>

      <FormField
        control={form.control}
        name="training_data.description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the training dataset, its composition, and key characteristics"
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Overview of the training data
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="training_data.source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source</FormLabel>
            <FormControl>
              <Input placeholder="e.g., ImageNet, Internal Dataset, Public Repository" {...field} />
            </FormControl>
            <FormDescription>
              Where the training data came from
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="training_data.preprocessing"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preprocessing</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe preprocessing steps, data cleaning, augmentation, etc."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              How the data was processed before training
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="training_data.size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Size</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 1M examples, 10GB, 500k tokens" {...field} />
            </FormControl>
            <FormDescription>
              The size or scale of the training dataset
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
