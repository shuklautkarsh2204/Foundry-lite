import { useQuery } from '@tanstack/react-query';
import { getProfile, getQuality } from '../../api/sources';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function StatisticsTab({ id }) {
  const { data: profile } = useQuery({ queryKey: ['profile', id], queryFn: () => getProfile(id) });
  const { data: quality } = useQuery({ queryKey: ['quality', id], queryFn: () => getQuality(id) });

  const profData = profile?.data || {};
  const qualData = quality?.data || {};

  return (
    <div className="space-y-6">
      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Missing Values', value: qualData.missing_value_count, color: qualData.missing_value_count > 0 ? 'red' : 'green' },
          { label: 'Duplicate Rows', value: qualData.duplicate_rows, color: qualData.duplicate_rows > 0 ? 'yellow' : 'green' },
          { label: 'Columns with Empty Strings', value: qualData.empty_string_count ? Object.values(qualData.empty_string_count).filter(v => v > 0).length : 0, color: 'blue' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-white dark:bg-gray-900 rounded-xl p-5 shadow border-l-4 border-${color}-400 dark:border-${color}-500`}>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value ?? 0}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Empty Strings Chart */}
      {qualData.empty_string_count && (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow border border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3">Empty Strings Per Column</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={Object.entries(qualData.empty_string_count).map(([k, v]) => ({ name: k, value: v }))}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888' }} />
              <YAxis tick={{ fontSize: 11, fill: '#888' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Profile Details per Column */}
      <h3 className="font-semibold text-gray-700 dark:text-gray-200 pt-4">Detailed Column Profiling</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.entries(profData).map(([col, stats]) => (
          <div key={col} className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">{col}</h3>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${stats.dtype?.includes('int') || stats.dtype?.includes('float') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                {stats.dtype}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {[
                ['Nulls', stats.null_count],
                ['Unique', stats.unique_count],
                ['Min', stats.min],
                ['Max', stats.max],
              ].map(([label, val]) => (
                <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="font-bold text-gray-800 dark:text-gray-100">{val ?? '—'}</div>
                  <div className="text-xs text-gray-400 mt-1">{label}</div>
                </div>
              ))}
            </div>
            {stats.mean !== null && stats.mean !== undefined && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Mean: <span className="font-semibold text-gray-800 dark:text-gray-100">{Number(stats.mean).toFixed(2)}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
