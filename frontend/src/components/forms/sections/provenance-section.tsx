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

interface ProvenanceSectionProps {
  form: UseFormReturn<ModelCard>
}

export function ProvenanceSection({ form }: ProvenanceSectionProps) {
  return (
    <div className="space-y-6 border-t border-border/30 pt-8">
      <div className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Provenance
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Creation metadata and lineage tracking (Optional)
            </p>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-medium">
            Optional
          </span>
        </div>
      </div>

      <FormField
        control={form.control}
        name="provenance.created_at"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Creation Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                placeholder="YYYY-MM-DD"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Date when the model was created or trained
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="provenance.created_by"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Created By</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Dr. Jane Smith, ML Engineering Team"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Person or team who created the model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="provenance.dataset_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dataset ID</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., dataset-v2-2023-001"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Unique identifier for the training dataset
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="provenance.artifact_hash"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Artifact Hash</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., sha256:a3f2d8e9..."
                {...field}
              />
            </FormControl>
            <FormDescription>
              Cryptographic hash of the model artifact for verification
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
