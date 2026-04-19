import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signup } from '../services/api';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', location: '', skills: '', interests: '', role: 'both' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        location: form.location,
        role: form.role,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
      };
      const { data } = await signup(payload);
      // Auto-login after signup
      loginUser(data, data.token);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-xl">

        {/* Left Panel — Dark */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-gray-800 text-white p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Join the Community</p>
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Build your support profile.
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              Create your account and become part of a community designed for asking, offering, and tracking help with a premium interface.
            </p>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                Set your role — Need Help, Can Help, or Both
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                Add your skills and interests to get matched
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0"></span>
                Earn points and climb the community leaderboard
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel — Light Form */}
        <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">Login / Signup</p>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-8">
            Create your<br />community profile
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Ayesha Khan"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Karachi, PK"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="community@helplytics.ai"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
              <input
                type="text"
                placeholder="React, Node.js, Design"
                value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interests <span className="text-gray-400 font-normal">(comma separated)</span></label>
              <input
                type="text"
                placeholder="AI, Open Source, Education"
                value={form.interests}
                onChange={e => setForm({ ...form, interests: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
              <div className="grid grid-cols-3 gap-3">
                {[['need_help', 'Need Help'], ['can_help', 'Can Help'], ['both', 'Both']].map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setForm({ ...form, role: val })}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                      form.role === val
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-gray-200 text-gray-600 hover:border-teal-400'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create account & Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Have an account?{' '}
            <Link to="/login" className="text-teal-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
