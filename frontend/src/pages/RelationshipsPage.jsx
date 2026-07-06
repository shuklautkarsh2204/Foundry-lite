import { useState, useEffect } from 'react';
import { Database, Check, X, ChevronRight, Zap, Link as LinkIcon, Sparkles, ArrowRight } from 'lucide-react';

const mockRelationships = [
  {
    id: 'rel_1',
    source: 'Customers',
    target: 'Orders',
    confidence: 98,
    suggestedJoin: 'Customers.id = Orders.customer_id',
    matchingColumns: [
      { sourceCol: 'id', targetCol: 'customer_id', type: 'Exact Match (100%)' },
      { sourceCol: 'email', targetCol: 'billing_email', type: 'Semantic Match (85%)' }
    ]
  },
  {
    id: 'rel_2',
    source: 'Orders',
    target: 'Payments',
    confidence: 94,
    suggestedJoin: 'Orders.id = Payments.order_id',
    matchingColumns: [
      { sourceCol: 'id', targetCol: 'order_id', type: 'Exact Match (100%)' },
      { sourceCol: 'amount', targetCol: 'payment_amount', type: 'Pattern Match (78%)' }
    ]
  }
];

export default function RelationshipsPage() {
  const [isDiscovering, setIsDiscovering] = useState(true);
  const [relationships, setRelationships] = useState([]);
  const [actioned, setActioned] = useState({});

  useEffect(() => {
    // Simulate magical discovery
    const timer = setTimeout(() => {
      setRelationships(mockRelationships);
      setIsDiscovering(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (id, action) => {
    setActioned(prev => ({ ...prev, [id]: action }));
  };

  const allAccepted = relationships.length > 0 && relationships.every(r => actioned[r.id] === 'accepted');

  if (isDiscovering) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center relative z-10 border border-blue-100 dark:border-blue-900/50">
            <Sparkles className="w-12 h-12 text-blue-500 animate-bounce" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">AI is discovering relationships</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md text-lg">
          Scanning your datasets for foreign keys, semantic matches, and structural similarities...
        </p>
        <div className="mt-12 flex items-center gap-6 text-gray-400 dark:text-gray-600">
           <Database className="w-8 h-8 animate-pulse" />
           <ArrowRight className="w-6 h-6 animate-pulse delay-75" />
           <Database className="w-8 h-8 animate-pulse delay-150" />
           <ArrowRight className="w-6 h-6 animate-pulse delay-200" />
           <Database className="w-8 h-8 animate-pulse delay-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center gap-3">
            <Sparkles className="text-blue-500" /> Auto-Discovered Relationships
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
            Our AI has identified a highly probable path linking your key business entities. Review and approve the connections below.
          </p>
        </div>
        {allAccepted && (
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-xl shadow-blue-500/30 flex items-center gap-2 hover:-translate-y-1">
            Build Knowledge Graph <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Relationship Graph Visualization */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center overflow-x-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-purple-50/50 to-blue-50/50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-blue-900/10 rounded-3xl"></div>
        
        <div className="flex items-center py-4 relative z-10">
          {['Customers', 'Orders', 'Payments'].map((node, i) => (
            <div key={node} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-2 border-white dark:border-gray-700 flex items-center justify-center relative group hover:-translate-y-2 transition-transform duration-300 ring-4 ring-gray-50 dark:ring-gray-900">
                  <Database className="text-blue-600 dark:text-blue-400 w-10 h-10" />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="mt-4 font-bold text-gray-800 dark:text-gray-100 text-lg">{node}</span>
              </div>
              {i < 2 && (
                <div className="flex flex-col items-center mx-8 mt-[-2rem]">
                  <div className="text-xs text-blue-600 dark:text-blue-400 mb-2 font-mono bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full font-bold border border-blue-100 dark:border-blue-800/50">1:N</div>
                  <div className="h-1 w-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 relative">
                    <div className="absolute -right-2 -top-1.5 w-4 h-4 border-t-4 border-r-4 border-gray-300 dark:border-gray-600 transform rotate-45"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Relationship Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {relationships.map((rel) => {
          const status = actioned[rel.id];
          const isAccepted = status === 'accepted';
          const isRejected = status === 'rejected';

          return (
            <div 
              key={rel.id} 
              className={`bg-white dark:bg-gray-900 rounded-[2rem] p-8 transition-all duration-500 relative overflow-hidden ${
                isAccepted 
                  ? 'border-2 border-green-400 shadow-[0_0_40px_rgba(74,222,128,0.15)] ring-4 ring-green-50 dark:ring-green-900/20' 
                  : isRejected 
                    ? 'border border-gray-200 dark:border-gray-800 opacity-50 grayscale'
                    : 'border-2 border-transparent shadow-xl hover:shadow-2xl hover:-translate-y-1 bg-gradient-to-b from-white to-white dark:from-gray-900 dark:to-gray-900 before:absolute before:inset-0 before:-z-10 before:p-[2px] before:bg-gradient-to-br before:from-blue-200 before:to-purple-200 dark:before:from-blue-800 dark:before:to-purple-800 before:rounded-[2rem]'
              }`}
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-base font-bold text-gray-800 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-gray-700">
                    {rel.source}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <LinkIcon size={16} className="text-blue-500" />
                  </div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-base font-bold text-gray-800 dark:text-gray-100 shadow-sm border border-gray-100 dark:border-gray-700">
                    {rel.target}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-black text-3xl">
                    {rel.confidence}<span className="text-xl">%</span>
                  </div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">Confidence</div>
                </div>
              </div>

              {/* Suggested Join */}
              <div className="mb-8 relative z-10">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Zap size={16} className="text-purple-500" /> Suggested Join
                </h4>
                <div className="bg-gray-900 dark:bg-black rounded-2xl p-4 font-mono text-base text-green-400 shadow-inner border border-gray-800">
                  {rel.suggestedJoin}
                </div>
              </div>

              {/* Matching Columns */}
              <div className="mb-10 relative z-10">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Database size={16} className="text-blue-500" /> Matching Columns
                </h4>
                <div className="space-y-3">
                  {rel.matchingColumns.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50">
                      <div className="flex items-center gap-3 text-base font-semibold text-gray-700 dark:text-gray-200">
                        {col.sourceCol} <ArrowRight size={16} className="text-gray-400" /> {col.targetCol}
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-3 py-1.5 rounded-lg font-bold shadow-sm">
                        {col.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 relative z-10">
                {isAccepted ? (
                  <div className="w-full flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 py-4 rounded-2xl font-bold border-2 border-green-200 dark:border-green-800/50">
                    <Check size={24} /> Relationship Approved
                  </div>
                ) : isRejected ? (
                   <div className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-4 rounded-2xl font-bold border-2 border-red-200 dark:border-red-800/50">
                    <X size={24} /> Relationship Rejected
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => handleAction(rel.id, 'accepted')}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5"
                    >
                      <Check size={22} /> Accept
                    </button>
                    <button 
                      onClick={() => handleAction(rel.id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 py-4 rounded-2xl font-bold border-2 border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-800/50 transition-all shadow-sm"
                    >
                      <X size={22} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
