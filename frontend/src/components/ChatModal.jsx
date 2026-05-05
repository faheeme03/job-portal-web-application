import React, { useState, useEffect, useRef, useContext } from 'react';
import { X, Send, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import SockJS from 'sockjs-client/dist/sockjs';
import { Stomp } from '@stomp/stompjs';

export default function ChatModal({ application, onClose }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 1. Fetch History
    api.get(`/messages/${application.id}`).then(res => {
      setMessages(res.data);
      scrollToBottom();
    }).catch(console.error);

    // 2. Connect WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    client.debug = () => {}; // disable debug spam
    
    client.connect({}, () => {
      client.subscribe(`/topic/chat/${application.id}`, (msg) => {
        const receivedMessage = JSON.parse(msg.body);
        setMessages(prev => [...prev, receivedMessage]);
        scrollToBottom();
      });
    }, (err) => {
      console.error("STOMP connection error:", err);
    });

    setStompClient(client);

    return () => {
      if (client.connected) {
        client.disconnect();
      }
    };
  }, [application.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Send via REST endpoint which broadcasts via WS
      await api.post(`/messages/${application.id}`, { content: newMessage });
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const otherPersonName = user.role === 'ROLE_EMPLOYER' ? application.user.name : application.job.employer?.name || "Missing Name";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg h-[600px] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10">
        
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 flex justify-between items-center z-10 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <UserIcon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{otherPersonName}</h3>
              <p className="text-indigo-200 text-xs">Application: {application.job.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-indigo-700 p-2 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-10 text-sm">
              No messages yet. Send the first message!
            </div>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.sender.id === user.id;
            return (
              <div key={msg.id || i} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'}`}>
                  {msg.content}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSendMessage} className="flex gap-2 relative">
            <input 
              type="text" 
              placeholder="Type a message..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-full px-5 py-3 pr-12 outline-none transition-all"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="absolute right-1 top-1 bottom-1 w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
