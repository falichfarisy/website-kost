import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '../chat-store';

describe('Chat Store', () => {
  beforeEach(() => {
    useChatStore.setState({
      isOpen: false,
      activeKosId: null,
      activeKosName: null,
      ownerName: null,
      messages: [],
      unreadCount: 0,
    });
  });

  it('should have default values', () => {
    const state = useChatStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.activeKosId).toBe(null);
    expect(state.messages).toEqual([]);
    expect(state.unreadCount).toBe(0);
  });

  it('should open chat with kos info', () => {
    const store = useChatStore.getState();
    store.openChat('kos-123', 'Kost Maju Jaya', 'Pak Budi');
    
    const state = useChatStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.activeKosId).toBe('kos-123');
    expect(state.activeKosName).toBe('Kost Maju Jaya');
    expect(state.ownerName).toBe('Pak Budi');
  });

  it('should close chat', () => {
    const store = useChatStore.getState();
    store.openChat('kos-123', 'Kost Maju Jaya');
    store.closeChat();
    
    expect(useChatStore.getState().isOpen).toBe(false);
  });

  it('should send message and add to messages', () => {
    const store = useChatStore.getState();
    store.openChat('kos-123', 'Kost Maju Jaya');
    store.sendMessage('Halo, ada kamar kosong?');
    
    const state = useChatStore.getState();
    expect(state.messages.length).toBeGreaterThan(0);
    expect(state.messages[0].text).toBe('Halo, ada kamar kosong?');
    expect(state.messages[0].sender).toBe('user');
  });

  it('should mark messages as read', () => {
    const store = useChatStore.getState();
    store.openChat('kos-123', 'Kost Maju Jaya');
    store.sendMessage('Test message');
    store.markAsRead();
    
    expect(useChatStore.getState().unreadCount).toBe(0);
  });
});
