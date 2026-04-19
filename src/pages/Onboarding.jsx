import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/api';

const SKILL_SUGGESTIONS = {
  tech: ['JavaScript', 'React', 'Node.js', 'Python', 'HTML/CSS', 'Git/GitHub', 'MongoDB', 'API Design'],
  design: ['Figma', 'UI/UX', 'Canva', 'Adobe XD', 'Wireframing', 'Prototyping'],
  career: ['Resume Writing', 'Interview Prep', 'LinkedIn', 'Career Coaching', 'Public Speaking'],
  education: ['Tutoring', 'Curriculum Design', 'Research', 'Academic Writing'],
};

const INTEREST_SUGGESTIONS = ['Web Development', 'UI/UX Design', 'Career Growth', 'Open Source', 'AI/ML', 'Community Building', 'Hackathons', 'Freelancing', 'Data Science', 'Mobile Apps'];

const ALL_SKILLS = [...new Set(Object.values(SKILL_SUGGESTIONS).flat())];

export default function Onboarding() {
  const { user, loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: user?.name || '',
    location: user?.location || '',
    skills: user?.skills || [],
    interests: user?.interests || [],
    role: user?.role || 'both',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : [...f.skills, skill],
    }));
  };

  const toggleInterest = (interest) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest)
        ? f.interests.filter(i => i !== interest)
        : [...f.interests, interest],
    }));
  };

  const handleFinish = async () => {
    setSaving(true);
    setError('');
    try {
      const { data } = await updateProfile({
        name: form.name,
        location: form.location,
        skills: form.skills,
        interests: form.interests,
        role: form.role,
      });
      const token = localStorage.getItem('helplytics_token');
      loginUser(data, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  // AI suggestions based on selected skills
  const aiCanHelp = form.skills.slice(0, 3);
  const aiNeedsHelp = INTEREST_SUGGESTIONS.filter(i => !form.interests.includes(i)).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">

      {/* Hero Banner */}
      <div className="mx-6 mt-6 rounded-2xl bg-gray-800 text-white px-10 py-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Onboarding</p>
        <h1 className="text-4xl font-bold leading-tight mb-3">
          Set up your community<br />identity.
        </h1>
        <p className="text-gray-400 text-sm">
          Tell us who you are, what you know, and what you want to learn. AI will suggest the best matches.
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                step >= s ? 'bg-teal-500 text-white' : 'bg-gray-600 text-gray-400'
              }`}>{s}</div>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-teal-500' : 'bg-gray-600'}`} />}
            </div>
          ))}
          <span className="ml-3 text-xs text-gray-400">
            {step === 1 ? 'Basic Info' : step === 2 ? 'Skills' : 'Interests & AI'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="mx-6 mt-6 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

        {/* Left — Form Steps */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">{error}</div>
          )}

          {/* Step 1 — Basic Info */}
          {step === 1 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Step 1</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Ayesha Khan"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="Karachi, Pakistan"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role selection</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['need_help', 'can_help', 'both'].map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm({ ...form, role: r })}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                          form.role === r
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'border-gray-200 text-gray-600 hover:border-teal-400'
                        }`}
                      >
                        {r === 'need_help' ? 'Need Help' : r === 'can_help' ? 'Can Help' : 'Both'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Skills */}
          {step === 2 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Step 2</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your skills</h2>
              <p className="text-sm text-gray-500 mb-5">Select skills you can help others with.</p>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition ${
                      form.skills.includes(skill)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-gray-200 text-gray-600 hover:border-teal-400'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {form.skills.length > 0 && (
                <p className="text-xs text-teal-600 mt-4 font-medium">{form.skills.length} skill{form.skills.length !== 1 ? 's' : ''} selected</p>
              )}
            </div>
          )}

          {/* Step 3 — Interests */}
          {step === 3 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">Step 3</p>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your interests</h2>
              <p className="text-sm text-gray-500 mb-5">Select areas where you want to grow or get help.</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_SUGGESTIONS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition ${
                      form.interests.includes(interest)
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'border-gray-200 text-gray-600 hover:border-teal-400'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="flex-1 border border-gray-200 text-gray-700 text-sm font-semibold py-3 rounded-xl hover:border-teal-400 transition"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-3 rounded-xl transition"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={saving}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold py-3 rounded-xl transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Complete setup'}
              </button>
            )}
          </div>
        </div>

        {/* Right — AI Suggestions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">AI Suggestion</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Smart profile<br />matching</h2>

          {/* Can help with */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-3">You can help with</p>
            {aiCanHelp.length > 0 ? (
              <div className="space-y-2">
                {aiCanHelp.map(skill => (
                  <div key={skill} className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                    <p className="text-sm text-teal-800 font-medium">{skill}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-400">Select skills to see AI suggestions</p>
              </div>
            )}
          </div>

          {/* May need help with */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-3">You may need help with</p>
            {aiNeedsHelp.length > 0 ? (
              <div className="space-y-2">
                {aiNeedsHelp.map(area => (
                  <div key={area} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-800 font-medium">{area}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-400">Select interests to see suggestions</p>
              </div>
            )}
          </div>

          {/* Profile preview */}
          {form.name && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Profile Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
                  {form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{form.name}</p>
                  <p className="text-xs text-gray-400">
                    {form.role === 'need_help' ? 'Need Help' : form.role === 'can_help' ? 'Can Help' : 'Both'}
                    {form.location ? ` • ${form.location}` : ''}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
