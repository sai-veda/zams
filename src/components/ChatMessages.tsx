import React from 'react';
import { ChatMessage } from '@/lib/groq';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/atom-one-dark.css';

interface ChatMessagesProps {
  messages: ChatMessage[];
  streamingResponse: string;
  isLoading: boolean;
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
                : 'bg-[#F2F4F7] text-[#101828] markdown-wrapper'
            }`}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {message.role === 'user' ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <div className="markdown-wrapper">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre: ({ node, ...props }) => (
                      <pre className="bg-[#1E1E1E] rounded-md p-3 my-2 overflow-x-auto w-full" {...props} />
                    ),
                    code: ({ node, inline, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const language = match ? match[1] : '';
                      return !inline ? (
                        <div>
                          {language && <div className="text-xs text-[#999] mb-2">{language}</div>}
                          <code className="text-[#D4D4D4] font-mono text-sm" {...props}>
                            {children}
                          </code>
                        </div>
                      ) : (
                        <code className="bg-[rgba(0,0,0,0.05)] rounded px-1 py-0.5 font-mono text-sm" {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Render streaming response if applicable */}
      {streamingResponse && (
        <div className="flex justify-start">
          <div 
            className="max-w-[80%] px-4 py-3 rounded-xl bg-[#F2F4F7] text-[#101828] markdown-wrapper"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <div className="markdown-wrapper">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  pre: ({ node, ...props }) => (
                    <pre className="bg-[#1E1E1E] rounded-md p-3 my-2 overflow-x-auto w-full" {...props} />
                  ),
                  code: ({ node, inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    return !inline ? (
                      <div>
                        {language && <div className="text-xs text-[#999] mb-2">{language}</div>}
                        <code className="text-[#D4D4D4] font-mono text-sm" {...props}>
                          {children}
                        </code>
                      </div>
                    ) : (
                      <code className="bg-[rgba(0,0,0,0.05)] rounded px-1 py-0.5 font-mono text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {streamingResponse}
              </ReactMarkdown>
            </div>
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