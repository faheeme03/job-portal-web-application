import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Chatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: "Hi! Let's find your dream job. To get started, could you tell me your area of interest (e.g., IT, Healthcare) and your preferred city or country?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.post('/chatbot/query', {
        message: userMessage
      });
      
      const { reply, matchedJobIds } = response.data;
      
      setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: reply }]);
      
      if (matchedJobIds && Array.isArray(matchedJobIds) && matchedJobIds.length > 0) {
        navigate('/jobs', { state: { matchedJobIds } });
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'bot', 
        text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-indigo-600 text-white shadow-2xl hover:bg-indigo-700 hover:scale-110 hover:rotate-12 transition-all z-50 animate-bounce ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <MessageCircle size={32} />
          <div className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse border-2 border-indigo-600">
            AI
          </div>
        </div>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-full max-w-[380px] h-[550px] max-h-[85vh] bg-white/90 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col z-50 transition-all duration-500 origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 pointer-events-none translate-y-10'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-700 p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
              <Sparkles size={20} className="text-indigo-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg flex items-center gap-2">
                Job Match AI <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest">Beta</span>
              </h3>
              <p className="text-indigo-200 text-xs font-medium">Ask me to filter jobs for you</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Layout */}
        <div className="flex-1 overflow-y-auto p-5 pb-2 scroll-smooth bg-slate-50/50 flex flex-col gap-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-start gap-3 max-w-[88%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm
                ${msg.sender === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'}`}
              >
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div 
                className={`p-3.5 rounded-2xl text-sm font-medium shadow-sm leading-relaxed
                  ${msg.sender === 'user' 
                    ? 'bg-slate-800 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3 max-w-[85%] self-start">
              <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-sm">
                <Bot size={16} />
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-sm flex gap-1.5 items-center shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form 
            onSubmit={handleSend}
            className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-full border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-inner"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., Find backend jobs..."
              className="flex-1 bg-transparent px-4 py-2 outline-none text-slate-700 text-sm font-medium placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white p-2.5 rounded-full transition-colors flex items-center justify-center shrink-0"
            >
              <Send size={18} className="translate-x-[1px]" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
