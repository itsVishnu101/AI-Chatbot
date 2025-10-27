/**
 * Frontend service to call the local server proxy.
 * The server will call Gemini with your API key.
 */

export async function sendMessage(message, conversationId = null) {
  const resp = await fetch('http://localhost:4000/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationId })
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: 'unknown' }));
    throw new Error(err.message || 'Request failed');
  }

  const data = await resp.json();
  // Return raw data; App.jsx will interpret it.
  return data;
}
