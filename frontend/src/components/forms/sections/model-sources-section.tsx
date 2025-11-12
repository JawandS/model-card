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

interface ModelSourcesSectionProps {
  form: UseFormReturn<ModelCard>
}

export function ModelSourcesSection({ form }: ModelSourcesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border">
        <h3 className="section-header">
          Model Sources
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Links to repository, paper, and demo (optional)
        </p>
      </div>

      <FormField
        control={form.control}
        name="model_sources.repo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Repository</FormLabel>
            <FormControl>
              <Input placeholder="e.g., https://github.com/user/repo" type="url" {...field} />
            </FormControl>
            <FormDescription>
              Link to the code repository
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="model_sources.paper"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Paper</FormLabel>
            <FormControl>
              <Input placeholder="e.g., https://arxiv.org/abs/..." type="url" {...field} />
            </FormControl>
            <FormDescription>
              Link to research paper introducing the model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="model_sources.demo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Demo</FormLabel>
            <FormControl>
              <Input placeholder="e.g., https://huggingface.co/spaces/..." type="url" {...field} />
            </FormControl>
            <FormDescription>
              Link to demo or interactive application
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
