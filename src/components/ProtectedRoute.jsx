import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div></div>;
  return user ? children : <Navigate to="/login" />;
}
