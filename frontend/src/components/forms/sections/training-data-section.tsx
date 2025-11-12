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
    <div className="space-y-6 pt-2">
      <FormField
        control={form.control}
        name="training_details.training_data"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Training Data</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the training dataset, its composition, source, and key characteristics. Link to Dataset Card if available."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              1-2 sentences about the training data (link to Dataset Card if available)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="training_details.preprocessing"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preprocessing</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Detail tokenization, resizing/rewriting, data cleaning, augmentation, etc."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Preprocessing steps applied to the data
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="training_details.training_regime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Training Regime</FormLabel>
            <FormControl>
              <Input placeholder="e.g., fp32, fp16 mixed precision, bf16 mixed precision" {...field} />
            </FormControl>
            <FormDescription>
              Training precision (fp32, fp16, bf16, etc.)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="training_details.speeds_sizes_times"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Speeds, Sizes, Times</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Detail throughput, start/end time, checkpoint sizes, etc."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Information about training throughput, duration, and checkpoint sizes
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
