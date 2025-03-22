import { generateChatCompletion, ChatMessage } from '@/lib/groq';
import { NextRequest } from 'next/server';

// Function to create a streaming response
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };

    // Set up the streaming response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start generating the chat completion with a callback for streaming
    generateChatCompletion(messages, async (chunk: string) => {
      // Write each chunk to the stream
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
      );
    }).then(async () => {
      // Signal end of stream
      await writer.write(encoder.encode(`data: [DONE]\n\n`));
      await writer.close();
    }).catch(async (error) => {
      // Handle errors
      console.error('Error in streaming response:', error);
      await writer.write(
        encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`)
      );
      await writer.close();
    });

    // Return the stream as a response
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Something went wrong' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 