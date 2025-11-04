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

interface ImplementationSectionProps {
  form: UseFormReturn<ModelCard>
}

export function ImplementationSection({ form }: ImplementationSectionProps) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Implementation
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Technical details about model implementation
        </p>
      </div>

      <FormField
        control={form.control}
        name="implementation.hardware"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hardware</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g., 8x NVIDIA A100 GPUs, TPUv4, CPU specifications"
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Hardware used for training and inference
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="implementation.software"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Software</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Python 3.9, CUDA 11.8" {...field} />
            </FormControl>
            <FormDescription>
              Software environment and dependencies
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="implementation.framework"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Framework</FormLabel>
            <FormControl>
              <Input placeholder="e.g., PyTorch 2.0, TensorFlow 2.13, JAX" {...field} />
            </FormControl>
            <FormDescription>
              ML framework and version used
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
