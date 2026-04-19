import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/api';

export default function Profile() {
  const { user, loginUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || '',
    location: user?.location || '',
    skills: user?.skills?.join(', ') || '',
    interests: user?.interests?.join(', ') || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const { data } = await updateProfile(form);
      // update context with fresh user data (keep existing token)
      const token = localStorage.getItem('helplytics_token');
      loginUser(data, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Hero Banner */}
      <div className="mx-6 mt-6 rounded-2xl bg-gray-800 text-white px-10 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Profile</p>
        <h1 className="text-5xl font-bold leading-tight mb-3">{user?.name}</h1>
        <p className="text-gray-400 text-sm">
          {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Both'}
          {user?.location ? ` • ${user.location}` : ''}
        </p>
      </div>

      {/* Two-column body */}
      <div className="mx-6 mt-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left — Skills & Reputation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Public Profile</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Skills and reputation</h2>

          {/* Trust Score */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <span className="text-sm text-gray-600">Trust score</span>
            <span className="text-sm font-semibold text-gray-900">{user?.trustScore ?? 0}%</span>
          </div>

          {/* Contributions */}
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <span className="text-sm text-gray-600">Contributions</span>
            <span className="text-sm font-semibold text-gray-900">{user?.helpedCount ?? 0}</span>
          </div>

          {/* Skills */}
          <div className="py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 mb-3">Skills</p>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.length > 0 ? (
                user.skills.map(skill => (
                  <span key={skill} className="text-xs border border-gray-300 text-gray-700 px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No skills added yet</span>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="py-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">Badges</p>
            <div className="flex flex-wrap gap-2">
              {user?.badges?.length > 0 ? (
                user.badges.map(badge => (
                  <span key={badge} className="text-xs border border-gray-300 text-gray-700 px-3 py-1 rounded-full">
                    {badge}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No badges earned yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Right — Edit Profile */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Edit Profile</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Update your<br />identity</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}
          {saved && (
            <div className="bg-teal-50 border border-teal-200 text-teal-700 text-sm px-4 py-3 rounded-xl mb-5">
              Profile saved successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            {/* Name + Location row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
              <input
                type="text"
                value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })}
                placeholder="Figma, UI/UX, HTML/CSS, Career Guidance"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
              <input
                type="text"
                value={form.interests}
                onChange={e => setForm({ ...form, interests: e.target.value })}
                placeholder="Hackathons, UI/UX, Community Building"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 mt-2"
            >
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
