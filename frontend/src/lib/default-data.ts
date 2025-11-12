import type { ModelCard } from '@modelcard/schema'

/**
 * Default example data for model card
 * Used when "Use example data" toggle is enabled in export modal
 * Based on placeholder text and hints from form fields
 */
export const DEFAULT_MODEL_CARD_DATA: ModelCard = {
  // Required fields
  model_id: 'my-awesome-model',
  developers: 'John Doe, Acme Corp AI Lab',

  // Basic information
  model_summary: 'A transformer-based model for text classification tasks, achieving state-of-the-art performance on sentiment analysis.',

  // Model details
  model_description: 'This is a BERT-based model fine-tuned for multi-class text classification. The model uses a 12-layer transformer architecture with 768 hidden dimensions and 12 attention heads. It has been optimized for both accuracy and inference speed.',
  funded_by: 'NSF Grant #12345, Internal R&D',
  shared_by: 'HuggingFace Community',
  model_type: 'Transformer, Supervised Learning',
  language: 'English (en)',
  license: 'apache-2.0',
  base_model: 'bert-base-uncased',
  model_function: 'Text Classification',
  feedback: 'For questions or feedback, please open an issue on our GitHub repository.',

  // Model sources
  model_sources: {
    repository: 'https://github.com/acme-corp/my-awesome-model',
    paper: 'https://arxiv.org/abs/2401.12345',
    demo: 'https://huggingface.co/spaces/acme/model-demo',
  },

  // Uses
  uses: {
    direct_use: 'This model can be used directly for sentiment analysis on English text. It accepts text input and outputs probability distributions across positive, negative, and neutral classes. No additional fine-tuning is required for general sentiment analysis tasks.',
    downstream_use: 'The model can be fine-tuned for domain-specific classification tasks such as product review analysis, social media sentiment monitoring, or customer feedback categorization. It can also be integrated into larger NLP pipelines for multi-stage text processing.',
    out_of_scope_use: 'This model should not be used for making critical decisions about individuals (e.g., hiring, loan approval). It is not suitable for languages other than English, as it was trained exclusively on English text. The model may produce unreliable results on highly technical or domain-specific jargon without fine-tuning.',
  },

  // Bias, risks, and limitations
  bias_risks: {
    bias_risks_limitations: 'The model may exhibit bias toward certain demographic groups or perspectives represented in the training data. Performance may degrade on text from underrepresented populations or non-standard English dialects. The model can produce false positives/negatives and should not be used as the sole decision-making tool in high-stakes scenarios.',
    bias_recommendations: 'Users should validate model outputs with domain experts, especially for sensitive applications. Consider implementing confidence thresholds and human-in-the-loop review for borderline predictions. Monitor performance across different demographic groups and text sources. Regular retraining on diverse data is recommended to mitigate drift and evolving biases.',
  },

  // Getting started
  get_started_code: `from transformers import AutoTokenizer, AutoModelForSequenceClassification

tokenizer = AutoTokenizer.from_pretrained("acme/my-awesome-model")
model = AutoModelForSequenceClassification.from_pretrained("acme/my-awesome-model")

# Example usage
text = "This product exceeded my expectations!"
inputs = tokenizer(text, return_tensors="pt")
outputs = model(**inputs)
predictions = outputs.logits.softmax(dim=-1)`,

  // Training details
  training: {
    training_data: 'The model was trained on a combination of publicly available sentiment datasets including SST-2, IMDB reviews, and Twitter sentiment data, totaling approximately 500,000 examples. See the dataset card at https://huggingface.co/datasets/acme/sentiment-combined for more details.',
    preprocessing: 'Text was lowercased and tokenized using the BERT WordPiece tokenizer with a vocabulary size of 30,000. Special tokens [CLS] and [SEP] were added for sequence classification. Maximum sequence length was set to 512 tokens with truncation and padding applied as needed.',
    training_regime: 'fp16 mixed precision',
    speeds_sizes_times: 'Training completed in 8 hours on 4x NVIDIA A100 80GB GPUs. Final checkpoint size is 440MB. Average throughput was 1,200 samples/second during training.',
  },

  // Evaluation
  evaluation: {
    testing_data: 'Evaluated on held-out test sets from SST-2 (sentiment), IMDB (movie reviews), and a proprietary customer feedback dataset. Total test set size: 50,000 examples.',
    testing_factors: 'Performance was evaluated across different factors including text length (short vs. long reviews), domain (products, movies, services), and sentiment intensity (strongly positive/negative vs. neutral/mixed).',
    testing_metrics: 'Primary metrics: Accuracy, Precision, Recall, F1-score (macro and weighted). Additional metrics: ROC-AUC, confusion matrices for multi-class classification.',
    results: 'Overall test accuracy: 92.5%. F1-score (weighted): 0.923. Performance breakdown by domain: Movies (94.2%), Products (91.8%), Services (90.3%). The model performs best on clearly positive/negative sentiment and shows slightly lower accuracy on neutral/mixed sentiments.',
    results_summary: 'The model achieves 92.5% accuracy on the test set, with strong performance across multiple domains. It excels at identifying clear sentiment but may require fine-tuning for nuanced or domain-specific language.',
  },

  // Environmental impact
  environmental_impact: {
    hardware_type: '4x NVIDIA A100 80GB',
    hours_used: '8 hours',
    cloud_provider: 'AWS',
    cloud_region: 'us-east-1',
    co2_emitted: '12.5 kg CO2eq',
  },

  // Technical specifications
  technical_specs: {
    model_specs: '12-layer transformer encoder with 768 hidden dimensions, 12 attention heads, and 110M parameters. Uses GELU activation and learned positional embeddings. Classification head consists of a dropout layer (p=0.1) followed by a linear projection to 3 classes.',
    compute_infrastructure: 'Training performed on AWS EC2 p4d.24xlarge instances with NVLink-connected A100 GPUs. Used PyTorch DistributedDataParallel for multi-GPU training.',
    hardware: 'Minimum 8GB GPU memory for inference. CPU inference supported but significantly slower (10-20x). Recommended: NVIDIA T4 or better for production deployment. Model requires approximately 500MB disk space.',
    software: 'PyTorch 2.0.1, transformers 4.30.2, tokenizers 0.13.3, CUDA 11.8, Python 3.9+',
  },

  // Citation
  citation: {
    citation_bibtex: `@article{doe2024awesome,
  title={My Awesome Model: A Transformer Approach to Sentiment Analysis},
  author={Doe, John and Smith, Jane},
  journal={arXiv preprint arXiv:2401.12345},
  year={2024}
}`,
    citation_apa: 'Doe, J., & Smith, J. (2024). My Awesome Model: A Transformer Approach to Sentiment Analysis. arXiv preprint arXiv:2401.12345.',
  },

  // Additional information
  additional_info: {
    model_examination: 'SHAP values and attention visualizations were used to interpret model predictions. Analysis shows the model correctly identifies key sentiment-bearing words (e.g., "excellent", "terrible") and contextual negations (e.g., "not bad").',
    glossary: '**Accuracy**: Percentage of correct predictions. **F1-score**: Harmonic mean of precision and recall. **fp16**: 16-bit floating point precision for faster training. **BERT**: Bidirectional Encoder Representations from Transformers.',
    more_information: 'For dataset creation details, see https://huggingface.co/datasets/acme/sentiment-combined. Training code available at https://github.com/acme-corp/training-scripts. Lessons learned blog post: https://acme.ai/blog/sentiment-model',
    model_card_authors: 'Jane Doe, John Smith',
    model_card_contact: 'ml-team@acme-corp.com',
  },
}

