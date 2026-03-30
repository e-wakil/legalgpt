//icons
import { Bot, User } from "lucide-react";
import { useEffect, useRef } from "react";

interface Citation {
  link: string;
  source: string;
}
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  created_at: Date;
  chatId: string;
  citations: Citation[]
}
interface MessageSectionProps {
  messages: Message[];
  isTyping: boolean;
}
const MessageSection = ({ messages, isTyping }: MessageSectionProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const createdAt = new Date
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])
  // console.log(messages)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-heading flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
              <div className={`rounded-2xl px-4 py-3 ${message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-900'}`}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
              <span className="text-xs text-gray-400 mt-1 px-1">
                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary-dark flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default MessageSection