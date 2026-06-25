'use client';

import { useState, useRef, useEffect } from 'react';
import { useChatStore } from '@/lib/chat-store';
import { X, Send, Building2, Phone, Mail } from 'lucide-react';

export function ChatWindow() {
  const { isOpen, activeKosName, ownerName, messages, closeChat, sendMessage } = useChatStore();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in-right z-50">
      <div className="bg-gradient-to-r from-[#011E55] to-[#0a2d6e] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">{ownerName}</h3>
            <p className="text-white/70 text-xs">Online • Biasanya balas dalam 1 jam</p>
          </div>
        </div>
        <button
          onClick={closeChat}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Pesan Otomatis</span>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Hai! Tertarik dengan <span className="font-semibold">{activeKosName}</span>? 
            Tanyakan apapun tentang kost ini, saya siap membantu! 🏠
          </p>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.sender === 'user'
                  ? 'bg-[#011E55] text-white rounded-br-md'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-100 dark:border-gray-700'
              }`}
            >
              <p>{msg.text}</p>
              <span className={`text-xs mt-1 block ${
                msg.sender === 'user' ? 'text-white/60' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              rows={1}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#011E55] text-sm dark:text-white placeholder-gray-400"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-3 bg-[#011E55] text-white rounded-xl hover:bg-[#0a2d6e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Hubungi pemilik untuk info lebih lanjut
        </p>
      </div>
    </div>
  );
}
