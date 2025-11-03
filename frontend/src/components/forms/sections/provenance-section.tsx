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
    <div className="space-y-4 border-t pt-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Provenance</h3>
        <p className="text-sm text-muted-foreground">Optional metadata about model creation</p>
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
