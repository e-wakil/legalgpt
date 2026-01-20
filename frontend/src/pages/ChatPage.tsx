import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.ts';

//sections
import SidebarSection from '../sections/chat/SidebarSection.tsx';
import MessageInterfaceSection from '../sections/chat/MessageInterfaceSection.tsx';

interface Chat {
    id: string;
    title: string;
    created_at: Date;
}

const ChatInterface: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [chats, setChats] = useState<Chat[]>([
        // { id: '1767622125527_cmna1m37x', title: 'Property Dispute Query', timestamp: new Date(Date.now() - 3600000) },
        // { id: '1767622125527_kkoc3ni29', title: 'Marriage Registration Process', timestamp: new Date(Date.now() - 86400000) },
        // { id: '1767622125527_kmcl1mni7', title: 'Business Registration Steps', timestamp: new Date(Date.now() - 86400000) },
    ]);

    useEffect(() => {
        const fetchConversation = async () => {
            const response = await axiosInstance.get('/chat/conversations');
            console.log(response.data)
            setChats(response.data)
        }
        fetchConversation();
    }, [])
    // console.log(chats);


    return (
        <div className="flex h-screen bg-white">
            {/* sidebar */}
            <SidebarSection sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                chats={chats}
                setChats={setChats}
            />

            {/* Message Interface Section */}
            <MessageInterfaceSection
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                chats={chats}
                setChats={setChats}
            />
        </div>
    );
};

export default ChatInterface;