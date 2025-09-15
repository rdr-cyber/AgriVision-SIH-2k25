import GeminiDemo from '@/components/gemini-demo';
import GeminiApiDemo from '@/components/gemini-api-demo';

export default function GeminiDemoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Gemini API Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Direct Genkit Approach</h2>
          <GeminiDemo />
        </div>
        
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">API Route Approach</h2>
          <GeminiApiDemo />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to use:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Make sure your GEMINI_API_KEY is set in the .env file</li>
          <li>Start the development server with `npm run dev`</li>
          <li>Visit <a href="/gemini-demo" className="text-blue-600 hover:underline">/gemini-demo</a> to test both approaches</li>
          <li>The API key is securely stored in environment variables and never exposed to the client</li>
        </ul>
      </div>
    </div>
  );
}