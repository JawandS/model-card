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
import { TextareaWithAssist } from '@/components/ui/textarea-with-assist'
interface CitationSectionProps {
  form: UseFormReturn<ModelCard>
}
export function CitationSection({ form }: CitationSectionProps) {
  return (
    <div className="space-y-6 pt-2">
      <FormField
        control={form.control}
        name="citation.citation_bibtex"
        render={({ field }) => (
          <FormItem>
            <FormLabel>BibTeX (optional)</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="@article{author2024model,&#10;  title={Model Name},&#10;  author={Author Name},&#10;  year={2024}&#10;}"
                className="min-h-[120px] font-mono text-sm"
                onValueChange={field.onChange}
                {...field}
                fieldName="BibTeX"
                fieldDescription="BibTeX citation for this model"
                contextData={form.getValues()}
              />
            </FormControl>
            <FormDescription>
              BibTeX citation for this model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="citation.citation_apa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>APA (optional)</FormLabel>
            <FormControl>
              <TextareaWithAssist
                placeholder="Author, A. (2024). Model Name. Publisher."
                className="min-h-[80px]"
                onValueChange={field.onChange}
                {...field}
                fieldName="APA"
                fieldDescription="APA citation for this model"
                contextData={form.getValues()}
              />
            </FormControl>
            <FormDescription>
              APA citation for this model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
