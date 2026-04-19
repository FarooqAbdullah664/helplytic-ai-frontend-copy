import { createContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
export const SocketContext = createContext(null);
export const SocketProvider = ({ children, userId }) => {
  const socket = useRef(null);
  useEffect(() => {
    if (!userId) return;
    socket.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.current.emit('user_connected', userId);
    return () => socket.current.disconnect();
  }, [userId]);
  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
