import { useState } from 'react';
import { discoverRels } from '../../api/sources';

export default function RelationshipsTab({ id }) {
  const [targetId, setTargetId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runDiscovery = async () => {
    setLoading(true);
    try {
      const r = await discoverRels(id, targetId);
      setResult(r.data);
    } catch (e) {
      setResult({ error: e.message || 'Failed to discover relationships' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-800">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4 text-lg flex items-center gap-2">
          <span className="text-xl">🔗</span> Discover Relationships
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Compare this dataset against another dataset to find potential join keys, foreign keys, or related structures using AI.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Dataset ID</label>
            <input 
              type="text" 
              value={targetId} 
              onChange={e => setTargetId(e.target.value)} 
              placeholder="e.g. 5" 
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          <button 
            onClick={runDiscovery} 
            disabled={!targetId || loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
            {loading ? 'Analyzing cross-dataset relationships...' : 'Run AI Discovery'}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-950 rounded-xl p-6 shadow-inner border border-gray-200 dark:border-gray-800">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4 text-sm uppercase tracking-wider">Discovery Results</h3>
        
        {!result ? (
          <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 text-sm border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            Enter a target dataset ID and run discovery to see results.
          </div>
        ) : result.error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-200 dark:border-red-800/50 text-sm">
            {result.error}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 overflow-auto max-h-96">
            <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
