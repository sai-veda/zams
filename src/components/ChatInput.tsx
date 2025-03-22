import { useState, useRef, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ChatMessage } from '@/lib/groq';

interface ChatInputProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  streamingResponse: string;
  setStreamingResponse: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChatInput({
  messages,
  setMessages,
  streamingResponse,
  setStreamingResponse,
  isLoading,
  setIsLoading
}: ChatInputProps) {
  const [input, setInput] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const maxLength = 1000;

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Setup EventSource for streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      
      const decoder = new TextDecoder();
      let responseText = '';
      
      // Process the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            if (data === '[DONE]') {
              break;
            }
            
            try {
              const { content, error } = JSON.parse(data);
              if (error) {
                console.error('Stream error:', error);
                break;
              }
              
              if (content) {
                responseText += content;
                setStreamingResponse(responseText);
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }
      
      // Add final response to messages after streaming completes
      if (responseText) {
        setMessages(prev => [
          ...prev, 
          { role: 'assistant', content: responseText }
        ]);
        setStreamingResponse('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, setIsLoading, setMessages, setStreamingResponse]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full relative">
      <Input 
        ref={inputRef}
        type="text" 
        value={input}
        onChange={(e) => setInput(e.target.value.slice(0, maxLength))}
        onKeyDown={handleKeyDown}
        placeholder="Ask whatever you want.." 
        className="w-full px-4 pt-12 pb-28 text-base font-normal rounded-xl border border-[#E4E7EC] shadow-[0_1px_2px_0_rgba(10,13,18,0.05)] focus:outline-none focus:ring-0 focus:border-[#E4E7EC] focus-visible:ring-0"
        style={{ 
          fontFamily: "var(--font-inter)",
          color: "#667085",
          height: "calc(2 * (8px + 20px + 1em))" // Doubling the effective height
        }}
        disabled={isLoading}
      />
      
      {/* Response type dropdown with feather icon */}
      <div className="absolute left-4 bottom-4 flex items-center gap-1">
        <Image 
          src="/feather.svg" 
          alt="Feather" 
          width={16} 
          height={16} 
          className="mr-1"
          style={{ color: "#667085" }}
        />
        <span style={{ 
          fontFamily: "var(--font-inter)",
          fontWeight: 500,
          fontSize: "12px",
          lineHeight: "18px",
          letterSpacing: "0%",
          textAlign: "center",
          color: "#667085"
        }}>
          Response Type
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 7L8 10L11 7" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {/* Add attachment button */}
      <div className="absolute left-[170px] bottom-4 flex items-center gap-1">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7" stroke="#667085" strokeWidth="1.5"/>
          <path d="M8 5V11" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M5 8H11" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span style={{ 
          fontFamily: "var(--font-inter)",
          fontWeight: 500,
          fontSize: "12px",
          lineHeight: "18px",
          letterSpacing: "0%",
          textAlign: "center",
          color: "#667085"
        }}>
          Add Attachment
        </span>
      </div>
      
      {/* Character count */}
      <div className="absolute right-14 bottom-4" style={{ 
        fontFamily: "var(--font-inter)",
        fontWeight: 500,
        fontSize: "12px",
        lineHeight: "18px",
        letterSpacing: "0%",
        textAlign: "center",
        color: "#667085"
      }}>
        {input.length}/{maxLength}
      </div>
      
      {/* Submit button */}
      <button 
        className={`absolute right-4 bottom-3 bg-black text-white rounded-full p-1.5 ${isLoading ? 'opacity-50' : ''}`}
        onClick={handleSubmit}
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? (
          <svg className="animate-spin" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" strokeOpacity="0.25"/>
            <path d="M10 2C8.02219 2 6.08879 2.58649 4.4443 3.6853C2.79981 4.78412 1.51809 6.3459 0.761209 8.17317C0.00433284 10.0004 -0.193701 12.0111 0.192152 13.9509C0.578004 15.8907 1.53041 17.6725 2.92894 19.0711C4.32746 20.4696 6.10929 21.422 8.0491 21.8079C9.98891 22.1937 11.9996 21.9957 13.8268 21.2388C15.6541 20.4819 17.2159 19.2002 18.3147 17.5557C19.4135 15.9112 20 13.9778 20 12" stroke="white" strokeWidth="1.5"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 5L15 10L10 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </div>
  );
} 