'use client';

import { MessageCircle } from 'lucide-react';
import { useChatStore } from '@/lib/chat-store';

export function ChatButton() {
  const { isOpen, unreadCount } = useChatStore();

  if (isOpen) return null;

  return (
    <button
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#011E55] to-[#0a2d6e] text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center z-50 group"
      onClick={() => {
        const event = new CustomEvent('open-chat-global');
        window.dispatchEvent(event);
      }}
    >
      <MessageCircle className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
      <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat Pemilik Kost
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-4 border-transparent border-l-gray-900" />
      </div>
    </button>
  );
}
