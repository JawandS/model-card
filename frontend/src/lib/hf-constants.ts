/**
 * HuggingFace Constants for Model Card Metadata
 *
 * Reference: https://huggingface.co/docs/hub/model-cards
 * Tasks: https://github.com/huggingface/huggingface.js/blob/main/packages/tasks/src/tasks/index.ts
 */

/**
 * Common ML Library/Framework Names
 * Used for the library_name field in YAML frontmatter
 */
export const LIBRARY_NAMES = [
  { value: 'transformers', label: 'Transformers (HuggingFace)' },
  { value: 'diffusers', label: 'Diffusers (HuggingFace)' },
  { value: 'pytorch', label: 'PyTorch' },
  { value: 'tensorflow', label: 'TensorFlow' },
  { value: 'keras', label: 'Keras' },
  { value: 'jax', label: 'JAX' },
  { value: 'sentence-transformers', label: 'Sentence Transformers' },
  { value: 'spacy', label: 'spaCy' },
  { value: 'sklearn', label: 'scikit-learn' },
  { value: 'fastai', label: 'FastAI' },
  { value: 'paddlenlp', label: 'PaddleNLP' },
  { value: 'open_clip', label: 'OpenCLIP' },
  { value: 'stable-baselines3', label: 'Stable Baselines3' },
  { value: 'ml-agents', label: 'ML-Agents' },
  { value: 'peft', label: 'PEFT' },
  { value: 'adapter-transformers', label: 'Adapter Transformers' },
  { value: 'speechbrain', label: 'SpeechBrain' },
  { value: 'timm', label: 'timm' },
  { value: 'tensorboard', label: 'TensorBoard' },
  { value: 'onnx', label: 'ONNX' },
] as const;

/**
 * Official HuggingFace Pipeline Tags (Task Identifiers)
 * Grouped by category for better UX
 */
export const PIPELINE_TAGS_GROUPS = [
  {
    category: 'Natural Language Processing',
    tasks: [
      { value: 'text-classification', label: 'Text Classification' },
      { value: 'token-classification', label: 'Token Classification' },
      { value: 'table-question-answering', label: 'Table Question Answering' },
      { value: 'question-answering', label: 'Question Answering' },
      { value: 'zero-shot-classification', label: 'Zero-Shot Classification' },
      { value: 'translation', label: 'Translation' },
      { value: 'summarization', label: 'Summarization' },
      { value: 'feature-extraction', label: 'Feature Extraction' },
      { value: 'text-generation', label: 'Text Generation' },
      { value: 'text2text-generation', label: 'Text-to-Text Generation' },
      { value: 'fill-mask', label: 'Fill Mask' },
      { value: 'sentence-similarity', label: 'Sentence Similarity' },
      { value: 'text-to-speech', label: 'Text-to-Speech' },
      { value: 'text-to-audio', label: 'Text-to-Audio' },
      { value: 'text-ranking', label: 'Text Ranking' },
      { value: 'text-retrieval', label: 'Text Retrieval' },
      { value: 'multiple-choice', label: 'Multiple Choice' },
    ],
  },
  {
    category: 'Computer Vision',
    tasks: [
      { value: 'image-classification', label: 'Image Classification' },
      { value: 'object-detection', label: 'Object Detection' },
      { value: 'image-segmentation', label: 'Image Segmentation' },
      { value: 'image-to-image', label: 'Image-to-Image' },
      { value: 'image-to-text', label: 'Image-to-Text' },
      { value: 'image-feature-extraction', label: 'Image Feature Extraction' },
      { value: 'unconditional-image-generation', label: 'Unconditional Image Generation' },
      { value: 'depth-estimation', label: 'Depth Estimation' },
      { value: 'mask-generation', label: 'Mask Generation' },
      { value: 'keypoint-detection', label: 'Keypoint Detection' },
      { value: 'zero-shot-image-classification', label: 'Zero-Shot Image Classification' },
      { value: 'zero-shot-object-detection', label: 'Zero-Shot Object Detection' },
      { value: 'image-to-3d', label: 'Image-to-3D' },
    ],
  },
  {
    category: 'Audio',
    tasks: [
      { value: 'audio-classification', label: 'Audio Classification' },
      { value: 'audio-to-audio', label: 'Audio-to-Audio' },
      { value: 'automatic-speech-recognition', label: 'Automatic Speech Recognition' },
      { value: 'voice-activity-detection', label: 'Voice Activity Detection' },
    ],
  },
  {
    category: 'Multimodal',
    tasks: [
      { value: 'text-to-image', label: 'Text-to-Image' },
      { value: 'text-to-video', label: 'Text-to-Video' },
      { value: 'text-to-3d', label: 'Text-to-3D' },
      { value: 'image-text-to-text', label: 'Image-Text-to-Text' },
      { value: 'visual-question-answering', label: 'Visual Question Answering' },
      { value: 'document-question-answering', label: 'Document Question Answering' },
      { value: 'image-to-video', label: 'Image-to-Video' },
      { value: 'video-classification', label: 'Video Classification' },
      { value: 'video-to-video', label: 'Video-to-Video' },
      { value: 'video-text-to-text', label: 'Video-Text-to-Text' },
      { value: 'visual-document-retrieval', label: 'Visual Document Retrieval' },
      { value: 'audio-text-to-text', label: 'Audio-Text-to-Text' },
      { value: 'any-to-any', label: 'Any-to-Any' },
    ],
  },
  {
    category: 'Structured Data',
    tasks: [
      { value: 'tabular-classification', label: 'Tabular Classification' },
      { value: 'tabular-regression', label: 'Tabular Regression' },
      { value: 'tabular-to-text', label: 'Tabular-to-Text' },
      { value: 'table-to-text', label: 'Table-to-Text' },
      { value: 'time-series-forecasting', label: 'Time Series Forecasting' },
    ],
  },
  {
    category: 'Specialized',
    tasks: [
      { value: 'reinforcement-learning', label: 'Reinforcement Learning' },
      { value: 'robotics', label: 'Robotics' },
      { value: 'graph-ml', label: 'Graph ML' },
      { value: 'other', label: 'Other' },
    ],
  },
] as const;

