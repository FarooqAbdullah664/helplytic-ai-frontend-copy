import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Feed from './pages/Feed';
import RequestDetail from './pages/RequestDetail';
import CreateRequest from './pages/CreateRequest';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Leaderboard from './pages/Leaderboard';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AICenter from './pages/AICenter';
import Onboarding from './pages/Onboarding';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const { user } = useContext(AuthContext);
  return (
    <SocketProvider userId={user?._id}>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <Routes>
          {/* Home for guests, Feed for logged-in users */}
          <Route path="/" element={user ? <Feed /> : <Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
          <Route path="/create" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/ai-center" element={<AICenter />} />
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </SocketProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
