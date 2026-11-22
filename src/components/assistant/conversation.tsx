'use client';
import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react';
import type { AssistantResponse } from '@/lib/domain/assistant';
export interface ChatMessage { id: string; role: 'user' | 'assistant'; text: string; time: string; answer?: AssistantResponse }
const Conversation = createContext<{ messages: ChatMessage[]; setMessages: Dispatch<SetStateAction<ChatMessage[]>> } | null>(null);
export function ConversationProvider({ children }: { children: React.ReactNode }) {
 const [messages,setMessages] = useState<ChatMessage[]>([]); return <Conversation value={{messages,setMessages}}>{children}</Conversation>;
}
export function useConversation() { const value = useContext(Conversation); if (!value) throw new Error('Conversation provider missing'); return value; }
