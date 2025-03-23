import { useState, useRef, useCallback, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { useAppStore } from '@/lib/store';
import { ChatMessage } from '@/lib/store';

export function ChatInput() {
  const {
    messages,
    addMessage,
    setStreamingResponse,
    isLoading,
    setIsLoading
  } = useAppStore();
  
  const [input, setInput] = useState<string>('');
  const [responseType, setResponseType] = useState<'concise' | 'detailed' | null>(null);
  const [showResponseTypeDropdown, setShowResponseTypeDropdown] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [lastProcessedMessageIndex, setLastProcessedMessageIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const maxLength = 1000;

  // Handle clicks outside dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResponseTypeDropdown(false);
      }
    }

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSubmitMessage = useCallback(async (content: string) => {
    if (!content.trim() && !file) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Upload file if present
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          throw new Error(error.message || 'Failed to upload file');
        }
      }
      
      // Reset UI state
      setInput('');
      setFile(null);
      
      // Create request body for chat
      const requestBody = {
        messages,
        responseType: responseType || 'concise' // Default to concise if not selected
      };
      
      // Setup streaming response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
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
              console.debug('Parse error on chunk, ignoring', e);
            }
          }
        }
      }
      
      // Add final response to messages after streaming completes
      if (responseText) {
        addMessage({ role: 'assistant', content: responseText });
        setStreamingResponse('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, setIsLoading, setStreamingResponse, file, responseType, addMessage]);
  
  // Handle automatic submission when loading is triggered externally
  useEffect(() => {
    // Only process if we're loading and have messages
    if (isLoading && messages.length > 0) {
      // Check if the last message is from user and not yet processed
      const currentIndex = messages.length - 1;
      const lastMessage = messages[currentIndex];
      
      if (lastMessage.role === 'user' && currentIndex > lastProcessedMessageIndex) {
        handleSubmitMessage(lastMessage.content);
        setLastProcessedMessageIndex(currentIndex);
      }
    }
  }, [isLoading, messages, lastProcessedMessageIndex, handleSubmitMessage]);

  const handleSubmit = useCallback(async () => {
    if ((!input.trim() && !file) || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = { 
      role: 'user', 
      content: input.trim() + (file ? `\n\n[Attached file: ${file.name}]` : '') 
    };
    
    // Add message and trigger loading state
    addMessage(userMessage);
    setIsLoading(true);
    
    // The rest will be handled by the useEffect that watches isLoading
  }, [input, isLoading, addMessage, setIsLoading, file]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
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
      
      {/* Responsive controls container */}
      <div className="absolute left-0 right-0 bottom-0 flex items-center px-4 pb-4 justify-between">
        {/* Left controls group */}
        <div className="flex items-center space-x-2">
          {/* Response type selector */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowResponseTypeDropdown(!showResponseTypeDropdown)}
              className="flex items-center gap-1"
              disabled={isLoading}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="#667085" strokeWidth="1.5"/>
                <path d="M8 4V8L11 10" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ 
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "11px",
                lineHeight: "16px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#667085"
              }}
                className="text-[11px] sm:text-xs"
              >
                {responseType === 'detailed' ? 'Detailed' : 'Concise'}
              </span>
            </button>
            
            {showResponseTypeDropdown && (
              <div className="absolute left-0 top-8 bg-white rounded-md shadow-md p-2 z-10 min-w-[100px] border border-[#E4E7EC]">
                <button
                  className={`w-full text-left px-2 py-1.5 rounded ${responseType === 'concise' ? 'bg-[#F9FAFB]' : ''}`}
                  style={{ 
                    fontFamily: "var(--font-inter)",
                    fontSize: "11px",
                    color: "#667085"
                  }}
                  onClick={() => {
                    setResponseType('concise');
                    setShowResponseTypeDropdown(false);
                  }}
                >
                  Concise
                </button>
                <button
                  className={`w-full text-left px-2 py-1.5 rounded ${responseType === 'detailed' ? 'bg-[#F9FAFB]' : ''}`}
                  style={{ 
                    fontFamily: "var(--font-inter)",
                    fontSize: "11px",
                    color: "#667085"
                  }}
                  onClick={() => {
                    setResponseType('detailed');
                    setShowResponseTypeDropdown(false);
                  }}
                >
                  Detailed
                </button>
              </div>
            )}
          </div>
          
          {/* Add attachment button */}
          <div className="flex items-center gap-1">
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleFileSelect}
              className="flex items-center gap-1"
              disabled={isLoading}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <circle cx="8" cy="8" r="7" stroke="#667085" strokeWidth="1.5"/>
                <path d="M8 5V11" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M5 8H11" stroke="#667085" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ 
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "11px",
                lineHeight: "16px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#667085"
              }}
                className="text-[11px] sm:text-xs"
              >
                {file ? file.name.substring(0, 10) + (file.name.length > 10 ? '...' : '') : 'Add Attachment'}
              </span>
            </button>
          </div>
        </div>
        
        {/* Right controls group */}
        <div className="flex items-center gap-2">
          {/* Character count */}
          <div style={{ 
            fontFamily: "var(--font-inter)",
            fontWeight: 500,
            fontSize: "11px",
            lineHeight: "16px",
            letterSpacing: "0%",
            textAlign: "center",
            color: "#667085"
          }}
            className="text-[11px] sm:text-xs"
          >
            {input.length}/{maxLength}
          </div>
          
          {/* Submit button */}
          <button 
            className={`bg-black text-white rounded-full p-1.5 flex-shrink-0 ${isLoading ? 'opacity-50' : ''}`}
            onClick={handleSubmit}
            disabled={isLoading || (!input.trim() && !file)}
          >
            {isLoading ? (
              <div className="flex items-center justify-center w-5 h-5">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle opacity="0.25" cx="12" cy="12" r="10" stroke="white" strokeWidth="3" />
                  <path 
                    d="M12 2C6.47715 2 2 6.47715 2 12" 
                    stroke="white" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 5L15 10L10 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* File preview - show if file is selected */}
      {file && (
        <div className="absolute left-4 bottom-10 bg-[#F9FAFB] px-2 py-1 rounded-md flex items-center gap-1 max-w-[80%] overflow-hidden">
          <span style={{ 
            fontFamily: "var(--font-inter)",
            fontSize: "11px",
            color: "#667085"
          }}
            className="truncate"
          >
            {file.name}
          </span>
          <button 
            onClick={() => setFile(null)}
            className="ml-1 text-[#667085] hover:text-[#101828] flex-shrink-0"
          >
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
} 