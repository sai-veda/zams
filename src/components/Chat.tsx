import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { ChatSuggestions } from './ChatSuggestions';

export function Chat() {
  return (
    <div className="w-full flex flex-col">
      <ChatSuggestions />
      <ChatMessages />
      
      <ChatInput />
    </div>
  );
} 