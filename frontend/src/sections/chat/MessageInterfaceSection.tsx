import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
//icons
import { Send, Bot, Menu, } from 'lucide-react';
//sections
import FirstMessageSection from './FIrstMessageSection';
import MessageSection from './MessageSection';
//dummy datas
// import testMessages from '../../dummy/testmessages';
import axiosInstance from '../../api/axiosInstance';
import { useChatWebSocket } from '../../hooks/useChatWebSocket'; // Import the hook


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
interface Chat {
    id: string;
    title: string;
    created_at: Date;
}

interface messageInterfaceProps {
    sidebarOpen: boolean | true;
    setSidebarOpen: (value: boolean) => void;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}


const MessageInterfaceSection = ({ sidebarOpen, setSidebarOpen, setChats }: messageInterfaceProps) => {
    const { chatId } = useParams<{ chatId: string }>();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState<boolean>(false);

    // This ref helps us update the last message (the AI stream) in real-time
    const currentAiMessageRef = useRef<string>("");

    // 1. Initialize WebSocket Hook
    const { sendMessage, isConnected } = useChatWebSocket({
        chatId,
        onStreamStart: () => {
            setIsTyping(false); // Stop the "typing" bubbles
            // Add a placeholder message for the AI
            const newAiMsg: Message = {
                id: 'temp-ai',
                content: '',
                role: 'assistant',
                chatId: chatId!,
                created_at: new Date(),
                citations: []
            };
            setMessages(prev => [...prev, newAiMsg]);
            currentAiMessageRef.current = "";
        },
        onMessageReceived: (token) => {
            currentAiMessageRef.current += token;
            // Update the last message in the list with the new token
            setMessages(prev => {
                const newMessages = [...prev];
                const lastIndex = newMessages.length - 1;
                if (newMessages[lastIndex].role === 'assistant') {
                    newMessages[lastIndex] = { 
                        ...newMessages[lastIndex], 
                        content: currentAiMessageRef.current 
                    };
                }
                return newMessages;
            });
        },
        onStreamEnd: (fullContent) => {
            console.log("Stream finished");
            // Optionally refresh messages from DB to get real IDs/citations
        }
    });

    useEffect(() => {
        inputRef.current?.focus();
        if (!chatId) return;

        const fetchMessages = async () => {
            const response = await axiosInstance.get(`/chat/${chatId}/messages`);
            setMessages(response.data);
        };
        fetchMessages();
    }, [chatId]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // CASE 1: New Conversation (No Chat ID yet)
        if (!chatId) {
            setIsTyping(true);
            try {
                // First message must be sent via POST to create the conversation ID
                const response = await axiosInstance.post('/chat/', {
                    message: input,
                    conversation_id: null
                });
                const newId = response.data.conversation_id;
                
                // Update Sidebar
                setChats(prev => [{ id: newId, title: input, created_at: new Date() }, ...prev]);
                
                // Redirect - the WebSocket hook in the next page load will handle future messages
                navigate(`/chat/${newId}`);
                setInput('');
            } catch (err) {
                setIsTyping(false);
            }
            return;
        }

        // CASE 2: Existing Conversation (Use WebSocket)
        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
            chatId: chatId,
            created_at: new Date(),
            citations: []
        };
        
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true); // Show bubbles until first token arrives
        sendMessage(input); // SEND VIA WS
        setInput('');
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Header stays same */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-dark rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-text" />
                    </div>
                    <h1 className="text-lg font-semibold text-primary-dark">LegalGPT Nepal {isConnected ? "•" : "(connecting...)"}</h1>
                </div>
            </div>

            {messages.length > 0 ? (
                <MessageSection messages={messages} isTyping={isTyping} />
            ) : (
                <FirstMessageSection />
            )}

            <div className="border-t border-gray-200 bg-white px-4 pt-4 pb-2">
                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 bg-gray-50 rounded-3xl border border-gray-200">
                            <input
                                type="text"
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about Nepal's laws..."
                                className="w-full px-5 py-3 bg-transparent focus:outline-none"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || (chatId && !isConnected)}
                            className={`p-3 rounded-full ${input.trim() ? 'bg-primary-dark text-white' : 'bg-gray-200 text-gray-400'}`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageInterfaceSection;