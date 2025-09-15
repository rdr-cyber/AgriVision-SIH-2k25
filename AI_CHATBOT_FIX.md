# AI Chatbot Fix Documentation

## Issue Description
The application was encountering a build error due to the `fs` module not being found:

```
Module not found: Can't resolve 'fs'
./node_modules/@google/generative-ai/dist/server/index.js (3:1)
```

This error occurred because the Google Generative AI library was trying to use Node.js-specific modules in the browser environment.

## Root Cause
The issue was caused by importing the Genkit AI instance directly in the client-side React component (`ai-chatbot.tsx`). The Genkit library depends on Node.js modules like `fs` which are not available in the browser environment.

## Solution Implemented

### 1. Created Server-Side API Route
Created a new API route at `src/app/api/chatbot/route.ts` that handles all AI interactions on the server side:

```typescript
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

    // Get AI response using Genkit (server-side)
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
```

### 2. Updated Client-Side Component
Modified the `ai-chatbot.tsx` component to call the API route instead of using the AI instance directly:

```typescript
// Call API route for AI response
const response = await fetch('/api/chatbot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ message: input }),
});

if (!response.ok) {
  throw new Error('Failed to get response from AI');
}

const data = await response.json();
// Use data.response as the AI message
```

## Benefits of This Approach

1. **Separation of Concerns**: AI processing happens on the server, UI rendering on the client
2. **Security**: API key remains secure on the server side
3. **Compatibility**: No more browser/server environment conflicts
4. **Scalability**: Can easily add rate limiting, caching, and other server-side features
5. **Error Handling**: Better error handling and logging on the server

## Files Modified

1. **New File**: `src/app/api/chatbot/route.ts` - Server-side API endpoint for AI interactions
2. **Modified**: `src/components/chatbot/ai-chatbot.tsx` - Updated to use fetch API instead of direct AI calls

## Testing

The fix has been tested and verified:
1. Application builds successfully without fs module errors
2. AI chatbot functionality works as expected
3. Messages are properly sent to the API and responses are displayed
4. Error handling works correctly

## Future Improvements

1. **Rate Limiting**: Add rate limiting to prevent API abuse
2. **Caching**: Implement caching for common questions
3. **Session Management**: Add conversation history persistence
4. **Analytics**: Track usage patterns for improvement