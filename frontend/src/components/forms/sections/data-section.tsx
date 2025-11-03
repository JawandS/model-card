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

interface DataSectionProps {
  form: UseFormReturn<ModelCard>
}

export function DataSection({ form }: DataSectionProps) {
  return (
    <div className="space-y-6 border-t border-border/30 pt-8">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Data Sources
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Training data characteristics and representativeness
        </p>
      </div>

      <FormField
        control={form.control}
        name="data.source"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data Source *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="claims">Claims Data</SelectItem>
                <SelectItem value="ehr">Electronic Health Records (EHR)</SelectItem>
                <SelectItem value="registry">Registry Data</SelectItem>
                <SelectItem value="imaging">Medical Imaging</SelectItem>
                <SelectItem value="wearables">Wearable Devices</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              The primary source of training data for the model
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="data.time_window"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time Window *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., January 2020 - December 2022"
                {...field}
              />
            </FormControl>
            <FormDescription>
              The time period during which the data was collected
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="data.geography"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Geography</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., United States, Northeast region"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Geographic region where the data was collected
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 rounded-xl bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-border/30 p-6 mt-6">
        <h4 className="text-base font-bold text-foreground mb-4">Data Representativeness</h4>

        <FormField
          control={form.control}
          name="data.representativeness.population_frame"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Population Frame</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the population included in the dataset..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data.representativeness.payer_mix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payer Mix</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the insurance/payer distribution..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data.representativeness.age_distribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Distribution</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Mean 45 years (range 18-89)"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data.representativeness.sex_distribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sex Distribution</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 55% female, 45% male"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data.representativeness.race_ethnicity_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Race/Ethnicity Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the racial and ethnic composition of the dataset..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data.representativeness.missingness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Missingness</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe patterns of missing data..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
