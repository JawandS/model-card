import { PartialModelCard } from '@modelcard/schema'

interface ModelCardPreviewProps {
  data: PartialModelCard
}

export function ModelCardPreview({ data }: ModelCardPreviewProps) {
  return (
    <div className="space-y-6 text-sm">
      {/* Basic Info */}
      {(data.name || data.model_version || data.owner) && (
        <div>
          <h3 className="text-lg font-bold mb-3">{data.name || 'Untitled Model'}</h3>
          {data.model_version && (
            <p className="text-muted-foreground mb-2">Version: {data.model_version}</p>
          )}
          {data.owner?.organization && (
            <p className="text-muted-foreground">Owner: {data.owner.organization}</p>
          )}
          {data.owner?.contact && (
            <p className="text-muted-foreground">Contact: {data.owner.contact}</p>
          )}
        </div>
      )}

      {/* Intended Use */}
      {data.intended_use && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Intended Use</h4>
          {data.intended_use.summary && (
            <p className="mb-2">{data.intended_use.summary}</p>
          )}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {data.intended_use.clinical_context && (
              <div>
                <span className="font-medium">Clinical Context: </span>
                <span className="capitalize">{data.intended_use.clinical_context}</span>
              </div>
            )}
            {data.intended_use.care_setting && (
              <div>
                <span className="font-medium">Care Setting: </span>
                <span className="capitalize">{data.intended_use.care_setting === 'ed' ? 'Emergency Department' : data.intended_use.care_setting}</span>
              </div>
            )}
          </div>
          {data.intended_use.contraindications && (
            <div className="mt-2">
              <span className="font-medium">Contraindications: </span>
              <p className="text-muted-foreground">{data.intended_use.contraindications}</p>
            </div>
          )}
        </div>
      )}

      {/* Data */}
      {data.data && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Data</h4>
          <div className="space-y-1 text-xs">
            {data.data.source && (
              <p>
                <span className="font-medium">Source: </span>
                <span className="capitalize">{data.data.source === 'ehr' ? 'EHR' : data.data.source}</span>
              </p>
            )}
            {data.data.time_window && (
              <p>
                <span className="font-medium">Time Window: </span>
                {data.data.time_window}
              </p>
            )}
            {data.data.geography && (
              <p>
                <span className="font-medium">Geography: </span>
                {data.data.geography}
              </p>
            )}
          </div>

          {/* Representativeness */}
          {data.data.representativeness && Object.values(data.data.representativeness).some(v => v) && (
            <div className="mt-3 pl-3 border-l-2 border-muted">
              <h5 className="font-medium text-xs mb-2">Data Representativeness</h5>
              <div className="space-y-1 text-xs text-muted-foreground">
                {data.data.representativeness.population_frame && (
                  <p><strong>Population:</strong> {data.data.representativeness.population_frame}</p>
                )}
                {data.data.representativeness.age_distribution && (
                  <p><strong>Age:</strong> {data.data.representativeness.age_distribution}</p>
                )}
                {data.data.representativeness.sex_distribution && (
                  <p><strong>Sex:</strong> {data.data.representativeness.sex_distribution}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Evaluation */}
      {data.evaluation?.overall_metrics && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Evaluation</h4>
          <div className="space-y-2 text-xs">
            <div>
              <p className="font-medium">Overall Metrics</p>
              <p className="text-muted-foreground whitespace-pre-wrap">{data.evaluation.overall_metrics}</p>
            </div>
            {data.evaluation.subgroup_analysis && (
              <div>
                <p className="font-medium">Subgroup Analysis</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{data.evaluation.subgroup_analysis}</p>
              </div>
            )}
            {data.evaluation.limitations && (
              <div>
                <p className="font-medium">Limitations</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{data.evaluation.limitations}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Risk Management */}
      {data.risk_management && Object.values(data.risk_management).some(v => v) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Risk Management</h4>
          <div className="space-y-2 text-xs">
            {data.risk_management.failure_modes && (
              <div>
                <p className="font-medium">Failure Modes</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{data.risk_management.failure_modes}</p>
              </div>
            )}
            {data.risk_management.human_oversight && (
              <div>
                <p className="font-medium">Human Oversight</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{data.risk_management.human_oversight}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Provenance */}
      {data.provenance && Object.values(data.provenance).some(v => v) && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Provenance</h4>
          <div className="space-y-1 text-xs text-muted-foreground">
            {data.provenance.created_at && (
              <p><strong>Created:</strong> {data.provenance.created_at}</p>
            )}
            {data.provenance.created_by && (
              <p><strong>Created By:</strong> {data.provenance.created_by}</p>
            )}
            {data.provenance.dataset_id && (
              <p><strong>Dataset ID:</strong> {data.provenance.dataset_id}</p>
            )}
          </div>
        </div>
      )}

      {!data.name && !data.model_version && (
        <div className="text-center text-muted-foreground py-8">
          <p>Start filling out the form to see a preview</p>
        </div>
      )}
    </div>
  )
}
