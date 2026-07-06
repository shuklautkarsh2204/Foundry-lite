import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../../api/sources';

export default function SchemaTab({ id, columns }) {
  const { data: profile } = useQuery({ 
    queryKey: ['profile', id],  
    queryFn: () => getProfile(id) 
  });

  const profData = profile?.data || {};

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden border border-gray-100 dark:border-gray-800">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Column Name</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Data Type</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Null Count</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Unique Count</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {columns.map(c => {
            const stats = profData[c] || {};
            return (
              <tr key={c} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4 text-gray-900 dark:text-gray-100 font-medium">{c}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    stats.dtype?.includes('int') || stats.dtype?.includes('float') 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {stats.dtype || 'unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{stats.null_count ?? '—'}</td>
                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{stats.unique_count ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {columns.length === 0 && (
        <div className="p-8 text-center text-gray-500">No schema information available.</div>
      )}
    </div>
  );
}
