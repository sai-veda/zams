import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { useAppStore } from '@/lib/store';

export function Chat() {
  return (
    <div className="w-full flex flex-col">
      <ChatMessages />
      
      <ChatInput />
    </div>
  );
} 