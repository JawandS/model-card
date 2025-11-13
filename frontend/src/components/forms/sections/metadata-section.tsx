import * as React from 'react'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LIBRARY_NAMES, PIPELINE_TAGS_GROUPS, LICENSE_IDENTIFIERS } from '@/lib/hf-constants'

interface MetadataSectionProps {
  form: UseFormReturn<ModelCard>
}

export function MetadataSection({ form }: MetadataSectionProps) {
  // Local state for tags input to allow natural comma typing
  const [tagsInput, setTagsInput] = React.useState('')

  // Initialize tagsInput from form field value
  React.useEffect(() => {
    const tags = form.watch('metadata.tags')
    if (tags && Array.isArray(tags) && tags.length > 0) {
      setTagsInput(tags.join(', '))
    }
  }, [form])

  return (
    <div className="space-y-6 pt-2">
      <FormField
        control={form.control}
        name="metadata.license"
        render={({ field }) => (
          <FormItem>
            <FormLabel>License (optional)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select license identifier..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px]">
                {LICENSE_IDENTIFIERS.map((lic) => (
                  <SelectItem key={lic.value} value={lic.value}>
                    {lic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              License identifier for HuggingFace Hub (e.g., apache-2.0, mit, cc-by-4.0)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metadata.language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language (optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., en, es, fr (ISO 639-1 codes)"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Language code(s) for NLP models (ISO 639-1 standard like &apos;en&apos;, &apos;fr&apos;, &apos;zh&apos;)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metadata.base_model"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Base Model (optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., bert-base-uncased, meta-llama/Llama-2-7b"
                {...field}
              />
            </FormControl>
            <FormDescription>
              HuggingFace Hub ID of the base model (for fine-tuned or derived models)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metadata.library_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Library Name (optional)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select the ML library/framework..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px]">
                {LIBRARY_NAMES.map((lib) => (
                  <SelectItem key={lib.value} value={lib.value}>
                    {lib.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The ML framework/library used (e.g., transformers, pytorch, tensorflow)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metadata.pipeline_tag"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pipeline Tag (optional)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select the task type..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[400px]">
                {PIPELINE_TAGS_GROUPS.map((group) => (
                  <SelectGroup key={group.category}>
                    <SelectLabel>{group.category}</SelectLabel>
                    {group.tasks.map((task) => (
                      <SelectItem key={task.value} value={task.value}>
                        {task.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The task type (enables inference widget and improves discoverability)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metadata.tags"
        render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter comma-separated tags (e.g., text-generation, llm, conversational, gpt)..."
                  className="min-h-[80px]"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onBlur={(e) => {
                    // Convert comma-separated string to array when focus leaves
                    const tags = e.target.value
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean);
                    field.onChange(tags.length > 0 ? tags : undefined);
                    field.onBlur();
                  }}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormDescription>
                Custom tags for categorization and discoverability on HuggingFace Hub
              </FormDescription>
              <FormMessage />
            </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metadata.inference"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-3">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value ?? true}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
                />
              </FormControl>
              <div className="flex-1">
                <FormLabel className="cursor-pointer" onClick={() => field.onChange(!(field.value ?? true))}>
                  Enable Inference Widget (optional)
                </FormLabel>
                <FormDescription className="mt-1">
                  Allow users to test your model interactively on the HuggingFace Hub model page
                </FormDescription>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
