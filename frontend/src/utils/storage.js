// small wrapper to persist messages to localStorage (student-friendly)
const KEY = 'ai_chat_messages_v1';

export function loadMessages() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveMessages(messages) {
  try {
    localStorage.setItem(KEY, JSON.stringify(messages));
  } catch (err) {
    // ignore
  }
}
