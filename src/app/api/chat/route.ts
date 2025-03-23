import { generateChatCompletion, ChatMessage } from '@/lib/groq';
import { NextRequest } from 'next/server';
import { getStoredDatasources } from '@/lib/store-server';
import { Datasource } from '@/lib/store';

interface ChatRequestBody {
  messages: ChatMessage[];
  responseType?: 'concise' | 'detailed';
}

// Process datasources to extract analytics for the AI
function processDatasourceData(datasources: Datasource[]) {
  // Count by type
  const typeCount = datasources.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Count by status
  const statusCount = datasources.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Count by creator
  const creatorCount = datasources.reduce((acc, curr) => {
    acc[curr.createdBy] = (acc[curr.createdBy] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort by date (convert string dates to Date objects)
  const sortedByDate = [...datasources].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const latestDatasource = sortedByDate[0];
  const oldestDatasource = sortedByDate[sortedByDate.length - 1];
  
  // Create a formatted analytics object
  const analytics = {
    totalDatasources: datasources.length,
    byType: typeCount,
    byStatus: statusCount,
    byCreator: creatorCount,
    latest: latestDatasource,
    oldest: oldestDatasource
  };
  
  return {
    rawData: datasources,
    analytics
  };
}

// Function to create a streaming response
export async function POST(req: NextRequest) {
  try {
    const { messages, responseType = 'concise' } = await req.json() as ChatRequestBody;

    // Validate messages array
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or empty messages array' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get datasources for context
    const datasources = await getStoredDatasources();
    const processedData = processDatasourceData(datasources);

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
    }, responseType, processedData).then(async () => {
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
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 