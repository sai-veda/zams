import { useAppStore } from '@/lib/store';

export function ChatSuggestions() {
  const { messages, addMessage, setIsLoading, isLoading } = useAppStore();
  
  // Only show suggestions when there are no messages and not currently loading
  if (messages.length > 0 || isLoading) {
    return null;
  }
  
  const handleSuggestionClick = (suggestion: string) => {
    // Add the suggestion as a user message
    addMessage({ role: 'user', content: suggestion });
    // Trigger the loading state (the ChatInput component will handle the rest)
    setIsLoading(true);
  };
  
  const suggestions = [
    "How many datasources are available?",
    "Show me all PDF files in the system",
    "Who created the most datasources?",
    "What's the latest datasource added?",
    "How many files are connected vs uploaded?"
  ];
  
  return (
    <div className="w-full mb-6">
      <p className="text-sm text-[#667085] mb-3 font-normal" style={{ fontFamily: "var(--font-inter)" }}>
        Try asking about your datasources:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-3 py-2 bg-[#F9FAFB] hover:bg-[#F2F4F7] border border-[#E4E7EC] rounded-md text-sm transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
} 