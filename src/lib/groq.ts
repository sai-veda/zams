import { OpenAI } from 'openai';

// Initialize the OpenAI compatible client with Groq API key
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateChatCompletion(
  messages: ChatMessage[],
  streamCallback?: (chunk: string) => void,
  responseType: 'concise' | 'detailed' = 'concise'
) {
  // Add a system message to ensure proper markdown formatting
  const systemMessage: ChatMessage = {
    role: 'system',
    content: `Please provide well-formatted responses. For any code snippets, JSON examples, or technical content, always wrap them in triple backticks (\`\`\`) with the appropriate language identifier. For example:

\`\`\`javascript
console.log('Hello world');
\`\`\`

or

\`\`\`json
{"key": "value"}
\`\`\`

${responseType === 'detailed' ? 'Provide detailed, thorough explanations with examples where helpful.' : 'Keep responses concise and to the point.'}`
  };

  // Place the system message at the beginning
  const messagesWithSystem = [systemMessage, ...messages];

  try {
    if (streamCallback) {
      // Handle streaming case
      const stream = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: messagesWithSystem,
        stream: true,
      });

      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        streamCallback(content);
      }
      return fullResponse;
    } else {
      // Handle non-streaming case
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: messagesWithSystem,
        stream: false,
      });
      
      return completion.choices[0]?.message?.content || '';
    }
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw error;
  }
} 