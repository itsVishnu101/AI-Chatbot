import React from 'react';
import clsx from 'clsx';

/**
 * Single message bubble
 * role: 'user' | 'assistant' | 'system'
 */
export default function Message({ role, text, timestamp }) {
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';
  const bubbleClass = isUser ? 'bg-indigo-600 text-white ml-auto' : 'bg-gray-100 text-gray-700';

  return (
    <div className={clsx('flex items-start', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mr-3">AI</div>}
      <div className={`max-w-[75%] px-4 py-2 rounded-lg ${bubbleClass}`}>
        <div className="text-sm whitespace-pre-wrap">{text}</div>
        {timestamp && <div className="text-[10px] opacity-60 mt-1 text-right">{new Date(timestamp).toLocaleTimeString()}</div>}
      </div>
      {isUser && <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white ml-3">Y</div>}
    </div>
  );
}
