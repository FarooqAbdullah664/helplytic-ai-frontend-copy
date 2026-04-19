import { Link } from 'react-router-dom';

const categoryColor = {
  tech: 'bg-teal-100 text-teal-700',
  design: 'bg-purple-100 text-purple-700',
  career: 'bg-blue-100 text-blue-700',
  health: 'bg-green-100 text-green-700',
  legal: 'bg-orange-100 text-orange-700',
  finance: 'bg-yellow-100 text-yellow-700',
  education: 'bg-indigo-100 text-indigo-700',
  other: 'bg-gray-100 text-gray-600',
  'web development': 'bg-teal-100 text-teal-700',
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

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function RequestCard({ request }) {
  const category = request.category || 'other';
  const catLabel = category === 'tech' ? 'Web Development' : capitalize(category);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      {/* Top badges */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColor[category] || 'bg-gray-100 text-gray-600'}`}>
          {catLabel}
        </span>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${urgencyColor[request.urgency] || 'bg-gray-100 text-gray-600'}`}>
          {capitalize(request.urgency)}
        </span>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[request.status] || 'bg-gray-100 text-gray-600'}`}>
          {capitalize(request.status?.replace('_', ' '))}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 text-base mb-2 line-clamp-2">
        {request.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
        {request.description}
      </p>

      {/* Skill tags */}
      {request.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {request.tags.slice(0, 4).map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer — author + open details */}
      <div className="flex items-end justify-between mt-2">
        <div>
          <p className="text-sm font-medium text-gray-800">{request.author?.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {request.author?.location || 'Remote'}
            {' • '}
            {request.helpers?.length || 0} helper{request.helpers?.length !== 1 ? 's' : ''} interested
          </p>
        </div>
        <Link
          to={`/requests/${request._id}`}
          className="text-sm font-medium text-gray-700 hover:text-teal-600 transition whitespace-nowrap"
        >
          Open details
        </Link>
      </div>
    </div>
  );
}
