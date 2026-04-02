'use client';

import { create } from 'zustand';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'owner';
  timestamp: Date;
  read: boolean;
}

interface ChatState {
  isOpen: boolean;
  activeKosId: string | null;
  activeKosName: string | null;
  ownerName: string | null;
  messages: Message[];
  unreadCount: number;
  openChat: (kosId: string, kosName: string, ownerName?: string) => void;
  closeChat: () => void;
  sendMessage: (text: string) => void;
  markAsRead: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  activeKosId: null,
  activeKosName: null,
  ownerName: null,
  messages: [],
  unreadCount: 0,

  openChat: (kosId, kosName, ownerName = 'Pemilik Kost') => {
    set({
      isOpen: true,
      activeKosId: kosId,
      activeKosName: kosName,
      ownerName,
      unreadCount: 0,
    });
  },

  closeChat: () => {
    set({ isOpen: false });
  },

  sendMessage: (text) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      read: true,
    };

    const messages = [...get().messages, newMessage];
    set({ messages });

    setTimeout(() => {
      const ownerReply: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Terima kasih atas pesanmu! Saya akan segera merespons.',
        sender: 'owner',
        timestamp: new Date(),
        read: false,
      };
      set({ messages: [...get().messages, ownerReply], unreadCount: get().unreadCount + 1 });
    }, 1000);
  },

  markAsRead: () => {
    set({ unreadCount: 0 });
  },
}));
