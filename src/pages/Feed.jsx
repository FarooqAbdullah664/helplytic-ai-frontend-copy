import { useState, useEffect } from 'react';
import { getRequests } from '../services/api';
import RequestCard from '../components/RequestCard';

const categories = ['', 'tech', 'design', 'career', 'health', 'legal', 'finance', 'education', 'other'];
const urgencies = ['', 'low', 'medium', 'high'];

export default function Feed() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', urgency: '', status: '', search: '' });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    getRequests({ ...filters, page })
      .then(({ data }) => { setRequests(data.requests); setPages(data.pages); })
      .finally(() => setLoading(false));
  }, [filters, page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Hero Banner */}
      <div className="mx-3 md:mx-6 mt-4 md:mt-6 rounded-2xl bg-gray-800 text-white px-5 md:px-10 py-7 md:py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Explore / Feed</p>
        <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-3">
          Browse help requests with filterable<br className="hidden md:block" />community context.
        </h1>
        <p className="text-gray-400 text-sm">
          Filter by category, urgency, skills, and location to surface the best matches.
        </p>
      </div>

      {/* Body */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mx-3 md:mx-6 mt-4 md:mt-6 pb-10">

        {/* Left Sidebar — Filters */}
        <div className="w-full md:w-72 flex-shrink-0 bg-white rounded-2xl p-5 md:p-6 shadow-sm self-start">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Filters</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Refine the feed</h2>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search requests..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
            />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={e => setFilters({ ...filters, category: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c ? c.charAt(0).toUpperCase() + c.slice(1) : 'All categories'}</option>
              ))}
            </select>
          </div>

          {/* Urgency */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
            <select
              value={filters.urgency}
              onChange={e => setFilters({ ...filters, urgency: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700"
            >
              {urgencies.map(u => (
                <option key={u} value={u}>{u ? u.charAt(0).toUpperCase() + u.slice(1) : 'All urgency levels'}</option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
            <input
              type="text"
              placeholder="React, Figma, Git/GitHub"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
            />
          </div>

          {/* Location */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              placeholder="Karachi, Lahore, Remote"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
            />
          </div>
        </div>

        {/* Right — Cards */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No requests found</div>
          ) : (
            <div className="flex flex-col gap-4">
              {requests.map(r => <RequestCard key={r._id} request={r} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    page === p
                      ? 'bg-teal-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-teal-400'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
