import { useState, useEffect } from 'react';
import { getNotifications, markNotificationsRead } from '../services/api';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return 'Today';
}

const typeLabel = {
  status: 'Status',
  match: 'Match',
  request: 'Request',
  reputation: 'Reputation',
  insight: 'Insight',
  message: 'Message',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
      .then(({ data }) => setNotifications(data))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));

    // mark all as read after viewing
    markNotificationsRead().catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Hero Banner */}
      <div className="mx-6 mt-6 rounded-2xl bg-gray-800 text-white px-10 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Notifications</p>
        <h1 className="text-4xl font-bold leading-tight">
          Stay updated on requests, helpers, and<br />trust signals.
        </h1>
      </div>

      {/* Notification Feed */}
      <div className="mx-6 mt-6 pb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Live Updates</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification feed</h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">No notifications yet</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((n, i) => (
                <div key={n._id || i} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {typeLabel[n.type] || 'Update'} • {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold ml-6 flex-shrink-0 ${
                      n.read ? 'text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {n.read ? 'Read' : 'Unread'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
