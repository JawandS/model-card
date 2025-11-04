import { UseFormReturn } from 'react-hook-form'
import { ModelCard, ClinicalContextEnum, CareSettingEnum } from '@modelcard/schema'
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

interface HealthcareExtensionSectionProps {
  form: UseFormReturn<ModelCard>
}

export function HealthcareExtensionSection({ form }: HealthcareExtensionSectionProps) {
  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-border/50">
        <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent">
          Healthcare Extension
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Healthcare-specific fields (optional)
        </p>
      </div>

      <FormField
        control={form.control}
        name="healthcare.clinical_context"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Clinical Context</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select clinical context" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ClinicalContextEnum.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The clinical context in which this model is used
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="healthcare.care_setting"
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
                {CareSettingEnum.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option.toUpperCase() === 'ED' ? 'Emergency Department' : option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The care setting where this model is deployed
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="healthcare.patient_population"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Patient Population</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the target patient population..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Target patient population and inclusion/exclusion criteria
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="healthcare.contraindications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contraindications</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe any contraindications or situations where the model should not be used..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Clinical contraindications and restrictions
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="healthcare.clinical_validation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Clinical Validation</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe clinical validation studies and results..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Clinical validation and real-world performance
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4 pl-4 border-l-2 border-teal-200 dark:border-teal-800">
        <h4 className="text-sm font-semibold text-teal-700 dark:text-teal-300">
          Data Representativeness
        </h4>

        <FormField
          control={form.control}
          name="healthcare.representativeness.population_frame"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Population Frame</FormLabel>
              <FormControl>
                <Input placeholder="e.g., US adults with diabetes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="healthcare.representativeness.payer_mix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payer Mix</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 60% commercial, 30% Medicare, 10% Medicaid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="healthcare.representativeness.age_distribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age Distribution</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Mean: 55 years, Range: 18-90" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="healthcare.representativeness.sex_distribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sex Distribution</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 52% female, 48% male" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="healthcare.representativeness.race_ethnicity_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Race/Ethnicity Distribution</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe race and ethnicity distribution in the data..."
                  className="min-h-[60px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="healthcare.representativeness.geographic_distribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Geographic Distribution</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Multi-center US study, Northeast region" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="healthcare.representativeness.missingness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data Missingness</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe patterns of missing data and how they were handled..."
                  className="min-h-[60px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="healthcare.failure_modes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Failure Modes</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe potential failure modes and their clinical implications..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Known failure modes and their impact
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="healthcare.human_oversight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Human Oversight</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the human oversight requirements and clinical workflow integration..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Required human oversight and clinical decision support
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="healthcare.monitoring_plan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Monitoring Plan</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the plan for ongoing monitoring and performance tracking..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Post-deployment monitoring strategy
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
