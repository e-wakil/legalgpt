// src/hooks/useChatWebSocket.ts
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseChatWSProps {
    chatId: string | undefined;
    onMessageReceived: (content: string) => void;
    onStreamStart: () => void;
    onStreamEnd: (fullContent: string) => void;
}

export const useChatWebSocket = ({ chatId, onMessageReceived, onStreamStart, onStreamEnd }: UseChatWSProps) => {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const fullContentRef = useRef("");

    useEffect(() => {
        if (!chatId) return;

        const token = localStorage.getItem('userToken');
        // Replace with your actual backend WS URL
        const wsUrl = `${import.meta.env.VITE_WS_URL}/chat/ws/${chatId}?token=${token}`;
        
        const socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("WebSocket Connected");
            setIsConnected(true);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'start') {
                fullContentRef.current = "";
                onStreamStart();
            } else if (data.type === 'content') {
                fullContentRef.current += data.content;
                onMessageReceived(data.content);
            } else if (data.type === 'end') {
                onStreamEnd(fullContentRef.current);
            } else if (data.type === 'error') {
                console.error("WS Error:", data.content);
            }
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log("WebSocket Disconnected");
        };

        return () => {
            socket.close();
        };
    }, [chatId]);

    const sendMessage = useCallback((message: string) => {
        if (socketRef.current && isConnected) {
            socketRef.current.send(JSON.stringify({ message }));
        } else {
            console.error("Socket not connected");
        }
    }, [isConnected]);

    return { sendMessage, isConnected };
};