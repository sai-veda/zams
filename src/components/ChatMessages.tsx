import React from 'react';
import { ChatMessage } from '@/lib/groq';

interface ChatMessagesProps {
  messages: ChatMessage[];
  streamingResponse: string;
  isLoading: boolean;
}

// Function to parse and format code blocks
function formatMessageContent(content: string): React.ReactNode {
  // Check if message contains code blocks
  if (!content.includes('```')) {
    return content;
  }

  const parts = [];
  let lastIndex = 0;
  
  // Special handling for incomplete code blocks (during streaming)
  let codeBlocksCount = (content.match(/```/g) || []).length;
  
  // If odd number of ``` markers, there's an unclosed code block
  if (codeBlocksCount % 2 !== 0) {
    // Handle the case where we're in the middle of a code block stream
    const startIndex = content.lastIndexOf('```');
    
    if (startIndex !== -1) {
      // Process the content before the last code block marker normally
      const contentBeforeLastBlock = content.substring(0, startIndex);
      const processedParts = processCompleteCodeBlocks(contentBeforeLastBlock);
      parts.push(...processedParts);
      
      // Extract the language if it exists
      const afterBackticks = content.substring(startIndex + 3);
      const newlineIndex = afterBackticks.indexOf('\n');
      let language = '';
      let code = afterBackticks;
      
      if (newlineIndex !== -1) {
        language = afterBackticks.substring(0, newlineIndex).trim();
        code = afterBackticks.substring(newlineIndex + 1);
      }
      
      // Add the incomplete code block with proper styling
      parts.push(
        <pre key="incomplete-code" className="bg-[#1E1E1E] rounded-md p-3 my-2 overflow-x-auto w-full">
          <code className="text-[#D4D4D4] font-mono text-sm">
            {language && <div className="text-xs text-[#999] mb-2">{language}</div>}
            {code}
          </code>
        </pre>
      );
      
      return parts;
    }
  }
  
  // Process complete code blocks
  return processCompleteCodeBlocks(content);
}

// Helper function to process complete code blocks
function processCompleteCodeBlocks(content: string): React.ReactNode[] {
  const parts = [];
  let lastIndex = 0;
  
  // Regular expression to match code blocks
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex, match.index)}</span>);
    }

    // Extract language and code
    const language = match[1] || 'text';
    const code = match[2];

    // Add code block with proper styling
    parts.push(
      <pre key={`code-${match.index}`} className="bg-[#1E1E1E] rounded-md p-3 my-2 overflow-x-auto w-full">
        <code className="text-[#D4D4D4] font-mono text-sm">
          {language && <div className="text-xs text-[#999] mb-2">{language}</div>}
          {code}
        </code>
      </pre>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add any remaining text after the last code block
  if (lastIndex < content.length) {
    parts.push(<span key={`text-${lastIndex}`}>{content.substring(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [content];
}

export function ChatMessages({ messages, streamingResponse, isLoading }: ChatMessagesProps) {
  // Reference to scroll to bottom when new messages arrive
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    // Smooth scrolling with a cleaner animation
    if (messagesEndRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const currentScroll = container.scrollTop + container.clientHeight;
      
      // Only auto-scroll if user is already near the bottom
      if (scrollHeight - currentScroll < 100 || messages.length <= 1) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end' 
        });
      }
    }
  }, [messages, streamingResponse]);
  
  // No messages to display
  if (messages.length === 0 && !streamingResponse) {
    return null;
  }
  
  return (
    <div 
      ref={messagesContainerRef}
      className="w-full overflow-y-auto max-h-[60vh] mb-6 space-y-4 px-1 scrollbar-thin scrollbar-thumb-[#E4E7EC] scrollbar-track-transparent"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Render all completed messages */}
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[80%] px-4 py-3 rounded-xl ${
              message.role === 'user' 
                ? 'bg-black text-white' 
                : 'bg-[#F2F4F7] text-[#101828]'
            }`}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {formatMessageContent(message.content)}
          </div>
        </div>
      ))}
      
      {/* Render streaming response if applicable */}
      {streamingResponse && (
        <div className="flex justify-start">
          <div 
            className="max-w-[80%] px-4 py-3 rounded-xl bg-[#F2F4F7] text-[#101828]"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {formatMessageContent(streamingResponse)}
            {isLoading && (
              <span className="inline-block ml-1 animate-pulse">▋</span>
            )}
          </div>
        </div>
      )}
      
      {/* Empty div for scrolling to bottom */}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  );
} 