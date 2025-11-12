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

interface TechnicalSpecsSectionProps {
  form: UseFormReturn<ModelCard>
}

export function TechnicalSpecsSection({ form }: TechnicalSpecsSectionProps) {
  return (
    <div className="space-y-6 pt-2">
      <FormField
        control={form.control}
        name="technical_specs.model_specs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Model Architecture and Objective</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the model architecture, objective function, and training methodology..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Details about model architecture and training objective
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="technical_specs.compute_infrastructure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Compute Infrastructure</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the compute infrastructure used for training..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Overview of compute infrastructure
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="technical_specs.hardware_requirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hardware Requirements</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe minimum hardware requirements for inference (processing, storage, memory)..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Minimum hardware requirements for running the model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="technical_specs.software"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Software</FormLabel>
            <FormControl>
              <Textarea
                placeholder="List software dependencies, frameworks, and libraries (e.g., PyTorch 2.0, transformers 4.30)..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Software dependencies and requirements
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
