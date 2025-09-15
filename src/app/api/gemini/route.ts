import { ai } from '@/ai/genkit';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // This uses the Genkit configuration which automatically picks up the GEMINI_API_KEY from environment variables
    const result = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.5-flash',
    });

    return NextResponse.json({ response: result.text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}