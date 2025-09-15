import { ai } from '@/ai/genkit';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get AI response
    const result = await ai.generate({
      prompt: `You are an AI assistant for an herbal product verification platform called Agrivision. 
      The user has asked: "${message}"
      
      Provide a helpful, concise response. If the question is about platform features, explain:
      - For farmers: How to submit herb samples and track their status
      - For QC agents: How to review and approve samples
      - For manufacturers: How to create batches from approved samples
      - For consumers: How to verify product authenticity using QR codes
      - For admins: How to manage users and audit batches
      
      Keep responses friendly and informative. If you don't know the answer, suggest checking the documentation or contacting support.`,
      model: 'googleai/gemini-2.5-flash',
    });

    return NextResponse.json({ response: result.text });
  } catch (error) {
    console.error('Error calling AI:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}