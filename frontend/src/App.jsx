import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from './components/ChatWindow';
import Composer from './components/Composer';
import { sendMessage } from './services/geminiService';
import { loadMessages, saveMessages } from './utils/storage';

/**
 * Main app component
 * - keeps messages array
 * - handles sending messages (calls sendMessage -> server)
 */
export default function App() {
  const [messages, setMessages] = useState(() => loadMessages() || []);
  const [isTyping, setIsTyping] = useState(false);
  const conversationIdRef = useRef(null);

  useEffect(() => {
    saveMessages(messages);
  }, [messages]);

  async function handleSend(text) {
    if (!text || !text.trim()) return;

    // Add user message immediately
    const userMsg = { id: Date.now() + '-u', role: 'user', text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);

    try {
      setIsTyping(true);

      // Call backend which calls Gemini
      const resp = await sendMessage(text, conversationIdRef.current);

      // resp may contain assistant text in resp.output or similar; adapt as per server
      // We try to find a sensible message text:
      let assistantText = '';
      if (resp?.content) {
        assistantText = resp.content; // if server returned plain content
      } else if (resp?.candidates?.[0]?.output) {
        assistantText = resp.candidates[0].output;
      } else if (typeof resp === 'string') {
        assistantText = resp;
      } else {
        assistantText = JSON.stringify(resp).slice(0, 400); // fallback
      }

      const assistantMsg = {
        id: Date.now() + '-a',
        role: 'assistant',
        text: assistantText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Send failed', err);
      const errMsg = {
        id: Date.now() + '-e',
        role: 'system',
        text: 'Error: failed to get response from server.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <h1 className="text-xl font-semibold">AI Chatbot (Gemini)</h1>
          <p className="text-sm text-gray-500">Student project — React + Node proxy</p>
        </div>

        <ChatWindow messages={messages} isTyping={isTyping} />

        <Composer onSend={handleSend} />
      </div>
    </div>
  );
}
