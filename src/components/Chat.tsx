import { useState } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { ChatMessage } from '@/lib/groq';

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  return (
    <div className="w-full flex flex-col">
      <ChatMessages 
        messages={messages} 
        streamingResponse={streamingResponse} 
        isLoading={isLoading} 
      />
      
      <ChatInput 
        messages={messages}
        setMessages={setMessages}
        streamingResponse={streamingResponse}
        setStreamingResponse={setStreamingResponse}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
} 