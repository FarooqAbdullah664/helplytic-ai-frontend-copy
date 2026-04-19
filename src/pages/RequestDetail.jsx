import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getRequestById, offerHelp, solveRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext';

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
const categoryColor = {
  tech: 'bg-teal-100 text-teal-700',
  design: 'bg-purple-100 text-purple-700',
  career: 'bg-blue-100 text-blue-700',
  other: 'bg-gray-100 text-gray-600',
};

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

const avatarColors = ['bg-orange-400', 'bg-teal-600', 'bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-gray-700'];

export default function RequestDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getRequestById(id)
      .then(({ data }) => setRequest(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleHelp = async () => {
    setActionLoading(true);
    try { const { data } = await offerHelp(id); setRequest(data.request); }
    finally { setActionLoading(false); }
  };

  const handleSolve = async () => {
    setActionLoading(true);
    try { const { data } = await solveRequest(id, {}); setRequest(data.request); }
    finally { setActionLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    </div>
  );

  if (!request) return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
      <p className="text-gray-400">Request not found</p>
    </div>
  );

  const isAuthor = user && String(user._id) === String(request.author?._id);
  const alreadyHelping = user && request.helpers?.some(h => String(h._id || h) === String(user._id));
  const catLabel = request.category === 'tech' ? 'Web Development' : cap(request.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Hero Banner */}
      <div className="mx-6 mt-6 rounded-2xl bg-gray-800 text-white px-10 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Request Detail</p>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColor[request.category] || 'bg-gray-700 text-gray-300'}`}>
            {catLabel}
          </span>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${urgencyColor[request.urgency] || 'bg-gray-700 text-gray-300'}`}>
            {cap(request.urgency)}
          </span>
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[request.status] || 'bg-gray-700 text-gray-300'}`}>
            {cap(request.status?.replace('_', ' '))}
          </span>
        </div>

        <h1 className="text-4xl font-bold leading-tight mb-4">{request.title}</h1>
        <p className="text-gray-400 text-sm leading-relaxed">{request.description}</p>
      </div>

      {/* Body — two columns */}
      <div className="mx-6 mt-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Left col — AI Summary + Actions */}
        <div className="flex flex-col gap-6">

          {/* AI Summary card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-5">AI Summary</p>

            {/* AI avatar + summary */}
            <div className="flex items-start gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                H
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Helplytics AI</p>
                {request.aiSummary ? (
                  <p className="text-sm text-gray-600 leading-relaxed">{request.aiSummary}</p>
                ) : (
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {catLabel} request with {request.urgency} urgency. Best suited for members with relevant expertise in this area.
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            {request.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {request.tags.map(tag => (
                  <span key={tag} className="text-xs border border-gray-200 text-gray-600 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions card */}
          {user && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-5">Actions</p>
              <div className="flex items-center gap-4 flex-wrap">
                {!isAuthor && request.status !== 'solved' && (
                  <button
                    onClick={handleHelp}
                    disabled={alreadyHelping || actionLoading}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition disabled:opacity-50"
                  >
                    {alreadyHelping ? 'Helping ✓' : 'I can help'}
                  </button>
                )}
                {isAuthor && request.status !== 'solved' && (
                  <button
                    onClick={handleSolve}
                    disabled={actionLoading}
                    className="text-sm font-semibold text-gray-700 hover:text-teal-600 transition disabled:opacity-50"
                  >
                    Mark as solved
                  </button>
                )}
                {request.status === 'solved' && (
                  <span className="text-sm text-gray-400">This request has been solved.</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right col — Requester + Helpers */}
        <div className="flex flex-col gap-6">

          {/* Requester card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-5">Requester</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                {getInitials(request.author?.name)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{request.author?.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {request.author?.location || 'Community member'}
                  {request.author?.trustScore != null ? ` • Trust ${request.author.trustScore}%` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Helpers card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Helpers</p>
            <h3 className="text-xl font-bold text-gray-900 mb-5">People ready to support</h3>

            {!request.helpers || request.helpers.length === 0 ? (
              <p className="text-sm text-gray-400">No helpers yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {request.helpers.map((h, i) => (
                  <div key={h._id || i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                      {getInitials(h.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{h.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {h.skills?.slice(0, 3).join(', ') || 'Community helper'}
                      </p>
                    </div>
                    {h.trustScore != null && (
                      <span className="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full flex-shrink-0">
                        Trust {h.trustScore}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
