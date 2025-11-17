import { Step } from 'react-joyride'

export const walkthroughSteps: Step[] = [
  {
    target: '[data-tour="ai-assist"]',
    content: 'Toggle AI assistance on/off to get smart suggestions for filling out text fields throughout the form.',
    disableBeacon: true,
    placement: 'bottom',
  },
  {
    target: '[data-tour="autofill"]',
    content: 'Click here to automatically fill empty fields with example data to see how a completed model card looks.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="export"]',
    content: 'When you\'re done, export your model card in multiple formats: JSON, PDF, Markdown, or HTML.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="preview-toggle"]',
    content: 'Show or hide the live preview panel on the right to see your documentation update in real-time.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="progress"]',
    content: 'Track your overall completion progress here. The percentage updates as you fill out fields.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="save-indicator"]',
    content: 'Your work is automatically saved to your browser\'s local storage. You won\'t lose your progress!',
    placement: 'bottom',
  },
  {
    target: '[data-tour="basic-info"]',
    content: 'Start here! Fill out the required Basic Information section including Model ID and summary.',
    placement: 'right',
  },
  {
    target: '[data-tour="model-details"]',
    content: 'Add detailed information about your model, including developers, type, and licensing.',
    placement: 'right',
  },
  {
    target: '[data-tour="preview-panel"]',
    content: 'See a live preview of your model card documentation. It updates automatically as you fill out the form.',
    placement: 'left',
  },
]
