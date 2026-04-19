import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRequest, getAISuggestions } from '../services/api';

const CATEGORY_MAP = {
  tech: ['bug','code','error','api','deploy','javascript','python','database','server','react','node','html','css','responsive','portfolio','quiz','app'],
  design: ['ui','ux','figma','color','layout','font','logo','design','poster','wireframe','banner'],
  career: ['job','resume','interview','salary','linkedin','career','hire','portfolio','internship','behavioral'],
  health: ['pain','doctor','symptom','medicine','mental','anxiety','stress','sleep','diet'],
  legal: ['contract','law','legal','rights','court','lawyer','agreement'],
  finance: ['money','invest','budget','debt','loan','tax','bank','savings'],
  education: ['study','exam','course','learn','university','school','tutor','homework','assignment'],
};
const URGENCY_TRIGGERS = ['urgent','asap','immediately','deadline','critical','emergency','today','tonight','tomorrow'];

function detectCategory(text) {
  const lower = text.toLowerCase();
  let best = 'other', score = 0;
  for (const [cat, kws] of Object.entries(CATEGORY_MAP)) {
    const s = kws.filter(k => lower.includes(k)).length;
    if (s > score) { score = s; best = cat; }
  }
  return best;
}
function detectUrgency(text) {
  return URGENCY_TRIGGERS.some(t => text.toLowerCase().includes(t)) ? 'high' : 'low';
}
function extractTags(text) {
  const stop = new Set(['the','is','a','an','and','or','but','in','on','at','to','for','with','this','i','my','we','need','help','want','have','can','would']);
  return [...new Set(
    text.toLowerCase().replace(/[^a-z\s]/g,'').split(/\s+/)
      .filter(w => w.length > 3 && !stop.has(w))
  )].slice(0, 5);
}
function rewriteSuggestion(title, description) {
  if (!description || description.length < 20) return 'Start describing the challenge to generate a stronger version.';
  const cat = detectCategory(description);
  const catLabel = cat === 'tech' ? 'Web Development' : cat.charAt(0).toUpperCase() + cat.slice(1);
  return `${catLabel} request: "${title || 'Untitled'}". ${description.split(/[.!?]/)[0].trim()}.`;
}

const categoryOptions = ['tech','design','career','health','legal','finance','education','other'];
const urgencyOptions = ['low','medium','high'];
const catLabel = c => c === 'tech' ? 'Web Development' : c.charAt(0).toUpperCase() + c.slice(1);
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export default function CreateRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: 'tech', urgency: 'low', tags: '' });
  const [ai, setAi] = useState({ category: 'Community', urgency: 'Low', tags: 'Add more detail for smarter tags', rewrite: 'Start describing the challenge to generate a stronger version.' });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const text = form.title + ' ' + form.description;
    if (text.trim().length < 10) return;
    const detectedCat = detectCategory(text);
    const detectedUrg = detectUrgency(text);
    const detectedTags = extractTags(text);
    const rewrite = rewriteSuggestion(form.title, form.description);
    setAi({
      category: catLabel(detectedCat),
      urgency: detectedUrg.charAt(0).toUpperCase() + detectedUrg.slice(1),
      tags: detectedTags.length > 0 ? detectedTags.join(', ') : 'Add more detail for smarter tags',
      rewrite,
    });
  }, [form.title, form.description]);

  const applyAI = async () => {
    if (!form.title && !form.description) return;
    setAiLoading(true);
    try {
      const { data } = await getAISuggestions({ title: form.title, description: form.description });
      // Update AI panel
      setAi({
        category: catLabel(data.category) || 'Community',
        urgency:  data.urgency ? cap(data.urgency) : 'Low',
        tags:     Array.isArray(data.tags) && data.tags.length > 0 ? data.tags.join(', ') : 'No tags suggested',
        rewrite:  data.rewrite || form.description,
      });
      // Apply to form
      setForm(f => ({
        ...f,
        category: data.category || f.category,
        urgency:  data.urgency  || f.urgency,
        tags:     Array.isArray(data.tags) ? data.tags.join(', ') : f.tags,
        description: data.rewrite || f.description,
      }));
    } catch (err) {
      // Fallback to local engine
      const text = form.title + ' ' + form.description;
      const detectedCat = detectCategory(text);
      const detectedUrg = detectUrgency(text);
      const detectedTags = extractTags(text);
      setAi({
        category: catLabel(detectedCat),
        urgency:  cap(detectedUrg),
        tags:     detectedTags.join(', ') || 'Add more detail',
        rewrite:  form.description,
      });
      setForm(f => ({ ...f, category: detectedCat, urgency: detectedUrg, tags: detectedTags.join(', ') }));
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      const { data } = await createRequest({ ...form, tags });
      navigate(`/requests/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Hero Banner */}
      <div className="mx-6 mt-6 rounded-2xl bg-gray-800 text-white px-10 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Create Request</p>
        <h1 className="text-4xl font-bold leading-tight mb-3">
          Turn a rough problem into a clear help<br />request.
        </h1>
        <p className="text-gray-400 text-sm">
          Use built-in AI suggestions for category, urgency, tags, and a stronger description rewrite.
        </p>
      </div>

      {/* Body */}
      <div className="mx-6 mt-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Left — Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                placeholder="Need review on my JavaScript quiz app before submission"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                placeholder="Explain the challenge, your current progress, deadline, and what kind of help would be useful."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
                rows={5}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 resize-none"
              />
            </div>

            {/* Tags + Category row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <input
                  type="text"
                  placeholder="JavaScript, Debugging, Review"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700"
                >
                  {categoryOptions.map(c => (
                    <option key={c} value={c}>{catLabel(c)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select
                value={form.urgency}
                onChange={e => setForm({ ...form, urgency: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50 text-gray-700"
              >
                {urgencyOptions.map(u => (
                  <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={applyAI}
                disabled={aiLoading || (!form.title && !form.description)}
                className="flex-1 border border-gray-300 text-gray-700 text-sm font-semibold py-3 rounded-xl hover:border-teal-400 hover:text-teal-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    AI thinking...
                  </>
                ) : (
                  'Apply AI suggestions'
                )}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-3 rounded-xl transition disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Publish request'}
              </button>
            </div>
          </form>
        </div>

        {/* Right — AI Assistant */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">AI Assistant</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Smart request<br />guidance</h2>

          <div className="space-y-0 divide-y divide-gray-100">
            <div className="flex items-center justify-between py-4">
              <span className="text-sm text-gray-500">Suggested category</span>
              <span className="text-sm font-semibold text-gray-900">{ai.category}</span>
            </div>
            <div className="flex items-center justify-between py-4">
              <span className="text-sm text-gray-500">Detected urgency</span>
              <span className={`text-sm font-semibold ${
                ai.urgency === 'High' ? 'text-red-600' :
                ai.urgency === 'Medium' ? 'text-orange-600' : 'text-green-600'
              }`}>{ai.urgency}</span>
            </div>
            <div className="flex items-start justify-between py-4 gap-4">
              <span className="text-sm text-gray-500 flex-shrink-0">Suggested tags</span>
              <span className="text-sm font-semibold text-gray-900 text-right">{ai.tags}</span>
            </div>
            <div className="flex items-start justify-between py-4 gap-4">
              <span className="text-sm text-gray-500 flex-shrink-0">Rewrite suggestion</span>
              <span className="text-sm font-semibold text-gray-900 text-right leading-relaxed">{ai.rewrite}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
