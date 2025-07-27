import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { io, Socket } from 'socket.io-client';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const SOCKET_URL = API;

type UserLite = {
  _id: string;
  name: string;
  profilePhoto?: string;
  email?: string;
};

type ThreadType = {
  _id: string;
  participants: UserLite[];
  messages: Array<{
    sender: string;
    content: string;
    timestamp: string;
  }>;
};

const Messages = () => {
  const { user } = useAuth();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const toUserId = params.get('to');

  const [sidebarUsers, setSidebarUsers] = useState<UserLite[]>([]);
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadType | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserLite | null>(null);
  const [message, setMessage] = useState('');
  const chatRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // 1. Fetch sidebar users (all alumni for students, all students for alumni)
  useEffect(() => {
    if (!user) return;
    const url =
      user.role === 'student'
        ? `${API}/api/users/alumni-sidebar`
        : `${API}/api/users/students-sidebar`;
    axios.get(url).then(res => setSidebarUsers(res.data));
  }, [user]);

  // 2. Initialize socket and subscribe for real-time messages
  useEffect(() => {
    if (!user?._id) return;
    if (socketRef.current) socketRef.current.disconnect();

    const socket = io(SOCKET_URL, { query: { user_id: user._id } });
    socketRef.current = socket;

    socket.on('receive_message', ({ threadId, msg }) => {
      setThreads(ts =>
        ts.map(t =>
          t._id === threadId
            ? { ...t, messages: [...t.messages, msg] }
            : t
        )
      );
      if (selectedThread && threadId === selectedThread._id) {
        setSelectedThread(t =>
          t ? { ...t, messages: [...t.messages, msg] } : t
        );
      }
    });

    return () => {
      socket.disconnect();
      socket.off('receive_message');
    };
  }, [user?._id, selectedThread]);

  // 3. Load threads & auto-select with ?to=
  useEffect(() => {
    const fetchThreads = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`${API}/api/messages`);
        setThreads(res.data);

        // If coming via ?to=, select that user in sidebar and open/create thread
        if (toUserId) {
          const person = sidebarUsers.find(u => u._id === toUserId);
          setSelectedUser(person || null);

          let thread = res.data.find((t: ThreadType) =>
            t.participants.some((p) => p._id === toUserId)
          );
          if (!thread) {
            await axios.post(`${API}/api/messages`, { to: toUserId, content: '' });
            const res2 = await axios.get(`${API}/api/messages`);
            thread = res2.data.find((t: ThreadType) =>
              t.participants.some((p) => p._id === toUserId)
            );
            setThreads(res2.data);
          }
          setSelectedThread(thread || null);
        } else {
          setSelectedThread(res.data[0] || null);
          setSelectedUser(null);
        }
      } catch {
        setThreads([]);
      }
    };
    fetchThreads();
    // eslint-disable-next-line
  }, [toUserId, user?._id, sidebarUsers.length]);

  // 4. When thread or messages change, scroll to bottom
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [selectedThread]);

  // 5. Selecting user in sidebar
  const handleSelectUser = async (person: UserLite) => {
    setSelectedUser(person);
    let thread = threads.find((t) =>
      t.participants.some((p) => p._id === person._id)
    );
    if (!thread) {
      // Create thread with dummy message (will not appear in view)
      await axios.post(`${API}/api/messages`, { to: person._id, content: '' });
      const res2 = await axios.get(`${API}/api/messages`);
      thread = res2.data.find((t) => t.participants.some((p) => p._id === person._id));
      setThreads(res2.data);
    }
    setSelectedThread(thread || null);
  };

  // 6. Sending a message in the active thread
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedThread || !user) return;
    const to = selectedThread.participants.find(u => u._id !== user._id)?._id;
    await axios.post(`${API}/api/messages`, { to, content: message });
    setMessage('');
  };

  return (
    <div className="flex gap-6 py-6">
      {/* Sidebar */}
      <aside className="w-64 bg-muted/50 rounded-lg p-4 space-y-2 h-[70vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">{user?.role === 'student' ? "Alumni" : "Students"}</h2>
        {sidebarUsers.map(person => (
          <div
            key={person._id}
            onClick={() => handleSelectUser(person)}
            className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-primary/10 ${
              selectedUser && person._id === selectedUser._id ? 'bg-primary/10 font-semibold' : ''
            }`}
          >
            <Avatar className="w-10 h-10">
              <AvatarImage src={person.profilePhoto} alt={person.name} />
              <AvatarFallback>{person.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div>{person.name}</div>
              <div className="text-xs text-muted-foreground">{person.email}</div>
            </div>
          </div>
        ))}
      </aside>
      {/* Chat Pane */}
      <section className="flex-1 flex flex-col bg-card rounded-lg p-6 h-[70vh]">
        {selectedThread ? (
          <>
            <div className="flex items-center gap-4 border-b pb-3 mb-2">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={selectedThread.participants.find(p => p._id !== user?._id)?.profilePhoto}
                  alt={selectedThread.participants.find(p => p._id !== user?._id)?.name}
                />
                <AvatarFallback>
                  {selectedThread.participants.find(p => p._id !== user?._id)?.name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">
                  {selectedThread.participants.find(p => p._id !== user?._id)?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedThread.participants.find(p => p._id !== user?._id)?.email}
                </div>
              </div>
            </div>
            {/* Chat Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto px-1 mb-2 space-y-2">
              {selectedThread.messages.length === 0 && (
                <div className="text-muted-foreground text-sm py-4 text-center">
                  No messages yet.
                </div>
              )}
              {selectedThread.messages.map((msg, idx) => {
                const isSelf = msg.sender === user?._id;
                const avatar = selectedThread.participants.find(p => p._id === msg.sender);
                return (
                  <div key={idx} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                    <div className="flex items-center gap-2">
                      {!isSelf && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={avatar?.profilePhoto} alt={avatar?.name} />
                          <AvatarFallback>{avatar?.name?.[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={`rounded-xl px-4 py-2 max-w-xs ${
                        isSelf ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        {msg.content}
                        <div className="text-xs mt-1 opacity-70 text-right">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      {isSelf && (
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={avatar?.profilePhoto} alt={avatar?.name} />
                          <AvatarFallback>{avatar?.name?.[0]}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <form onSubmit={handleSend} className="flex items-center gap-2 mt-2">
              <Input
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message…"
                className="flex-1"
                autoFocus
              />
              <Button type="submit" disabled={!message.trim()}>Send</Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-lg">
            Select a conversation
          </div>
        )}
      </section>
    </div>
  );
};

export default Messages;
