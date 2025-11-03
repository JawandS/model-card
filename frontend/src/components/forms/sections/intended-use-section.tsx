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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface IntendedUseSectionProps {
  form: UseFormReturn<ModelCard>
}

export function IntendedUseSection({ form }: IntendedUseSectionProps) {
  return (
    <div className="space-y-6 border-t border-border/30 pt-8">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Intended Use
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Clinical context and application scope
        </p>
      </div>

      <FormField
        control={form.control}
        name="intended_use.summary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Summary *</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the intended use of this model..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              A brief summary of the model&apos;s intended use case
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="intended_use.clinical_context"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Clinical Context *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select clinical context" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="triage">Triage</SelectItem>
                <SelectItem value="diagnosis">Diagnosis</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              The clinical context in which the model will be used
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="intended_use.care_setting"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Care Setting</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select care setting" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="inpatient">Inpatient</SelectItem>
                <SelectItem value="outpatient">Outpatient</SelectItem>
                <SelectItem value="ed">Emergency Department</SelectItem>
                <SelectItem value="telehealth">Telehealth</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              The healthcare setting where the model will be deployed
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="intended_use.contraindications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contraindications</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe any contraindications or situations where the model should not be used..."
                {...field}
              />
            </FormControl>
            <FormDescription>
              Known limitations or situations where the model should not be applied
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
