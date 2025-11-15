'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ChildrenType } from '@/types/component-props'
import type { ChatOffcanvasStatesType, OffcanvasControlType } from '@/types/context'

// Types for real messaging
interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Participant {
  user: User;
  joinedAt: string;
  lastReadAt?: string;
  unreadCount: number;
}

interface Message {
  _id: string;
  conversation: string;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'audio' | 'video';
  attachments: Array<{
    url: string;
    type: string;
    name?: string;
    size?: number;
  }>;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
  replyTo?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface Conversation {
  _id: string;
  type: 'direct' | 'group';
  participants: Participant[];
  name?: string;
  avatar?: string;
  description?: string;
  createdBy?: string;
  lastMessage?: Message;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

interface MessagingContextType {
  // Conversations
  conversations: Conversation[];
  activeConversation: Conversation | null;
  loadingConversations: boolean;

  // Messages
  messages: Message[];
  loadingMessages: boolean;

  // Actions
  fetchConversations: () => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string, type?: Message['type']) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;

  // Offcanvas states (keep existing functionality)
  chatList: { open: boolean; toggle: () => void };
  chatProfile: { open: boolean; toggle: () => void };
  voiceCall: { open: boolean; toggle: () => void };
  videoCall: { open: boolean; toggle: () => void };
  chatSetting: { open: boolean; toggle: () => void };
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined)

export const useChatContext = () => {
  const context = useContext(MessagingContext)
  if (!context) {
    throw new Error('useChatContext can only be used within ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }: ChildrenType) => {
  // Data state
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingConversations, setLoadingConversations] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Offcanvas states (keep existing)
  const [offcanvasStates, setOffcanvasStates] = useState<ChatOffcanvasStatesType>({
    showChatList: false,
    showUserProfile: false,
    showVoiceCall: false,
    showVideoCall: false,
    showUserSetting: false,
  })

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoadingConversations(true)
      const response = await fetch('/api/conversations')
      const data = await response.json()

      if (data.success) {
        setConversations(data.data)

        // If no active conversation, select first one
        if (!activeConversation && data.data.length > 0) {
          await selectConversation(data.data[0]._id)
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoadingConversations(false)
    }
  }, [activeConversation])

  // Select conversation and load its messages
  const selectConversation = useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true)

      // Find conversation in list
      const conversation = conversations.find(c => c._id === conversationId)
      if (conversation) {
        setActiveConversation(conversation)
      }

      // Fetch messages
      const response = await fetch(`/api/conversations/${conversationId}/messages?limit=50`)
      const data = await response.json()

      if (data.success) {
        setMessages(data.data)

        // Mark as read
        await markAsRead(conversationId)
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoadingMessages(false)
    }
  }, [conversations])

  // Send message
  const sendMessage = useCallback(async (content: string, type: Message['type'] = 'text') => {
    if (!activeConversation) return

    try {
      const response = await fetch(`/api/conversations/${activeConversation._id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, type }),
      })

      const data = await response.json()

      if (data.success) {
        // Add message to list
        setMessages(prev => [...prev, data.data])

        // Update conversation's last message
        setConversations(prev => prev.map(conv =>
          conv._id === activeConversation._id
            ? { ...conv, lastMessage: data.data, lastMessageAt: data.data.createdAt }
            : conv
        ))
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }, [activeConversation])

  // Mark conversation as read
  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
      })

      // Reset unread count in local state
      setConversations(prev => prev.map(conv => {
        if (conv._id === conversationId) {
          return {
            ...conv,
            participants: conv.participants.map(p => ({
              ...p,
              unreadCount: 0,
            })),
          }
        }
        return conv
      }))
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }, [])

  // Offcanvas toggles
  const toggleChatList: OffcanvasControlType['toggle'] = () => {
    setOffcanvasStates({ ...offcanvasStates, showChatList: !offcanvasStates.showChatList })
  }

  const toggleUserProfile: OffcanvasControlType['toggle'] = () => {
    setOffcanvasStates({ ...offcanvasStates, showUserProfile: !offcanvasStates.showUserProfile })
  }

  const toggleUserSetting: OffcanvasControlType['toggle'] = () => {
    setOffcanvasStates({ ...offcanvasStates, showUserSetting: !offcanvasStates.showUserSetting })
  }

  const toggleVoiceCall: OffcanvasControlType['toggle'] = () => {
    setOffcanvasStates({ ...offcanvasStates, showVoiceCall: !offcanvasStates.showVoiceCall })
  }

  const toggleVideoCall: OffcanvasControlType['toggle'] = () => {
    setOffcanvasStates({ ...offcanvasStates, showVideoCall: !offcanvasStates.showVideoCall })
  }

  const chatList = {
    open: offcanvasStates.showChatList,
    toggle: toggleChatList,
  }

  const chatProfile = {
    open: offcanvasStates.showUserProfile,
    toggle: toggleUserProfile,
  }

  const voiceCall = {
    open: offcanvasStates.showVoiceCall,
    toggle: toggleVoiceCall,
  }

  const videoCall = {
    open: offcanvasStates.showVideoCall,
    toggle: toggleVideoCall,
  }

  const chatSetting = {
    open: offcanvasStates.showUserSetting,
    toggle: toggleUserSetting,
  }

  // Initial load
  useEffect(() => {
    fetchConversations()
  }, [])

  // Auto-refresh conversations every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations()
    }, 10000)

    return () => clearInterval(interval)
  }, [fetchConversations])

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        activeConversation,
        loadingConversations,
        messages,
        loadingMessages,
        fetchConversations,
        selectConversation,
        sendMessage,
        markAsRead,
        chatList,
        chatProfile,
        voiceCall,
        videoCall,
        chatSetting,
      }}>
      {children}
    </MessagingContext.Provider>
  )
}

// Export types
export type { Conversation, Message, User, Participant }
