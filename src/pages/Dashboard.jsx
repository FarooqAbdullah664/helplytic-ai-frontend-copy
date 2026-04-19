import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getRequests, getNotifications } from '../services/api';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return 'Today';
}

const urgencyColor = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};
const statusColor = {
  open: 'bg-teal-50 text-teal-600',
  in_progress: 'bg-orange-50 text-orange-600',
  solved: 'bg-gray-100 text-gray-500',
};

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getNotifications().catch(() => ({ data: [] })),
      getRequests({ page: 1 }).catch(() => ({ data: { requests: [] } })),
    ]).then(([notifRes, reqRes]) => {
      setNotifications(notifRes.data?.slice(0, 5) || []);
      setMyRequests(reqRes.data?.requests?.slice(0, 3) || []);
    }).finally(() => setLoading(false));
  }, [user]);

  const stats = [
    { label: 'Trust Score', value: `${user?.trustScore ?? 0}%`, sub: 'Community reputation' },
    { label: 'Helped Others', value: user?.helpedCount ?? 0, sub: 'Total contributions' },
    { label: 'Requests Solved', value: user?.solvedCount ?? 0, sub: 'Problems closed' },
    { label: 'Badges Earned', value: user?.badges?.length ?? 0, sub: 'Achievements unlocked' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Hero Banner */}
      <div className="mx-3 md:mx-6 mt-4 md:mt-6 rounded-2xl bg-gray-800 text-white px-5 md:px-10 py-7 md:py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Dashboard</p>
        <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-2">
          Welcome back, {user?.name?.split(' ')[0]}.
        </h1>
        <p className="text-gray-400 text-sm">
          Here's your activity overview, recent requests, and AI insights.
        </p>
      </div>

      {/* Stats row */}
      <div className="mx-3 md:mx-6 mt-4 md:mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-gray-900 mb-1">{s.value}</p>
            <p className="text-sm font-medium text-gray-700">{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="mx-3 md:mx-6 mt-4 md:mt-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* Left — Recent Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">Recent Activity</p>
              <h2 className="text-2xl font-bold text-gray-900">Latest requests</h2>
            </div>
            <Link to="/explore" className="text-sm text-teal-600 hover:underline font-medium">View all</Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />)}
            </div>
          ) : myRequests.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No requests yet</p>
          ) : (
            <div className="space-y-3">
              {myRequests.map(r => (
                <Link key={r._id} to={`/requests/${r._id}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-sm transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.author?.name} • {timeAgo(r.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 ml-3 flex-shrink-0">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${urgencyColor[r.urgency]}`}>{cap(r.urgency)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[r.status]}`}>{cap(r.status?.replace('_',' '))}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Quick actions */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Quick Actions</p>
            <div className="flex gap-3 flex-wrap">
              <Link to="/create"
                className="text-sm bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 transition font-medium">
                Post a request
              </Link>
              <Link to="/explore"
                className="text-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:border-teal-400 transition font-medium">
                Browse feed
              </Link>
              <Link to="/profile"
                className="text-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-full hover:border-teal-400 transition font-medium">
                Edit profile
              </Link>
            </div>
          </div>
        </div>

        {/* Right — Notifications + AI Insights */}
        <div className="flex flex-col gap-6">

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">Live Updates</p>
                <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              </div>
              <Link to="/notifications" className="text-sm text-teal-600 hover:underline font-medium">See all</Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />)}
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No notifications yet</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((n, i) => (
                  <div key={n._id || i} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                    </div>
                    <span className={`text-xs font-semibold ml-4 flex-shrink-0 ${n.read ? 'text-gray-400' : 'text-gray-700'}`}>
                      {n.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">AI Insights</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">Platform signals</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-teal-800">Your trust score is strong. Keep helping to unlock new badges.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">Web Development requests are trending — your skills are in demand.</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">Complete your profile to get better helper matches.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
