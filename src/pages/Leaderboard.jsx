import { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/api';

// Avatar color palette — cycles through for each user
const avatarColors = [
  'bg-gray-700',
  'bg-teal-600',
  'bg-orange-400',
  'bg-indigo-500',
  'bg-rose-500',
  'bg-amber-500',
];

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// Progress bar: two-tone — amber for first 30%, teal for rest
function TrustBar({ score, max = 100 }) {
  const pct = Math.min((score / max) * 100, 100);
  const amberWidth = Math.min(pct, 30);
  const tealWidth = Math.max(pct - 30, 0);
  return (
    <div className="flex h-2 rounded-full overflow-hidden bg-gray-100 w-full">
      <div className="bg-amber-400 rounded-l-full" style={{ width: `${amberWidth}%` }} />
      <div className="bg-teal-600 rounded-r-full" style={{ width: `${tealWidth}%` }} />
    </div>
  );
}

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const maxScore = users[0]?.trustScore || 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Hero Banner */}
      <div className="mx-6 mt-6 rounded-2xl bg-gray-800 text-white px-10 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Leaderboard</p>
        <h1 className="text-4xl font-bold leading-tight mb-3">
          Recognize the people who keep the<br />community moving.
        </h1>
        <p className="text-gray-400 text-sm">
          Trust score, contribution count, and badges create visible momentum for reliable helpers.
        </p>
      </div>

      {/* Two-column body */}
      <div className="mx-6 mt-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left — Rankings */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Top Helpers</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Rankings</h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No data yet</p>
          ) : (
            <div className="space-y-4">
              {users.map((u, i) => (
                <div key={u._id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                    {getInitials(u.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      #{i + 1} {u.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {u.skills?.slice(0, 3).join(', ') || 'Community member'}
                    </p>
                  </div>

                  {/* Score + contributions */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800">{u.trustScore}%</p>
                    <p className="text-xs text-gray-400">{u.helpedCount || 0} contributions</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Trust & Achievement */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Badge System</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Trust and achievement</h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No data yet</p>
          ) : (
            <div className="space-y-6">
              {users.map((u, i) => (
                <div key={u._id}>
                  {/* Progress bar */}
                  <TrustBar score={u.trustScore} max={maxScore} />

                  {/* Name + badges */}
                  <div className="mt-3">
                    <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {u.badges?.join(' • ') || 'Community Member'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
