import { PartialModelCard } from '@modelcard/schema'

interface ModelCardPreviewProps {
  data: PartialModelCard
}

export function ModelCardPreview({ data }: ModelCardPreviewProps) {
  const hasContent = (value: any): boolean => {
    if (value === undefined || value === null) return false
    if (typeof value === 'boolean' || typeof value === 'number') return true
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object') return Object.values(value).some(v => hasContent(v))
    return false
  }

  const formatList = (value?: string | string[]) => {
    if (!value) return ''
    if (Array.isArray(value)) return value.join(', ')
    return value
  }

  const showMetadataSection = hasContent(data.metadata?.pipeline_tag) ||
    hasContent(data.metadata?.library_name) ||
    hasContent(data.metadata?.tags) ||
    hasContent(data.metadata?.datasets) ||
    hasContent(data.metadata?.metrics) ||
    data.metadata?.inference === false

  return (
    <div className="space-y-6 text-sm">
      {/* Title */}
      {data.model_id && (
        <div>
          <h3 className="text-lg font-bold mb-3">Model Card for {data.model_id}</h3>
          {data.model_summary && (
            <p className="text-muted-foreground mb-3">{data.model_summary}</p>
          )}
        </div>
      )}

      {/* Model Details */}
      {(data.model_description || data.developers || data.license) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Model Details</h4>
          {data.model_description && (
            <p className="mb-2">{data.model_description}</p>
          )}
          {data.developers && (
            <p className="text-xs mb-1"><span className="font-medium">Developed by:</span> {data.developers}</p>
          )}
          {data.funded_by && (
            <p className="text-xs mb-1"><span className="font-medium">Funded by:</span> {data.funded_by}</p>
          )}
          {data.shared_by && (
            <p className="text-xs mb-1"><span className="font-medium">Shared by:</span> {data.shared_by}</p>
          )}
          {data.model_type && (
            <p className="text-xs mb-1"><span className="font-medium">Model type:</span> {data.model_type}</p>
          )}
          {data.language && (
            <p className="text-xs mb-1"><span className="font-medium">Language(s):</span> {data.language}</p>
          )}
          {data.license && (
            <p className="text-xs mb-1"><span className="font-medium">License:</span> {data.license}</p>
          )}
          {data.base_model && (
            <p className="text-xs mb-1"><span className="font-medium">Finetuned from:</span> {data.base_model}</p>
          )}
        </div>
      )}

      {/* Model Sources */}
      {hasContent(data.model_sources) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Model Sources</h4>
          {data.model_sources?.repo && (
            <p className="text-xs mb-1"><span className="font-medium">Repository:</span> {data.model_sources.repo}</p>
          )}
          {data.model_sources?.paper && (
            <p className="text-xs mb-1"><span className="font-medium">Paper:</span> {data.model_sources.paper}</p>
          )}
          {data.model_sources?.demo && (
            <p className="text-xs mb-1"><span className="font-medium">Demo:</span> {data.model_sources.demo}</p>
          )}
        </div>
      )}

      {/* Uses */}
      {hasContent(data.uses) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Uses</h4>
          {data.uses?.direct_use && (
            <div className="mb-2">
              <p className="text-xs font-medium">Direct Use</p>
              <p className="text-xs text-muted-foreground">{data.uses.direct_use}</p>
            </div>
          )}
          {data.uses?.downstream_use && (
            <div className="mb-2">
              <p className="text-xs font-medium">Downstream Use</p>
              <p className="text-xs text-muted-foreground">{data.uses.downstream_use}</p>
            </div>
          )}
          {data.uses?.out_of_scope_use && (
            <div>
              <p className="text-xs font-medium">Out-of-Scope Use</p>
              <p className="text-xs text-muted-foreground">{data.uses.out_of_scope_use}</p>
            </div>
          )}
        </div>
      )}

      {/* Bias, Risks, and Limitations */}
      {hasContent(data.bias_risks) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Bias, Risks, and Limitations</h4>
          {data.bias_risks?.bias_risks_limitations && (
            <p className="mb-2 text-xs text-muted-foreground">{data.bias_risks.bias_risks_limitations}</p>
          )}
          {data.bias_risks?.bias_recommendations && (
            <div className="mt-2">
              <p className="text-xs font-medium">Recommendations</p>
              <p className="text-xs text-muted-foreground">{data.bias_risks.bias_recommendations}</p>
            </div>
          )}
        </div>
      )}

      {/* How to Get Started */}
      {data.get_started_code && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">How to Get Started with the Model</h4>
          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">{data.get_started_code}</pre>
        </div>
      )}

      {/* Training Details */}
      {hasContent(data.training_details) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Training Details</h4>
          {data.training_details?.training_data && (
            <div className="mb-2">
              <p className="text-xs font-medium">Training Data</p>
              <p className="text-xs text-muted-foreground">{data.training_details.training_data}</p>
            </div>
          )}
          {data.training_details?.preprocessing && (
            <p className="text-xs mb-1"><span className="font-medium">Preprocessing:</span> {data.training_details.preprocessing}</p>
          )}
          {data.training_details?.training_regime && (
            <p className="text-xs mb-1"><span className="font-medium">Training Regime:</span> {data.training_details.training_regime}</p>
          )}
          {data.training_details?.speeds_sizes_times && (
            <p className="text-xs mb-1"><span className="font-medium">Speeds/Sizes/Times:</span> {data.training_details.speeds_sizes_times}</p>
          )}
        </div>
      )}

      {/* Evaluation */}
      {hasContent(data.evaluation) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Evaluation</h4>
          {data.evaluation?.testing_data && (
            <p className="text-xs mb-1"><span className="font-medium">Testing Data:</span> {data.evaluation.testing_data}</p>
          )}
          {data.evaluation?.testing_factors && (
            <p className="text-xs mb-1"><span className="font-medium">Testing Factors:</span> {data.evaluation.testing_factors}</p>
          )}
          {data.evaluation?.testing_metrics && (
            <p className="text-xs mb-1"><span className="font-medium">Metrics:</span> {data.evaluation.testing_metrics}</p>
          )}
          {data.evaluation?.results && (
            <div className="mt-2">
              <p className="text-xs font-medium">Results</p>
              <p className="text-xs text-muted-foreground">{data.evaluation.results}</p>
            </div>
          )}
          {data.evaluation?.results_summary && (
            <div className="mt-2">
              <p className="text-xs font-medium">Summary</p>
              <p className="text-xs text-muted-foreground">{data.evaluation.results_summary}</p>
            </div>
          )}
        </div>
      )}

      {/* Environmental Impact */}
      {hasContent(data.environmental_impact) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Environmental Impact</h4>
          {data.environmental_impact?.hardware_type && (
            <p className="text-xs mb-1"><span className="font-medium">Hardware Type:</span> {data.environmental_impact.hardware_type}</p>
          )}
          {data.environmental_impact?.hours_used && (
            <p className="text-xs mb-1"><span className="font-medium">Hours Used:</span> {data.environmental_impact.hours_used}</p>
          )}
          {data.environmental_impact?.cloud_provider && (
            <p className="text-xs mb-1"><span className="font-medium">Cloud Provider:</span> {data.environmental_impact.cloud_provider}</p>
          )}
          {data.environmental_impact?.cloud_region && (
            <p className="text-xs mb-1"><span className="font-medium">Compute Region:</span> {data.environmental_impact.cloud_region}</p>
          )}
          {data.environmental_impact?.co2_emitted && (
            <p className="text-xs mb-1"><span className="font-medium">Carbon Emitted:</span> {data.environmental_impact.co2_emitted}</p>
          )}
        </div>
      )}

      {/* Technical Specifications */}
      {hasContent(data.technical_specs) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Technical Specifications</h4>
          {data.technical_specs?.model_specs && (
            <p className="text-xs text-muted-foreground mb-2">{data.technical_specs.model_specs}</p>
          )}
          {data.technical_specs?.compute_infrastructure && (
            <p className="text-xs mb-1"><span className="font-medium">Compute Infrastructure:</span> {data.technical_specs.compute_infrastructure}</p>
          )}
          {data.technical_specs?.hardware_requirements && (
            <p className="text-xs mb-1"><span className="font-medium">Hardware Requirements:</span> {data.technical_specs.hardware_requirements}</p>
          )}
          {data.technical_specs?.software && (
            <p className="text-xs mb-1"><span className="font-medium">Software:</span> {data.technical_specs.software}</p>
          )}
        </div>
      )}

      {/* Citation */}
      {hasContent(data.citation) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Citation</h4>
          {data.citation?.citation_bibtex && (
            <div className="mb-2">
              <p className="text-xs font-medium">BibTeX</p>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">{data.citation.citation_bibtex}</pre>
            </div>
          )}
          {data.citation?.citation_apa && (
            <div>
              <p className="text-xs font-medium">APA</p>
              <p className="text-xs text-muted-foreground">{data.citation.citation_apa}</p>
            </div>
          )}
        </div>
      )}

      {/* Additional Information */}
      {hasContent(data.additional_info) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Additional Information</h4>
          {data.additional_info?.model_examination && (
            <p className="text-xs mb-2"><span className="font-medium">Model Examination:</span> {data.additional_info.model_examination}</p>
          )}
          {data.additional_info?.glossary && (
            <p className="text-xs mb-2"><span className="font-medium">Glossary:</span> {data.additional_info.glossary}</p>
          )}
          {data.additional_info?.more_information && (
            <p className="text-xs mb-2"><span className="font-medium">More Information:</span> {data.additional_info.more_information}</p>
          )}
          {data.additional_info?.model_card_authors && (
            <p className="text-xs mb-1"><span className="font-medium">Model Card Authors:</span> {data.additional_info.model_card_authors}</p>
          )}
          {data.additional_info?.model_card_contact && (
            <p className="text-xs mb-1"><span className="font-medium">Contact:</span> {data.additional_info.model_card_contact}</p>
          )}
        </div>
      )}

      {showMetadataSection && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">HuggingFace Metadata</h4>
          {data.metadata?.pipeline_tag && (
            <p className="text-xs mb-1"><span className="font-medium">Pipeline Tag:</span> {data.metadata.pipeline_tag}</p>
          )}
          {data.metadata?.library_name && (
            <p className="text-xs mb-1"><span className="font-medium">Library:</span> {data.metadata.library_name}</p>
          )}
          {hasContent(data.metadata?.datasets) && (
            <p className="text-xs mb-1"><span className="font-medium">Datasets:</span> {formatList(data.metadata?.datasets)}</p>
          )}
          {hasContent(data.metadata?.metrics) && (
            <p className="text-xs mb-1"><span className="font-medium">Metrics:</span> {formatList(data.metadata?.metrics)}</p>
          )}
          {hasContent(data.metadata?.tags) && (
            <p className="text-xs mb-1"><span className="font-medium">Tags:</span> {formatList(data.metadata?.tags)}</p>
          )}
          {data.metadata?.inference !== undefined && (
            <p className="text-xs mb-1"><span className="font-medium">Inference Widget:</span> {data.metadata.inference ? 'Enabled' : 'Disabled'}</p>
          )}
        </div>
      )}
    </div>
  )
}
