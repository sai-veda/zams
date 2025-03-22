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
  streamCallback?: (chunk: string) => void
) {
  try {
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      stream: !!streamCallback,
    });

    // Handle streaming
    if (streamCallback) {
      let fullResponse = '';
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        streamCallback(content);
      }
      return fullResponse;
    } 
    
    // Handle non-streaming (fallback)
    const completion = await stream;
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating chat completion:', error);
    throw error;
  }
} 