import { useEffect, useState } from 'react'
//icons
import { Plus, Search, MessageSquare, User, MoreHorizontal } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
//images
import logo from '../../assets/LegalGPT-Nepal.png'
import useUserStore from '../../store/userStore';
import axiosInstance from '../../api/axiosInstance';



interface Chat {
    id: string;
    title: string;
    created_at: Date;
}
interface sidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
    chats: Chat[];
    setChats:  React.Dispatch<React.SetStateAction<Chat[]>>;
}

const SidebarSection = ({ sidebarOpen, setSidebarOpen, chats, setChats}: sidebarProps) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    //user
    const user= useUserStore(state => state.user)


    //create new chat
    const openNewChat = async() => {
        const response = await axiosInstance.post('/chat/conversations',{
            title: 'New Chat'
        })
        // console.log(response)
        setChats((prev) => [...prev, response.data])
    }

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
            const createdAt = new Date(chat.created_at);
            const diffTime = now.getTime() - createdAt.getTime();
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

    return (
        <>
            {/* Sidebar */}
            < div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-primary-dark text-text h-full transition-all duration-300 flex flex-col`
            }>
                {/* Sidebar Content */}
                < div className="flex flex-col h-full" >
                    <div className='w-full flex px-4 items-center mt-4 gap-4'>
                        <Link to='/'>
                            <img src={logo} className='w-8 h-8 rounded-xl' />
                        </Link>
                        {sidebarOpen && <span className="font-bold truncate">Legal GPT</span>}
                    </div>
                    {/* New Chat Button */}
                    <div className="p-2 border-b border-gray-800"
                        onClick={() => openNewChat()}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition text-sm">
                            <Plus className="w-5 h-5 flex-shrink-0" />
                            {sidebarOpen && <span className="font-medium truncate">New chat</span>}
                        </button>
                    </div>

                    {/* Search */}
                    {
                        sidebarOpen && (
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
                        )
                    }

                    {/* Chat History */}
                    <div className="flex-1 overflow-y-scroll no-scrollbar px-2 py-2 space-y-4">
                        {sidebarOpen ? (
                            <>
                                {groupedChats.today.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 px-3 mb-1">Today</h3>
                                        <div className="space-y-1">
                                            {groupedChats.today.map((chat: Chat) => (
                                                <div
                                                    key={chat.id}
                                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition group flex items-center justify-between"
                                                    onClick={() => navigate(`/chat/${chat.id}`)}
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
                                            {groupedChats.allChats.map((chat: Chat) => (
                                                <div
                                                    key={chat.id}
                                                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition group flex items-center justify-between"
                                                    onClick={() => navigate(`/chat/${chat.id}`)}
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
                                {/* <User className="w-5 h-5 text-white" /> */}
                                <img src={user?.profile}  className='w-5 h-5' />
                            </div>
                            {sidebarOpen && (
                                <>
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{user?.name}</p>
                                    </div>
                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                </>
                            )}
                        </button>
                    </div>
                </div >
            </div >
        </>
    )
}

export default SidebarSection