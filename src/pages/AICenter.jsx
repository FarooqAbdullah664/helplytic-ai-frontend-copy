import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRequests, getLeaderboard } from '../services/api';

const categoryColor = {
  tech: 'bg-teal-100 text-teal-700',
  design: 'bg-purple-100 text-purple-700',
  career: 'bg-blue-100 text-blue-700',
  health: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-600',
};
const urgencyColor = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-orange-100 text-orange-700',
  high: 'bg-red-100 text-red-700',
};

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function aiSummary(request) {
  const catLabel = request.category === 'tech' ? 'Web Development' : cap(request.category);
  const urgLabel = cap(request.urgency);
  const summaries = {
    high: `${catLabel} request with high urgency. Best suited for members with relevant expertise.`,
    medium: `${catLabel} request. Best helpers are those comfortable with the subject area.`,
    low: `${catLabel} request focused on ${request.tags?.[0] || 'community support'}. A great match for patient mentors.`,
  };
  return summaries[request.urgency] || `${catLabel} request needing community attention.`;
}

export default function AICenter() {
  const [requests, setRequests] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqRes = await getRequests({ page: 1 });
        setRequests(reqRes.data.requests || []);
      } catch (e) {
        console.error('Failed to load requests:', e);
      }
      try {
        const helpRes = await getLeaderboard();
        const helpersList = Array.isArray(helpRes.data) ? helpRes.data : [];
        setHelpers(helpersList);
      } catch (e) {
        console.error('Failed to load leaderboard:', e);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Compute stats
  const trendCategory = (() => {
    const counts = {};
    requests.forEach(r => { counts[r.category] = (counts[r.category] || 0) + 1; });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!top) return 'Web Development';
    return top[0] === 'tech' ? 'Web Development' : cap(top[0]);
  })();

  const urgentCount = requests.filter(r => r.urgency === 'high' && r.status !== 'solved').length;
  const mentorCount = helpers.filter(h => h.trustScore >= 70).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Hero Banner */}
      <div className="mx-6 mt-6 rounded-2xl bg-gray-800 text-white px-10 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">AI Center</p>
        <h1 className="text-4xl font-bold leading-tight mb-3">
          See what the platform intelligence is<br />noticing.
        </h1>
        <p className="text-gray-400 text-sm">
          AI-like insights summarize demand trends, helper readiness, urgency signals, and request recommendations.
        </p>
      </div>

      {/* Stats row */}
      <div className="mx-6 mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Trend Pulse */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">Trend Pulse</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{trendCategory}</h2>
          <p className="text-sm text-gray-500">Most common support area based on active community requests.</p>
        </div>

        {/* Urgency Watch */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">Urgency Watch</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{loading ? '—' : urgentCount}</h2>
          <p className="text-sm text-gray-500">Requests currently flagged high priority by the urgency detector.</p>
        </div>

        {/* Mentor Pool */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">Mentor Pool</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{loading ? '—' : mentorCount}</h2>
          <p className="text-sm text-gray-500">Trusted helpers with strong response history and contribution signals.</p>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="mx-6 mt-6 pb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">AI Recommendations</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Requests needing attention</h2>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : requests.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">No requests found</p>
          ) : (
            <div className="space-y-3">
              {requests.map(r => (
                <Link
                  key={r._id}
                  to={`/requests/${r._id}`}
                  className="block border border-gray-100 rounded-xl p-5 hover:border-teal-200 hover:shadow-sm transition"
                >
                  <p className="text-sm font-semibold text-gray-900 mb-1">{r.title}</p>
                  <p className="text-sm text-gray-500 mb-3">{aiSummary(r)}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColor[r.category] || 'bg-gray-100 text-gray-600'}`}>
                      {r.category === 'tech' ? 'Web Development' : cap(r.category)}
                    </span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${urgencyColor[r.urgency] || 'bg-gray-100 text-gray-600'}`}>
                      {cap(r.urgency)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
