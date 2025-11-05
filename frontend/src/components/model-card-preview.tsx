import { PartialModelCard } from '@modelcard/schema'

interface ModelCardPreviewProps {
  data: PartialModelCard
}

export function ModelCardPreview({ data }: ModelCardPreviewProps) {
  const hasContent = (obj: any): boolean => {
    if (!obj) return false
    return Object.values(obj).some(v => v && (typeof v !== 'object' || hasContent(v)))
  }

  return (
    <div className="space-y-6 text-sm">
      {/* Basic Info */}
      {data.name && (
        <div>
          <h3 className="text-lg font-bold mb-3">{data.name}</h3>
        </div>
      )}

      {/* Model Details */}
      {hasContent(data.model_details) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Model Details</h4>
          {data.model_details?.version && (
            <p className="text-muted-foreground mb-2">Version: {data.model_details.version}</p>
          )}
          {data.model_details?.description && (
            <p className="mb-2">{data.model_details.description}</p>
          )}
          {data.model_details?.license && (
            <p className="text-xs text-muted-foreground">License: {data.model_details.license}</p>
          )}
        </div>
      )}

      {/* Training Data */}
      {hasContent(data.training_data) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Training Data</h4>
          {data.training_data?.description && <p className="mb-2">{data.training_data.description}</p>}
          {data.training_data?.source && (
            <p className="text-xs"><span className="font-medium">Source:</span> {data.training_data.source}</p>
          )}
          {data.training_data?.size && (
            <p className="text-xs"><span className="font-medium">Size:</span> {data.training_data.size}</p>
          )}
        </div>
      )}

      {/* Evaluation */}
      {hasContent(data.evaluation) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Evaluation</h4>
          {data.evaluation?.metrics && <p className="mb-2">{data.evaluation.metrics}</p>}
          {data.evaluation?.benchmark_results && (
            <p className="text-xs text-muted-foreground">{data.evaluation.benchmark_results}</p>
          )}
        </div>
      )}

      {/* Ethics and Safety */}
      {hasContent(data.ethics_and_safety) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Ethics and Safety</h4>
          {data.ethics_and_safety?.bias_analysis && (
            <div className="mb-2">
              <p className="text-xs font-medium">Bias Analysis</p>
              <p className="text-xs text-muted-foreground">{data.ethics_and_safety.bias_analysis}</p>
            </div>
          )}
          {data.ethics_and_safety?.fairness_assessment && (
            <div>
              <p className="text-xs font-medium">Fairness Assessment</p>
              <p className="text-xs text-muted-foreground">{data.ethics_and_safety.fairness_assessment}</p>
            </div>
          )}
        </div>
      )}

      {/* Usage and Limitations */}
      {hasContent(data.usage_and_limitations) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Usage and Limitations</h4>
          {data.usage_and_limitations?.intended_use && (
            <p className="mb-2">{data.usage_and_limitations.intended_use}</p>
          )}
          {data.usage_and_limitations?.limitations && (
            <div className="mt-2">
              <p className="text-xs font-medium">Limitations</p>
              <p className="text-xs text-muted-foreground">{data.usage_and_limitations.limitations}</p>
            </div>
          )}
        </div>
      )}

      {/* Healthcare Extension */}
      {hasContent(data.healthcare) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Healthcare Extension</h4>
          {data.healthcare?.clinical_context && (
            <p className="text-xs mb-1">
              <span className="font-medium">Clinical Context:</span> {data.healthcare.clinical_context}
            </p>
          )}
          {data.healthcare?.care_setting && (
            <p className="text-xs mb-1">
              <span className="font-medium">Care Setting:</span> {data.healthcare.care_setting}
            </p>
          )}
          {data.healthcare?.patient_population && (
            <p className="text-xs text-muted-foreground mt-2">{data.healthcare.patient_population}</p>
          )}
        </div>
      )}
    </div>
  )
}
