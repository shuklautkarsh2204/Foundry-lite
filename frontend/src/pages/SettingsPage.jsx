import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  Briefcase, 
  Palette, 
  Cpu, 
  Globe, 
  BarChart3, 
  HardDrive, 
  Zap, 
  Accessibility,
  Save
} from 'lucide-react';

const TABS = [
  { id: 'workspace', label: 'Workspace', icon: Briefcase },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'ollama', label: 'Ollama', icon: Cpu },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'charts', label: 'Charts', icon: BarChart3 },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'performance', label: 'Performance', icon: Zap },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('workspace');
  const { isDarkMode, toggleDarkMode } = useAppStore();

  const renderContent = () => {
    switch (activeTab) {
      case 'workspace':
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Workspace Details</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your team's workspace profile and regional settings.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workspace Name</label>
                  <input type="text" defaultValue="Foundry Lite Analytics" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Workspace ID</label>
                  <input type="text" defaultValue="ws_982jf398f" disabled className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Timezone</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white">
                    <option>UTC (Coordinated Universal Time)</option>
                    <option>America/New_York (EST)</option>
                    <option>America/Los_Angeles (PST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'theme':
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Appearance</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customize the look and feel of your workspace.</p>
              </div>
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle between light and dark theme.</p>
                  </div>
                  <button onClick={toggleDarkMode} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}>
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Accent Color</h4>
                  <div className="flex gap-3">
                    {['bg-blue-600', 'bg-purple-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-500'].map((color, i) => (
                      <button key={i} className={`w-8 h-8 rounded-full ${color} ring-2 ring-offset-2 ${i === 0 ? 'ring-blue-600 dark:ring-offset-gray-900' : 'ring-transparent'} transition-all`} />
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">UI Density</h4>
                  <select className="w-full md:w-64 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 outline-none text-gray-900 dark:text-white">
                    <option>Comfortable (Default)</option>
                    <option>Compact</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'ollama':
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Ollama AI Engine</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure your local LLM connections and parameters.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">API Endpoint</label>
                  <input type="text" defaultValue="http://localhost:11434" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white font-mono text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Model</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white">
                    <option>llama3.2</option>
                    <option>mistral</option>
                    <option>codellama</option>
                  </select>
                </div>
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Context Window Size</label>
                    <span className="text-sm text-blue-600 font-medium">8192 tokens</span>
                  </div>
                  <input type="range" min="2048" max="32768" defaultValue="8192" className="w-full accent-blue-600" />
                  <p className="text-xs text-gray-500 mt-2">Larger context windows consume more RAM but allow for larger datasets to be analyzed at once.</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'language':
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Language & Region</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Set your preferred UI language and data formatting rules.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Language</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 outline-none text-gray-900 dark:text-white">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Format</label>
                    <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 outline-none text-gray-900 dark:text-white">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number Format</label>
                    <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 outline-none text-gray-900 dark:text-white">
                      <option>1,234,567.89</option>
                      <option>1.234.567,89</option>
                      <option>1 234 567.89</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'charts':
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Chart Preferences</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure default visualization styles and behaviors.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Enable Chart Animations</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Animate chart rendering for a smoother experience.</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none">
                    <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Shared Tooltips</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show all series values in a single tooltip on hover.</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none">
                    <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                  </button>
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Default Color Palette</label>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {['bg-blue-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-yellow-500'].map((c, i) => <div key={i} className={`w-6 h-6 rounded-full ${c} ring-2 ring-white dark:ring-gray-900`} />)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Ocean (Selected)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'storage':
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Data Storage</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage local cache and dataset retention policies.</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Local Cache Usage</span>
                    <span className="text-gray-500">1.2 GB / 5.0 GB Limit</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '24%' }}></div>
                  </div>
                  <div className="mt-4">
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors">
                      Clear Cache Now
                    </button>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auto-clear unpinned chats</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 outline-none text-gray-900 dark:text-white">
                    <option>After 30 days</option>
                    <option>After 90 days</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Performance Tuning</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimize browser resource allocation for large datasets.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Hardware Acceleration</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Use GPU for rendering knowledge graphs and dense scatter plots.</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none">
                    <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Web Worker Limit</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Max parallel threads for CSV parsing.</p>
                  </div>
                  <select className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-1.5 outline-none text-gray-900 dark:text-white text-sm">
                    <option>Auto (4)</option>
                    <option>2 Threads</option>
                    <option>8 Threads</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'accessibility':
        return (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Accessibility</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure assistive tools and contrast settings.</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">High Contrast UI</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Increase border visibility and text contrast.</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-300 dark:bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none">
                    <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Reduce Motion</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Disable transitions and UI animations.</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-300 dark:bg-gray-700 transition-colors duration-200 ease-in-out focus:outline-none">
                    <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Screen Reader Optimization</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Announce dynamic chart changes automatically.</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none">
                    <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your workspace preferences and account settings.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 min-h-0 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 overflow-y-auto pr-4 no-scrollbar">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto pb-12 pr-4 no-scrollbar">
          <div className="max-w-3xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
