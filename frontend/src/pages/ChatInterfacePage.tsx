import React, { useState, useEffect } from 'react';
import { Send, Plus, Search, MessageSquare, User, Bot, Menu, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';

//sections
import FirstMessageSection from '../sections/chat/FIrstMessageSection.tsx';
import MessageSection from '../sections/chat/MessageSection';

//images
import logo from '../assets/LegalGPT-Nepal.png'
//dummy datas
import testMessages from '../dummy/testmessages';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    chatId: string;
}

interface Chat {
    id: string;
    title: string;
    timestamp: Date;
}

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([ ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeChatId, setActiveChatId] = useState<string>('1')


    const [chats, setChats] = useState<Chat[]>([
        { id: '1', title: 'Property Dispute Query', timestamp: new Date(Date.now() - 3600000) },
        { id: '2', title: 'Marriage Registration Process', timestamp: new Date(Date.now() - 86400000) },
        { id: '3', title: 'Business Registration Steps', timestamp: new Date(Date.now() - 86400000) },
    ]);

    useEffect(() => {
        //function to fetch chat when activeChatId changes:
        const newMessages = testMessages.filter((test:any)=> test.chatId === activeChatId)
        if (newMessages[0])
            setMessages(newMessages[0].messages)
        else
            setMessages([])

    }, [activeChatId])

    //Handle sumbit prompt
    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            chatId: activeChatId,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        if(messages.length <1){
            setChats(prevChats =>
                prevChats.map((chat)=> chat.id == activeChatId ? {...chat, title:input}: chat)
            )
        }
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: `Thank you for your question regarding "${input}". Based on Nepal's legal framework, I can provide guidance on this matter. According to the relevant provisions in Nepal's Civil Code and Constitution, here are the key points you should know...`,
                sender: 'bot',
                chatId: activeChatId,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
            setIsTyping(false);
        }, 2000);
    };
    //filter search chats
    const filteredChats = chats.filter(chat =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //group chats by date
    const groupChatsByDate = (chats: Chat[]) => {
        const now = new Date();
        const today: Chat[] = [];
        const allChats: Chat[] = [];

        chats.forEach(chat => {
            const diffTime = now.getTime() - chat.timestamp.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays < 1) {
                today.push(chat);
            } else {
                allChats.push(chat);
            }
        });

        return { today, allChats };
    };
    const groupedChats = groupChatsByDate(filteredChats);

    //create new chat
    const openNewChat =()=>{
        // console.log(chats)
        const newChat: Chat= {
            id:'7',
            title:' ',
            timestamp: new Date()
        }
        setChats((prev)=> [...prev, newChat])
        setActiveChatId(newChat.id)
        
    }

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-primary-dark text-text h-full transition-all duration-300 flex flex-col`}>
                {/* Sidebar Content */}
                <div className="flex flex-col h-full">
                    <div className='w-full flex px-4 items-center mt-4 gap-4'>
                        <img src={logo} className='w-8 h-8 rounded-xl' />
                        {sidebarOpen && <span className="font-bold truncate">Legal GPT</span>}
                    </div>
                    {/* New Chat Button */}
                    <div className="p-2 border-b border-gray-800"
                    onClick={()=> openNewChat()}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition text-sm">
                            <Plus className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="font-medium truncate">New chat</span>}
                        </button>
                    </div>

                    {/* Search */}
                    {sidebarOpen && (
                        <div className="p-2">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-secondary/40 text-text placeholder-gray-400 py-2 pl-9 pr-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
                                />
                            </div>
                        </div>
                    )}

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
                        {sidebarOpen ? (
                            <>
                                {groupedChats.today.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 px-3 mb-1">Today</h3>
                                        <div className="space-y-1">
                                            {groupedChats.today.map((chat) => (
                                                <div
                                                    key={chat.id}
                                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition group flex items-center justify-between"
                                                    onClick={() => setActiveChatId(chat.id)}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-400" />
                                                        <span className="text-sm truncate">{chat.title}</span>
                                                    </div>
                                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {groupedChats.allChats.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 px-3 mb-1">All chats</h3>
                                        <div className="space-y-1">
                                            {groupedChats.allChats.map((chat) => (
                                                <div
                                                    key={chat.id}
                                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition group flex items-center justify-between"
                                                    onClick={() => setActiveChatId(chat.id)}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-400" />
                                                        <span className="text-sm truncate">{chat.title}</span>
                                                    </div>
                                                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}


                            </>
                        ) : (
                            // Collapsed view - show only icons
                            <div className="space-y-2">
                                <div className='w-full p-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center'
                                    onClick={() => setSidebarOpen(true)}>
                                    <Search className='"w-5 h-5 text-gray-400' />
                                </div>
                                {[...groupedChats.today, ...groupedChats.allChats].slice(0, 8).map((chat) => (

                                    <button
                                        key={chat.id}
                                        className="w-full p-3 rounded-lg hover:bg-gray-800 transition flex items-center justify-center"
                                        title={chat.title}
                                        onClick={() => setSidebarOpen(true)}
                                    >
                                        <MessageSquare className="w-5 h-5 text-gray-400" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Profile Section at Bottom */}
                    <div className="border-t border-gray-800 p-2">
                        <button className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-secondary transition">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            {sidebarOpen && (
                                <>
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">User Account</p>
                                    </div>
                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

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

                {/* Messages Area */}
                {
                    messages.length > 0 ? <MessageSection messages={messages} isTyping={isTyping} />
                    :
                    <FirstMessageSection />
                }


                {/* Input Area */}
                <div className="border-t border-gray-200 bg-white px-4 pt-4 pb-2">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1 bg-gray-50 rounded-3xl border border-gray-200 focus-within:border-primary focus-within:shadow-sm transition">
                                <input
                                    type="text"
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
        </div>
    );
};

export default ChatInterface;