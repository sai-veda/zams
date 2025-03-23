import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';

export function Chat() {
  return (
    <div className="w-full flex flex-col">
      <ChatMessages />
      
      <ChatInput />
    </div>
  );
} 