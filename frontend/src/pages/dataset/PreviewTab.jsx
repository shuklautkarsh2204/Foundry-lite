export default function PreviewTab({ columns, rows }) {
  if (!rows || rows.length === 0) {
    return <div className="p-8 text-center text-gray-500 dark:text-gray-400">No data available for preview.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-auto border border-gray-100 dark:border-gray-800 max-h-[600px]">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
          <tr>
            {columns.map(c => (
              <th key={c} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              {columns.map(c => (
                <td key={c} className="px-4 py-2.5 text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {String(row[c] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
