import React, { useState } from 'react';

export default function Composer({ onSend }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await onSend(text);
      setText('');
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex gap-3 items-center">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={1}
        placeholder="Type your message…"
        className="flex-1 resize-none rounded-lg border p-3 focus:outline-none focus:ring"
      />
      <button
        type="submit"
        disabled={sending}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {sending ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
