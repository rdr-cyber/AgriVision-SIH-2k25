# Gemini API Integration

This document explains how to use the Gemini API integration in your project.

## Setup

1. The Gemini API key is stored in the `.env` file as `GEMINI_API_KEY`
2. The key is automatically loaded by the Genkit configuration
3. Two approaches are provided for using the API:

## Approach 1: Direct Genkit Usage (Client Component)

In client components, you can directly use the Genkit instance:

```typescript
'use client';
import { ai } from '@/ai/genkit';

const result = await ai.generate({
  prompt: 'Your prompt here',
  model: 'googleai/gemini-2.5-flash',
});
```

## Approach 2: API Route (Server-side)

For server-side usage, we provide an API route at `/api/gemini`:

```typescript
const res = await fetch('/api/gemini', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ prompt: 'Your prompt here' }),
});
```

## Security

- The API key is stored in environment variables and never exposed to the client
- The `.env` file is included in `.gitignore` to prevent accidental commits
- Only server-side code should access the API key directly

## Testing

1. Start the development server: `npm run dev`
2. Visit `/gemini-demo` to test both approaches
3. Enter a prompt and see the Gemini API response

## Usage in Your Own Components

To use the Gemini API in your own components:

1. Import the Genkit instance: `import { ai } from '@/ai/genkit';`
2. Call the generate method with your prompt
3. Handle the response appropriately

Example:
```typescript
import { ai } from '@/ai/genkit';

const MyComponent = async () => {
  const result = await ai.generate({
    prompt: 'Explain quantum computing in simple terms',
    model: 'googleai/gemini-2.5-flash',
  });
  
  return <div>{result.text}</div>;
};
```