import React, { useEffect, useRef } from 'react';
import Message from './Message';

export default function ChatWindow({ messages = [], isTyping }) {
  const endRef = useRef();

  useEffect(() => {
    // scroll to bottom when messages change
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="p-4 h-[60vh] overflow-y-auto" style={{ background: 'linear-gradient(180deg, #ffffff, #f7fbff)' }}>
      <div className="space-y-3">
        {messages.map(msg => (
          <Message key={msg.id} role={msg.role} text={msg.text} timestamp={msg.timestamp} />
        ))}
        {isTyping && (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mr-3">AI</div>
            <div className="bg-gray-100 px-3 py-2 rounded-lg">
              <div className="animate-pulse">Typing…</div>
            </div>
          </div>
        )}
      </div>
      <div ref={endRef} />
    </div>
  );
}