/**
 * Flattened list of all pipeline tags for search/validation
 */
export const ALL_PIPELINE_TAGS = PIPELINE_TAGS_GROUPS.flatMap(group =>
  group.tasks.map(task => task.value)
);

/**
 * Common License Identifiers
 * Used for the license field in YAML frontmatter
 */
export const LICENSE_IDENTIFIERS = [
  { value: 'apache-2.0', label: 'Apache 2.0' },
  { value: 'mit', label: 'MIT' },
  { value: 'bsd-3-clause', label: 'BSD 3-Clause' },
  { value: 'bsd-2-clause', label: 'BSD 2-Clause' },
  { value: 'gpl-3.0', label: 'GPL 3.0' },
  { value: 'lgpl-3.0', label: 'LGPL 3.0' },
  { value: 'agpl-3.0', label: 'AGPL 3.0' },
  { value: 'cc-by-4.0', label: 'Creative Commons Attribution 4.0' },
  { value: 'cc-by-sa-4.0', label: 'Creative Commons Attribution Share Alike 4.0' },
  { value: 'cc-by-nc-4.0', label: 'Creative Commons Attribution Non Commercial 4.0' },
  { value: 'cc-by-nd-4.0', label: 'Creative Commons Attribution No Derivatives 4.0' },
  { value: 'cc0-1.0', label: 'Creative Commons Zero 1.0 (Public Domain)' },
  { value: 'openrail', label: 'OpenRAIL' },
  { value: 'openrail++', label: 'OpenRAIL++' },
  { value: 'bigscience-openrail-m', label: 'BigScience OpenRAIL-M' },
  { value: 'bigscience-bloom-rail-1.0', label: 'BigScience BLOOM RAIL 1.0' },
  { value: 'creativeml-openrail-m', label: 'CreativeML OpenRAIL-M' },
  { value: 'llama2', label: 'Llama 2 Community License' },
  { value: 'llama3', label: 'Llama 3 Community License' },
  { value: 'llama3.1', label: 'Llama 3.1 Community License' },
  { value: 'gemma', label: 'Gemma Terms of Use' },
  { value: 'other', label: 'Other (Custom License)' },
  { value: 'unknown', label: 'Unknown' },
] as const;
