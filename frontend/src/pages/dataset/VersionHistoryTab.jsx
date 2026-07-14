export default function VersionHistoryTab({ source }) {
  // Mock data since endpoint doesn't exist yet
  const history = [
    { version: 'v1.2.0', date: source.updated_at || new Date().toISOString(), user: 'Foundry System', changes: 'Applied filter on columns' },
    { version: 'v1.1.0', date: source.created_at || new Date(Date.now() - 86400000).toISOString(), user: 'Foundry System', changes: 'Schema auto-detected and profiled' },
    { version: 'v1.0.0', date: source.created_at || new Date(Date.now() - 172800000).toISOString(), user: 'Foundry System', changes: 'Initial dataset import' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-800">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-6 text-lg flex items-center gap-2">
        <span className="text-xl">🕰️</span> Version History
      </h3>
      
      <div className="space-y-6">
        {history.map((h, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
              {i !== history.length - 1 && <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-800 mt-2"></div>}
            </div>
            <div className="pb-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-bold text-gray-900 dark:text-gray-100">{h.version}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(h.date).toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800 mt-2">
                <span className="block font-medium text-gray-900 dark:text-gray-200 mb-1">By {h.user}</span>
                {h.changes}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
