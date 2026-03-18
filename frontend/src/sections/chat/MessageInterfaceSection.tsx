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
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus();

        // RETURN SELECT CHAT PAGE
        if (!chatId) return;

        const fetchMessages = async () => {
            const response = await axiosInstance.get(`/chat/${chatId}/messages`)
            // console.log(response.data)
            setMessages(response.data)
        }
        fetchMessages();
    }, [chatId])
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState<boolean>(false);

    // console.log(messages)

    //Handle sumbit prompt
    const handleSend = async () => {
        if (!input.trim()) return;
        try {
            const userMessage: Message = {
                id: Date.now().toString(),
                content: input,
                role: 'user',
                chatId: chatId || '1',
                created_at: new Date(),
                citations: []
            };
            setMessages(prev => [...prev, userMessage]);
            // console.log(userMessage)
            setIsTyping(true);

        } catch (err) {
            console.log('error', err)
        }

        setTimeout(async () => {
            const response = await axiosInstance.post('/chat/', {
                message: input,
                conversation_id: chatId
            })
            console.log(response)
            navigate(`/chat/${response.data.conversation_id}`)
            // setChats(prev => [...prev, { id: response.data.conversation_id, title: input, created_at: new Date(Date.now()) }])
            setMessages(prev => [...prev, response.data.message]);
            setInput('')
            setIsTyping(false);
        }, 2000);
    };


    return (<>
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-gray-600 hover:text-gray-900 transition p-2 hover:bg-gray-100 rounded-lg"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-dark rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-text" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-primary-dark">LegalGPT Nepal</h1>
                    </div>
                </div>
            </div>

<<<<<<< HEAD
            {/* Messages Area */}
            {
                messages.length > 0 ? <MessageSection messages={messages} isTyping={isTyping} />
                    :
                    <FirstMessageSection />
            }
=======
            {messages.length > 0 ? (
                <MessageSection messages={messages} isTyping={isTyping} />
            ) : (
                <FirstMessageSection setInput={setInput} />
            )}
>>>>>>> 4ab5a8a (home pages + chat delte logout rename implementation)


            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white px-4 pt-4 pb-2">
                <div className="max-w-3xl mx-auto">
                    <div className="flex gap-3 items-end">
                        <div className="flex-1 bg-gray-50 rounded-3xl border border-gray-200 focus-within:border-primary focus-within:shadow-sm transition">
                            <input
                                type="text"
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                placeholder="Ask about Nepal's laws, regulations, legal procedures..."
                                className="w-full px-5 py-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 text-[15px]"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className={`p-3 rounded-full transition flex items-center justify-center ${input.trim()
                                ? 'bg-primary-dark hover:bg-primary text-white'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                        LegalGPT can make mistakes. Please verify important information.
                    </p>
                </div>
            </div>
        </div>
    </>
    )
}

export default MessageInterfaceSection