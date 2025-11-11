import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

interface AssistRequest {
  fieldName: string
  fieldDescription: string
  contextData: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

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

    const systemPrompt = `You are an expert assistant helping users fill out model cards for machine learning models. Model cards are structured documents that provide essential information about ML models, following the Google Model Card standard.

Your task is to suggest helpful, professional content for model card fields based on the context provided by the user.

Guidelines:
- Be concise but informative
- Use professional, technical language appropriate for ML documentation
- If the context is limited, provide a general template or example
- Include specific metrics, methodologies, or details when applicable
- For bias and fairness fields, be thorough and highlight important considerations
- Format your response as plain text that can be directly used in the field`

    const userPrompt = `Please help me fill in the following field for my model card:

Field: ${fieldName}
Description: ${fieldDescription}

Current model card information:
${contextString || 'No information provided yet.'}

Please suggest appropriate content for the "${fieldName}" field based on this context. If there's not enough context, provide a helpful template or example that I can customize.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const suggestion = completion.choices[0]?.message?.content || 'Unable to generate suggestion.'

    return NextResponse.json({ suggestion })
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate suggestion' },
      { status: 500 }
    )
  }
}
