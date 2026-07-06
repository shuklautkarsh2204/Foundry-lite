export default function OverviewTab({ source, metrics }) {
  if (!source) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow border border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Dataset Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Rows</div>
            <div className="text-xl font-bold mt-1 text-gray-900 dark:text-white">{metrics?.row_count ?? source.row_count ?? '—'}</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Columns</div>
            <div className="text-xl font-bold mt-1 text-gray-900 dark:text-white">{metrics?.column_count ?? source.columns?.length ?? '—'}</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Nulls</div>
            <div className="text-xl font-bold mt-1 text-gray-900 dark:text-white">{metrics?.null_total ?? '—'}</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-500 dark:text-gray-400">Duplicates</div>
            <div className="text-xl font-bold mt-1 text-gray-900 dark:text-white">{metrics?.duplicate_rows ?? '—'}</div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow border border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Metadata</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Filename</span>
            <span className="font-medium text-gray-900 dark:text-white text-sm">{source.filename}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Dataset ID</span>
            <span className="font-medium text-gray-900 dark:text-white text-sm">{source.id}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Created At</span>
            <span className="font-medium text-gray-900 dark:text-white text-sm">{source.created_at ? new Date(source.created_at).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Updated At</span>
            <span className="font-medium text-gray-900 dark:text-white text-sm">{source.updated_at ? new Date(source.updated_at).toLocaleString() : 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
            <span className="text-gray-500 dark:text-gray-400 text-sm">Owner</span>
            <span className="font-medium text-gray-900 dark:text-white text-sm">Foundry System</span>
          </div>
        </div>
      </div>
    </div>
  );
}
