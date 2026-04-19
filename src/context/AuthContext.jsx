import { createContext, useState, useEffect } from 'react';
import { getProfile } from '../services/api';
export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('helplytics_token');
    if (token) {
      getProfile().then(({ data }) => setUser(data)).catch(() => localStorage.removeItem('helplytics_token')).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, []);
  const loginUser = (userData, token) => { localStorage.setItem('helplytics_token', token); setUser(userData); };
  const logoutUser = () => { localStorage.removeItem('helplytics_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>{children}</AuthContext.Provider>;
};
