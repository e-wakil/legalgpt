import React, {type FC} from "react";
import { NavLink } from "react-router-dom";
import { MessageSquare, MoreVertical, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import type {Chat} from "../../types";

interface ConversationProps {
    chat: Chat;
    onRenameClicked: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onDeleteClicked: (event: React.MouseEvent<HTMLButtonElement>, chatID: string) => void;
}

const Conversation: FC<ConversationProps> = ({ chat, onRenameClicked, onDeleteClicked }) => {
    const [conversationOptionsOpen, setConversationOptionsOpen] = useState(false);
    const [isConvActive, setIsConvActive] = useState(false);

    return (
        <NavLink
            key={chat.id}
            className={({ isActive }) => {
                setIsConvActive(!!isActive);
                return  `relative w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition group flex items-center justify-between ${isActive ? 'bg-secondary' : ''}`
            }}
            to={`/chat/${chat.id}`}
            onClick={() => {
                if (conversationOptionsOpen) setConversationOptionsOpen(false);
            }}
        >
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <MessageSquare className="w-4 h-4 shrink-0 text-gray-400" />
                <input type="text" name="conversation-title" id={`conversation-${chat.id}`} className="text-sm truncate" value={chat.title} readOnly />
            </div>
            <button
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition"
                onClick={() => setConversationOptionsOpen(prev => !prev)}
            >
                <MoreVertical className="w-4 h-4" />
            </button>
            {conversationOptionsOpen && isConvActive && (
            <div className="absolute right-0 top-10 bg-secondary rounded-lg shadow-lg z-10">
                <button className="flex w-full text-left px-4 py-2 text-sm hover:bg-gray-700" onClick={onRenameClicked}>
                    <Pencil className=" text-gray-400" /> 
                    <span className="ml-2">Rename</span>
                </button>
                <button className="flex w-full text-left px-4 py-2 text-sm hover:bg-gray-700" onClick={onDeleteClicked}>
                    <Trash className=" text-gray-400" />
                    <span className="ml-2">Delete</span>
                </button>
            </div>
            )}
        </NavLink>
    );
}

export default Conversation;