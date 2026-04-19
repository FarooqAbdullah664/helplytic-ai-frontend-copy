const colors = { Helper: 'bg-blue-100 text-blue-700', Contributor: 'bg-purple-100 text-purple-700', Expert: 'bg-amber-100 text-amber-700', Champion: 'bg-red-100 text-red-700' };
export default function BadgePill({ badge }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[badge] || 'bg-gray-100 text-gray-600'}`}>{badge}</span>;
}
