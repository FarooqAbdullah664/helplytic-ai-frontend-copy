import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getRequests, getLeaderboard } from '../services/api';

const categoryColor = {
  tech: 'bg-teal-100 text-teal-700',
  design: 'bg-purple-100 text-purple-700',
  career: 'bg-blue-100 text-blue-700',
  other: 'bg-gray-100 text-gray-600',
};
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

export default function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ members: 0, requests: 0, solved: 0 });

  useEffect(() => {
    getRequests({ page: 1 }).then(({ data }) => {
      setRequests(data.requests?.slice(0, 3) || []);
      const total = data.total || data.requests?.length || 0;
      const solved = data.requests?.filter(r => r.status === 'solved').length || 0;
      setStats(s => ({ ...s, requests: total, solved }));
    }).catch(() => {});

    getLeaderboard().then(({ data }) => {
      setStats(s => ({ ...s, members: data.length }));
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* ── HERO SECTION ── */}
      <div className="mx-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg">

        {/* Left — white panel */}
        <div className="bg-white text-gray-900 p-10 flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              SMIT Grand Coding Night 2026
            </p>
            <h1 className="text-4xl font-bold leading-tight mb-5 text-gray-900">
              Find help faster.<br />
              Become help that<br />
              matters.
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Helplytics AI is a community-powered support network for students, mentors,
              creators, and builders. Ask for help, offer help, track impact, and let AI surface
              smarter matches across the platform.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/login"
                className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition"
              >
                Open product demo
              </Link>
              <Link
                to="/create"
                className="bg-transparent border border-gray-300 hover:border-gray-500 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-full transition"
              >
                Post a request
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Members</p>
              <p className="text-3xl font-bold text-gray-900">{stats.members > 0 ? `${stats.members}+` : '384+'}</p>
              <p className="text-xs text-gray-500 mt-1">Students, mentors, and helpers in the loop.</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Requests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.requests > 0 ? `${stats.requests}+` : '72+'}</p>
              <p className="text-xs text-gray-500 mt-1">Support posts shared across learning journeys.</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Solved</p>
              <p className="text-3xl font-bold text-gray-900">{stats.solved > 0 ? `${stats.solved}+` : '69+'}</p>
              <p className="text-xs text-gray-500 mt-1">Problems resolved through fast community action.</p>
            </div>
          </div>
        </div>

        {/* Right — dark teal panel */}
        <div className="bg-gray-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative circle */}
          <div className="absolute top-6 right-6 w-14 h-14 rounded-full bg-amber-400 opacity-90" />

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Live Product Feel</p>
            <h2 className="text-3xl font-bold leading-tight mb-5">
              More than a form.<br />More like an<br />ecosystem.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              A polished multi-page experience inspired by product platforms, with AI summaries, trust scores,
              contribution signals, notifications, and leaderboard momentum built directly in HTML, CSS,
              JavaScript, and LocalStorage.
            </p>
          </div>

          {/* Feature cards */}
          <div className="space-y-3">
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-1">AI request intelligence</p>
              <p className="text-xs text-gray-400">Auto-categorization, urgency detection, tags, rewrite suggestions, and trend snapshots.</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-1">Community trust graph</p>
              <p className="text-xs text-gray-400">Badges, helper rankings, trust score boosts, and visible contribution history.</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-1">100%</p>
              <p className="text-xs text-gray-400">Top trust score currently active across the sample mentor network.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CORE FLOW SECTION ── */}
      <div className="mx-6 mt-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Core Flow</p>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">From struggling alone to solving together</h2>
          <Link
            to="/create"
            className="text-sm font-medium text-gray-600 border border-gray-300 px-4 py-2 rounded-full hover:border-teal-500 hover:text-teal-600 transition whitespace-nowrap ml-4"
          >
            Try onboarding AI
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-2">Ask for help clearly</p>
            <p className="text-sm text-gray-500">Create structured requests with category, urgency, AI suggestions, and tags that attract the right people.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-2">Discover the right people</p>
            <p className="text-sm text-gray-500">Use the explore feed, helper lists, notifications, and messaging to move quickly once a match happens.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-900 mb-2">Track real contribution</p>
            <p className="text-sm text-gray-500">Trust scores, badges, solved requests, and rankings help the community recognize meaningful support.</p>
          </div>
        </div>
      </div>

      {/* ── FEATURED REQUESTS ── */}
      <div className="mx-6 mt-12 pb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Featured Requests</p>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Community problems currently in motion</h2>
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 border border-gray-300 px-4 py-2 rounded-full hover:border-teal-500 hover:text-teal-600 transition whitespace-nowrap ml-4"
          >
            View full feed
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {requests.map(r => (
              <div key={r._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                {/* Badges */}
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor[r.category] || 'bg-gray-100 text-gray-600'}`}>
                      {r.category === 'tech' ? 'Web Development' : cap(r.category)}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${urgencyColor[r.urgency] || 'bg-gray-100 text-gray-600'}`}>
                      {cap(r.urgency)}
                    </span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[r.status] || 'bg-gray-100 text-gray-600'}`}>
                      {cap(r.status?.replace('_', ' '))}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{r.title}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{r.description}</p>
                  {r.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {r.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Footer */}
                <div className="flex items-end justify-between mt-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{r.author?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.author?.location || 'Remote'} • {r.helpers?.length || 0} helper interested
                    </p>
                  </div>
                  <Link
                    to={`/requests/${r._id}`}
                    className="text-xs font-semibold text-gray-700 hover:text-teal-600 transition whitespace-nowrap"
                  >
                    Open<br />details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mx-6 py-6">
        <p className="text-xs text-gray-400 text-center">
          Helplytics AI is built as a premium-feel, multi-page community support product using HTML, CSS, JavaScript, and LocalStorage.
        </p>
      </div>
    </div>
  );
}
