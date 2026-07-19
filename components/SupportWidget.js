'use client';
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { api } from '../lib/api';

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      api('/support/conversation').then((res) => setMessages(res.messages || [])).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send() {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', message: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api('/support/message', { method: 'POST', body: { message: userMsg.message } });
      setMessages((m) => [...m, { sender: 'ai', message: res.reply }]);
    } catch (e) {
      setMessages((m) => [...m, { sender: 'ai', message: 'Support is temporarily unavailable. Please try again shortly.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-80 h-96 bg-panel border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-panel2 border-b border-border">
            <span className="font-semibold text-white text-sm">KingBot Support</span>
            <button onClick={() => setOpen(false)}><X size={18} className="text-muted" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`text-sm max-w-[85%] px-3 py-2 rounded-lg ${m.sender === 'user' ? 'ml-auto bg-gold text-black' : 'bg-panel2 text-white'}`}>
                {m.message}
              </div>
            ))}
            {loading && <div className="text-xs text-muted">Typing...</div>}
            <div ref={bottomRef} />
          </div>
          <div className="p-3 border-t border-border flex gap-2">
            <input
              className="input flex-1 text-sm"
              placeholder="Ask about your account..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button onClick={send} className="btn-primary px-3"><Send size={16} /></button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="bg-gold text-black rounded-full p-4 shadow-xl hover:opacity-90">
          <MessageCircle size={22} />
        </button>
      )}
    </div>
  );
}
