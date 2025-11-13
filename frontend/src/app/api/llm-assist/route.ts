import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface AssistRequest {
  fieldName: string
  fieldDescription: string
  contextData: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const body: AssistRequest = await request.json()
    const { fieldName, fieldDescription, contextData } = body

    // Build context from existing form data
    const contextString = Object.entries(contextData)
      .filter(([_, value]) => value && value !== '')
      .map(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          return `${key}: ${JSON.stringify(value, null, 2)}`
        }
        return `${key}: ${value}`
      })
      .join('\n')

    const systemPrompt = `You are an expert assistant helping users fill out model cards for machine learning models following the HuggingFace Model Card standard.

Model cards are structured Markdown documents that provide essential information about ML models. The HuggingFace standard includes these main sections:
- Model Details (description, developers, model type, license, base model)
- Model Sources (repository, paper, demo links)
- Uses (direct use, downstream use, out-of-scope use)
- Bias, Risks, and Limitations (analysis and recommendations)
- Training Details (training data, preprocessing, hyperparameters)
- Evaluation (testing data, metrics, results)
- Environmental Impact (hardware, compute time, CO2)
- Technical Specifications (architecture, infrastructure, requirements)
- Citation (BibTeX, APA)
- Additional Information (glossary, contact info)

Guidelines for generating content:
- Be concise but informative (2-4 sentences for most fields)
- Use professional, technical language appropriate for ML documentation
- Include specific metrics, methodologies, or details when applicable
- For bias and fairness fields, be thorough and highlight important considerations
- For code fields, use proper syntax and realistic examples
- For citation fields, follow standard academic formats
- Format as plain text suitable for Markdown (use bullet points, code blocks where appropriate)
- If context is limited, provide a general template that users can customize

Output ONLY the suggested content without any meta-commentary or explanations.`

    const userPrompt = `Please help me fill in the following field for my model card:

Field: ${fieldName}
Description: ${fieldDescription}

Current model card information:
${contextString || 'No information provided yet.'}

Generate appropriate content for the "${fieldName}" field based on this context. If there's insufficient context, provide a helpful template or example.`

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    })

    const response = result.response
    const suggestion = response.text() || 'Unable to generate suggestion.'

    return NextResponse.json({ suggestion })
  } catch (error: any) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate suggestion' },
      { status: 500 }
    )
  }
}