/**
 * Recursively merge user data with default data
 * User data takes precedence - only fills empty/undefined fields
 */
export function mergeWithDefaults(userData: any, defaultData: any = DEFAULT_MODEL_CARD_DATA): any {
  if (!userData || typeof userData !== 'object') {
    return defaultData
  }

  if (Array.isArray(userData)) {
    return userData.length > 0 ? userData : defaultData
  }

  const merged: any = { ...defaultData }

  for (const key in defaultData) {
    if (userData.hasOwnProperty(key)) {
      const userValue = userData[key]
      const defaultValue = defaultData[key]

      // Check if value is "empty" (null, undefined, empty string, empty object/array)
      const isEmpty = (val: any): boolean => {
        if (val === null || val === undefined || val === '') return true
        if (typeof val === 'object' && !Array.isArray(val)) {
          return Object.keys(val).length === 0
        }
        if (Array.isArray(val)) return val.length === 0
        return false
      }

      if (isEmpty(userValue)) {
        // User value is empty, use default
        merged[key] = defaultValue
      } else if (typeof userValue === 'object' && !Array.isArray(userValue) && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
        // Both are objects, merge recursively
        merged[key] = mergeWithDefaults(userValue, defaultValue)
      } else {
        // User has a value, use it
        merged[key] = userValue
      }
    }
  }

  return merged
}
