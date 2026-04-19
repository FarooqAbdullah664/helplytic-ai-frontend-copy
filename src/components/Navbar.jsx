import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logoutUser(); navigate('/'); setMenuOpen(false); };

  const isActive = (to) =>
    location.pathname === to ||
    (to === '/explore' && location.pathname === '/' && !!user) ||
    (to === '/' && location.pathname === '/' && !user);

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`text-sm px-3 py-2 rounded-full transition font-medium block md:inline-block ${
        isActive(to)
          ? 'bg-teal-50 text-teal-700 border border-teal-200'
          : 'text-gray-600 hover:text-teal-600'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-100 px-4 md:px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            H
          </div>
          <span className="font-semibold text-gray-800 text-base">Helplytics AI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 flex-wrap">
          {user ? (
            <>
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/explore', 'Explore')}
              {navLink('/leaderboard', 'Leaderboard')}
              {navLink('/ai-center', 'AI Center')}
              {navLink('/notifications', 'Notifications')}
              {navLink('/profile', 'Profile')}
              {navLink('/messages', 'Messages')}
              <Link
                to="/create"
                className="ml-2 text-sm bg-teal-600 text-white px-4 py-1.5 rounded-full hover:bg-teal-700 transition font-medium"
              >
                Post Request
              </Link>
              <button
                onClick={handleLogout}
                className="ml-1 text-sm text-gray-500 hover:text-red-500 px-3 py-1.5 transition"
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
              <Link
                to="/signup"
                className="ml-3 text-sm bg-teal-600 text-white px-4 py-1.5 rounded-full hover:bg-teal-700 transition font-medium"
              >
                Join the platform
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-700 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-700 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-gray-100 pt-3 flex flex-col gap-1">
          {user ? (
            <>
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/explore', 'Explore')}
              {navLink('/leaderboard', 'Leaderboard')}
              {navLink('/ai-center', 'AI Center')}
              {navLink('/notifications', 'Notifications')}
              {navLink('/profile', 'Profile')}
              {navLink('/messages', 'Messages')}
              {navLink('/onboarding', 'Onboarding')}
              <Link
                to="/create"
                onClick={() => setMenuOpen(false)}
                className="text-sm bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition font-medium text-center mt-1"
              >
                Post Request
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 px-3 py-2 transition text-left"
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
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="text-sm bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition font-medium text-center mt-1"
              >
                Join the platform
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
