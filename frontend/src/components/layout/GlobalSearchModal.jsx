import React, { useState, useEffect, useRef } from 'react';
import { Search, Database, Columns, Link2, LayoutDashboard, Share2, Network, MessageSquare, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_SEARCH_INDEX = [
  { id: 'd1', category: 'Datasets', title: 'sales_data_q3.csv', subtitle: '3.4M rows • Last updated 2 days ago', icon: Database },
  { id: 'd2', category: 'Datasets', title: 'customer_profiles.csv', subtitle: '850K rows • Marketing DB', icon: Database },
  { id: 'c1', category: 'Columns', title: 'revenue', subtitle: 'Float64 • Found in sales_data_q3.csv', icon: Columns },
  { id: 'c2', category: 'Columns', title: 'customer_id', subtitle: 'String • Found in 4 datasets', icon: Columns },
  { id: 'r1', category: 'Relationships', title: 'Customer → Orders', subtitle: '1-to-Many • 98% Match Confidence', icon: Link2 },
  { id: 'db1', category: 'Dashboards', title: 'Q3 Financial Overview', subtitle: 'Created by Alice • 4 widgets', icon: LayoutDashboard },
  { id: 'o1', category: 'Ontology', title: 'Customer Entity', subtitle: 'Mapped to 3 datasets', icon: Share2 },
  { id: 'o2', category: 'Ontology', title: 'Product Entity', subtitle: 'Mapped to inventory.csv', icon: Share2 },
  { id: 'k1', category: 'Knowledge Graph', title: 'Acme Corp (Node)', subtitle: 'Connected to 5 orders', icon: Network },
  { id: 'ch1', category: 'Chat History', title: 'Show me the revenue trend for Q3', subtitle: 'Yesterday • Data Assistant', icon: MessageSquare },
  { id: 'ch2', category: 'Chat History', title: 'Analyse top 5 customers', subtitle: 'Last week • Data Assistant', icon: MessageSquare },
];

export default function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim() === '' 
    ? [] 
    : MOCK_SEARCH_INDEX.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  // Group by category
  const groupedResults = results.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Flatten for keyboard navigation
  const flatResults = Object.values(groupedResults).flat();

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (flatResults[selectedIndex]) {
        handleSelect(flatResults[selectedIndex]);
      }
    }
  };

  const handleSelect = (item) => {
    // In a real app, this would route to the specific resource
    // For Foundry-lite, we route generically or close
    if (item.category === 'Chat History') {
      navigate('/ai');
    } else {
      navigate('/datasets');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 dark:bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-100 dark:border-gray-800 px-4 py-4">
          <Search size={22} className="text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 px-4"
            placeholder="Search resources, datasets, documentation..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto pb-4">
          {query.trim() === '' ? (
            <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {['sales_data', 'revenue', 'Dashboards', 'Chat History'].map(t => (
                  <button key={t} onClick={() => setQuery(t)} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : flatResults.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No results found for "<span className="font-semibold text-gray-700 dark:text-gray-300">{query}</span>"
            </div>
          ) : (
            <div className="px-2 pt-2">
              {Object.entries(groupedResults).map(([category, items]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <div className="px-4 py-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {category}
                  </div>
                  <ul className="space-y-1">
                    {items.map(item => {
                      const index = flatResults.indexOf(item);
                      const isSelected = index === selectedIndex;
                      const Icon = item.icon;
                      
                      return (
                        <li key={item.id}>
                          <button
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                              isSelected ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                              <Icon size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                                {item.title}
                              </h4>
                              <p className={`text-xs truncate ${isSelected ? 'text-blue-500 dark:text-blue-500/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                {item.subtitle}
                              </p>
                            </div>
                            {isSelected && (
                              <ChevronRight size={16} className="text-blue-500 shrink-0" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-end gap-4 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 font-mono text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700">↑↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 font-mono text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700">↵</kbd>
            <span>to select</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 font-mono text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700">esc</kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
