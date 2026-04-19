import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => { logoutUser(); navigate('/'); };

  const navLink = (to, label) => {
    const isActive = location.pathname === to ||
      (to === '/explore' && location.pathname === '/' && !!user) ||
      (to === '/' && location.pathname === '/' && !user);
    return (
      <Link
        to={to}
        className={`text-sm px-3 py-1.5 rounded-full transition font-medium ${
          isActive
            ? 'bg-teal-50 text-teal-700 border border-teal-200'
            : 'text-gray-600 hover:text-teal-600'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
          H
        </div>
        <span className="font-semibold text-gray-800 text-base">Helplytics AI</span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {user ? (
          <>
            {navLink('/dashboard', 'Dashboard')}
            {navLink('/explore', 'Explore')}
            {navLink('/leaderboard', 'Leaderboard')}
            {navLink('/ai-center', 'AI Center')}
            {navLink('/notifications', 'Notifications')}
            {navLink('/onboarding', 'Onboarding')}
            {navLink('/profile', 'Profile')}
            {navLink('/messages', 'Messages')}
            <Link
              to="/create"
              className="ml-3 text-sm bg-teal-600 text-white px-4 py-1.5 rounded-full hover:bg-teal-700 transition font-medium"
            >
              Post Request
            </Link>
            <button
              onClick={handleLogout}
              className="ml-2 text-sm text-gray-500 hover:text-red-500 px-3 py-1.5 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {navLink('/', 'Home')}
            {navLink('/explore', 'Explore')}
            {navLink('/leaderboard', 'Leaderboard')}
            {navLink('/ai-center', 'AI Center')}
            <span className="text-xs text-gray-300 mx-1">|</span>
            <span className="text-xs text-gray-400 px-2 py-1 border border-gray-200 rounded-full">
              Live community signals
            </span>
            <Link
              to="/signup"
              className="ml-3 text-sm bg-teal-600 text-white px-4 py-1.5 rounded-full hover:bg-teal-700 transition font-medium"
            >
              Join the platform
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
