import { OpenAI } from 'openai';
import { Datasource } from './store';

// Initialize the OpenAI compatible client with Groq API key
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ProcessedDatasourceData {
  rawData: Datasource[];
  analytics: {
    totalDatasources: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
    byCreator: Record<string, number>;
    latest: Datasource;
    oldest: Datasource;
  };
}

export async function generateChatCompletion(
  messages: ChatMessage[],
  streamCallback?: (chunk: string) => void,
  responseType: 'concise' | 'detailed' = 'concise',
  datasourceData?: ProcessedDatasourceData | Datasource[]
) {
  // Create datasource context if available
  let datasourceContext = '';
  
  if (datasourceData) {
    // Check if it's the processed data or just raw datasources
    if ('rawData' in datasourceData && 'analytics' in datasourceData) {
      // It's processed data
      const { rawData, analytics } = datasourceData;
      
      datasourceContext = `You have access to the following datasource information:

1. DATASOURCE ANALYTICS:
\`\`\`json
${JSON.stringify(analytics, null, 2)}
\`\`\`

2. RAW DATASOURCE DATA:
\`\`\`json
${JSON.stringify(rawData, null, 2)}
\`\`\`

You can answer questions about these datasources, such as:
- How many datasources are there (total: ${analytics.totalDatasources})
- What types of files are available and their counts
- Who created specific datasources and who created the most
- When datasources were created, including the latest and oldest
- The status distribution of datasources
- Any specific details about individual datasources

If asked about the datasources, always refer to this data and provide accurate information.
`;
    } else {
      // It's just an array of raw datasources
      datasourceContext = `You have access to the following datasources from the dashboard:

\`\`\`json
${JSON.stringify(datasourceData, null, 2)}
\`\`\`

You can answer questions about these datasources, such as:
- How many datasources are there
- What types of files are available
- Who created specific datasources
- When datasources were created
- The status of datasources

If asked about the datasources, always refer to this data and provide accurate information.
`;
    }
  }

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

${datasourceContext}

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