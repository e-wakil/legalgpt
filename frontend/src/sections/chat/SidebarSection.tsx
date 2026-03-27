import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

//icons
import { Plus, Search, MessageSquare, SunMoon, MoreHorizontal, Pencil, Pin, Trash2, LogOut, Settings } from 'lucide-react';
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
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
}

interface PopupState {
    chatId: string | null;
    x: number;
    y: number;
}

const SidebarSection = ({ sidebarOpen, setSidebarOpen, chats, setChats }: sidebarProps) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [popup, setPopup] = useState<PopupState>({ chatId: null, x: 0, y: 0 });
    const popupRef = useRef<HTMLDivElement>(null);
    const [renameChatId, setRenameChatId] = useState<string | null>('')
    const [title, setTitle] = useState<string>('')
    const [deletePopUp, setDeletePopUp] = useState<string | null>(null)
    const [profilePopUp, setProfilePopUp] = useState<boolean>(false)
    const [logOutPopUp, setLogOutPopUp] = useState<boolean>(false)

    //user
    const user = useUserStore(state => state.user)
    const removeUser = useUserStore(state => state.removeUser)


    //create new chat
    const openNewChat = async () => {
        const response = await axiosInstance.post('/chat/conversations', {
            title: 'New Chat'
        })
        navigate(`/chat/${response.data.id}`)
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

    // Close popup on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setPopup({ chatId: null, x: 0, y: 0 });
                setDeletePopUp(null)
                setProfilePopUp(false)
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMoreClick = (e: React.MouseEvent, chatId: string) => {
        e.preventDefault();   // prevent NavLink navigation
        e.stopPropagation();  // prevent event bubbling

        // Toggle off if same chat
        if (popup.chatId === chatId) {
            setPopup({ chatId: null, x: 0, y: 0 });
            return;
        }

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setPopup({
            chatId,
            x: rect.right,
            y: rect.bottom,
        });
    };

    const handleRename = async (chatId: string) => {
        // TODO: implement rename logic
        setRenameChatId(chatId);
        const chat = chats.find(c => c.id === chatId)
        setTitle(chat?.title || '')
        setPopup({ chatId: null, x: 0, y: 0 });
    };
    //actual rename api call
    const sendRename = async () => {
        try {
            const response = await axiosInstance.patch(`/chat/conversations/${renameChatId}`, {
                title: title
            })
            if (response.status == 200) {
                console.log(response);
                setChats(prev => prev.map(item => item.id === renameChatId ? { ...item, title: response.data.title } : item))
            }

        } catch (err) {
            console.log('Error changing name: ', err)
        }
        setRenameChatId(null)
    }


    const handlePin = (chatId: string) => {
        // TODO: implement pin logic
        console.log('Pin chat:', chatId);
        setPopup({ chatId: null, x: 0, y: 0 });
    };

    const handleDelete = (chatId: string) => {
        // TODO: implement delete logic
        setDeletePopUp(chatId);
        setPopup({ chatId: null, x: 0, y: 0 });
    };
    //actual Delete api call
    const deleteChat = async (deleteChatId: string) => {
        try {
            await axiosInstance.delete(`/chat/conversations/${deleteChatId}`);
            const id = chats[0].id;
            navigate(`/chat/${id}`)
            setChats(prev => prev.filter(c => c.id !== deleteChatId));
            setDeletePopUp(null)

        }
        catch (err) {
            console.log('Error deleting conversation', err)
        }

    }

    const ChatItem = ({ chat, rename }: { chat: Chat, rename: boolean }) => (
        <NavLink
            key={chat.id}
            className={({ isActive }) =>
                `w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition group flex items-center justify-between ${isActive ? 'bg-secondary' : ''}`
            }
            to={`/chat/${chat.id}`}
        >

            <div className="flex items-center gap-3 flex-1 min-w-0">
                <MessageSquare className="w-4 h-4 flex-shrink-0 text-gray-400" />
                {rename ?
                    <input type='text'
                        className='outline-none border-none'
                        value={title} autoFocus
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={() => setRenameChatId(null)}
                        onKeyDown={(e) => e.key == 'Enter' && sendRename()}
                    /> :
                    <span className="text-sm truncate">{chat.title}</span>
                }
            </div>
            <button
                className={`opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition ${popup.chatId === chat.id ? 'opacity-100 bg-gray-700 rounded' : 'opacity-0'}`}
                onClick={(e) => handleMoreClick(e, chat.id)}
            >
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </NavLink>
    );

    //LOGOUT function

    //LOGOUT function
    const logOut = () => {
        googleLogout();
        localStorage.removeItem('userToken')
        removeUser();
        location.reload()
    }

    return (
        <>
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-primary-dark text-text h-full transition-all duration-300 flex flex-col`}>
                {/* Sidebar Content */}
                <div className="flex flex-col h-full">
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
                    <div className="flex-1 overflow-y-scroll no-scrollbar px-2 py-2 space-y-4">
                        {sidebarOpen ? (
                            <>
                                {groupedChats.today.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 px-3 mb-1">Today</h3>
                                        <div className="space-y-1">
                                            {groupedChats.today.map((chat: Chat) => (
                                                renameChatId === chat.id ?
                                                    <ChatItem key={chat.id} chat={chat} rename={true} /> :
                                                    <ChatItem key={chat.id} chat={chat} rename={false} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {groupedChats.allChats.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 px-3 mb-1">All chats</h3>
                                        <div className="space-y-1">
                                            {groupedChats.allChats.map((chat: Chat) => (
                                                renameChatId === chat.id ?
                                                    <ChatItem key={chat.id} chat={chat} rename={true} /> :
                                                    <ChatItem key={chat.id} chat={chat} rename={false} />
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
                        <button className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-secondary transition"
                            onClick={() => setProfilePopUp(!profilePopUp)}
                        >
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <img src={user?.profile} className='w-5 h-5' />
                            </div>
                            {sidebarOpen && (
                                <>
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{user?.name}</p>
                                    </div>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Popup Menu — rendered at root level to avoid clipping */}
            {popup.chatId && (
                <div
                    ref={popupRef}
                    style={{
                        position: 'fixed',
                        top: popup.y + 2,
                        left: popup.x - 16, // align to the right of the button, 160px wide
                        zIndex: 9999,
                    }}
                    className="w-40 bg-primary-dark border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
                >
                    <button
                        onClick={() => handleRename(popup.chatId!)}
                        className="w-full flex items-center gap-3 px-2 py-2.5 cursor-pointer text-sm text-gray-200 hover:bg-gray-600 transition"
                    >
                        <Pencil className="w-4 h-4 text-gray-400" />
                        Rename
                    </button>
                    <button
                        onClick={() => handlePin(popup.chatId!)}
                        className="w-full flex items-center gap-3 px-2 py-2.5 cursor-pointer text-sm text-gray-200 hover:bg-gray-600 transition"
                    >
                        <Pin className="w-4 h-4 text-gray-400" />
                        Pin
                    </button>
                    <div className="border-t border-gray-700/60" />
                    <button
                        onClick={() => handleDelete(popup.chatId!)}
                        className="w-full flex items-center gap-3 px-2 py-2.5 cursor-pointer text-sm text-red-400 hover:bg-gray-600 transition"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                </div>
            )}

            {/* Conform Delete Popup */}
            {deletePopUp && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    onClick={() => setPopup({ chatId: null, x: 0, y: 0 })}
                >
                    <div
                        ref={popupRef}
                        style={{
                            position: 'fixed',
                            top: '50vh',
                            left: '50vw',
                            transform: 'translate(-50%, -50%)',
                        }}
                        className="w-96 bg-primary-dark border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-7 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                    <Trash2 className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-text">Delete conversation?</p>
                                    <p className="text-sm text-gray-400 mt-0.5">This action cannot be undone.</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeletePopUp(null)}
                                    className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-secondary transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => deleteChat(deletePopUp)}
                                    className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Popup */}
            {
                profilePopUp && (
                    <div
                        ref={popupRef}
                        style={{
                            position: 'fixed',
                            bottom: '64px',
                            left: '10px', // align to the right of the button, 160px wide
                            zIndex: 9999,
                        }}
                        className="w-60 bg-primary-dark border-2 border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
                    >
                        <button
                            onClick={() => handleRename(popup.chatId!)}
                            className="w-full flex items-center gap-3 px-2 py-2.5 cursor-pointer text-sm text-gray-200 hover:bg-gray-600 transition"
                        >
                            <SunMoon className="w-4 h-4 text-gray-400" />
                            Switch to dark mode
                        </button>
                        <button
                            onClick={() => handlePin(popup.chatId!)}
                            className="w-full flex items-center gap-3 px-2 py-2.5 cursor-pointer text-sm text-gray-200 hover:bg-gray-600 transition"
                        >
                            <Settings className="w-4 h-4 text-gray-400" />
                            Settings
                        </button>
                        <div className="border-t border-gray-700/60" />
                        <button
                            className="w-full flex items-center gap-3 px-2 py-2.5 cursor-pointer text-sm text-red-400 hover:bg-gray-600 transition"
                            onClick={() => setLogOutPopUp(true)}
                        >
                            <LogOut className="w-4 h-4" />
                            Log Out
                        </button>
                    </div >
                )
            }

            {/* Conform Logout Popup */}
            {logOutPopUp && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                    onClick={() => setPopup({ chatId: null, x: 0, y: 0 })}
                >
                    <div
                        ref={popupRef}
                        style={{
                            position: 'fixed',
                            top: '50vh',
                            left: '50vw',
                            transform: 'translate(-50%, -50%)',
                        }}
                        className="w-96 bg-primary-dark border border-gray-700 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-7 flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                                    <LogOut className="w-5 h-5 text-red-400" />
                                </div>
                                <div>
                                    <p className="text-xl font-semibold text-text">Are you sure?</p>
                                    <p className="text-sm text-gray-400 mt-0.5">You will be logout and send to home page.</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setLogOutPopUp(false)}
                                    className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-secondary transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => logOut()}
                                    className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}

export default SidebarSection