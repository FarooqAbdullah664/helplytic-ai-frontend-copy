import { useState, useEffect, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useSocket } from '../hooks/useSocket';
import { sendMessage, getMessages, getUsers } from '../services/api';

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  let hours = d.getHours();
  const mins = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${mins}\n${ampm}`;
}

export default function Messages() {
  const { user } = useContext(AuthContext);
  const socket = useSocket();

  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [chatId, setChatId] = useState('');
  const [recentMessages, setRecentMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  // Load users for the "To" dropdown
  useEffect(() => {
    getUsers()
      .then(({ data }) => {
        setUsers(data);
        if (data.length > 0) setReceiverId(data[0]._id);
      })
      .catch(() => {});
  }, [user]);

  // Load chat when receiverId changes
  useEffect(() => {
    if (!receiverId || !user?._id) return;
    const id = [user._id, receiverId].sort().join('_');
    setChatId(id);
    getMessages(id)
      .then(({ data }) => {
        setMessages(data);
        setRecentMessages(data.slice(-5).reverse());
      })
      .catch(() => {});

    // Poll for new messages every 5 seconds
    const interval = setInterval(() => {
      getMessages(id)
        .then(({ data }) => setMessages(data))
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [receiverId, user]);

  // Socket listener
  useEffect(() => {
    if (!socket || !chatId) return;
    socket.emit('join_chat', chatId);
    const handler = (msg) => setMessages(prev => [...prev, msg]);
    socket.on('receive_message', handler);
    return () => socket.off('receive_message', handler);
  }, [socket, chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !receiverId) return;
    setSending(true);
    try {
      const { data } = await sendMessage({ receiverId, content: input });
      setMessages(prev => [...prev, data]);
      if (socket) socket.emit('send_message', { chatId, message: data });
      setInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const selectedUser = users.find(u => u._id === receiverId);

  // Build recent conversations list from messages
  const recentConvos = messages.slice(-10).reduce((acc, m) => {
    const partnerId = String(m.sender?._id || m.sender) === String(user?._id)
      ? String(m.receiver?._id || m.receiver)
      : String(m.sender?._id || m.sender);
    const partnerName = String(m.sender?._id || m.sender) === String(user?._id)
      ? (selectedUser?.name || 'Unknown')
      : (m.sender?.name || 'Unknown');
    const existing = acc.find(c => c.partnerId === partnerId);
    if (!existing) {
      acc.push({ partnerId, partnerName, lastMsg: m, fromName: m.sender?.name || user?.name });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Hero Banner */}
      <div className="mx-3 md:mx-6 mt-4 md:mt-6 rounded-2xl bg-gray-800 text-white px-5 md:px-10 py-7 md:py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Interaction / Messaging</p>
        <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-3">
          Keep support moving through direct communication.
        </h1>
        <p className="text-gray-400 text-sm">
          Basic messaging gives helpers and requesters a clear follow-up path once a match happens.
        </p>
      </div>

      {/* Two-column body */}
      <div className="mx-3 md:mx-6 mt-4 md:mt-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start">

        {/* Left — Recent Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">
            Conversation Stream
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Recent messages</h2>

          {messages.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No messages yet. Start a conversation!</p>
          ) : (
            <div className="space-y-1 divide-y divide-gray-100">
              {messages.slice(-6).map((m, i) => {
                const isMe = String(m.sender?._id || m.sender) === String(user?._id);
                const fromName = isMe ? user?.name : (m.sender?.name || 'Unknown');
                const toName = isMe ? (selectedUser?.name || 'Unknown') : user?.name;
                return (
                  <div key={m._id || i} className="flex items-start justify-between py-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        {fromName} → {toName}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2">{m.content}</p>
                    </div>
                    <div className="flex-shrink-0 bg-gray-100 rounded-xl px-3 py-2 text-center min-w-[52px]">
                      <p className="text-xs font-semibold text-gray-700 whitespace-pre-line leading-tight">
                        {formatTime(m.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Right — Send Message */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">
            Send Message
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Start a<br />conversation
          </h2>

          <form onSubmit={handleSend} className="space-y-4">
            {/* To dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <select
                value={receiverId}
                onChange={e => setReceiverId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700"
              >
                {users.length === 0 && (
                  <option value="">No users available</option>
                )}
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>

            {/* Message textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                placeholder="Share support details, ask for files, or suggest next steps."
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={sending || !input.trim() || !receiverId}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
