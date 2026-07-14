import { useState, useEffect } from 'react';
import { Search, Bell, Sun, Moon, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import GlobalSearchModal from './GlobalSearchModal';

export default function Header() {
  const { isDarkMode, toggleDarkMode } = useAppStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-between px-6 shrink-0 transition-colors duration-200">
        <div className="flex flex-1 items-center max-w-xl">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md leading-5 bg-gray-50 dark:bg-gray-900 text-left text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
            >
              Search resources, datasets, documentation...
              <span className="absolute right-3 top-[7px] hidden sm:flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 font-bold">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 font-bold">K</kbd>
              </span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 ml-6">
          <button 
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell size={20} />
          </button>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center border border-blue-200 dark:border-blue-800 cursor-pointer text-blue-700 dark:text-blue-300">
            <User size={18} />
          </div>
        </div>
      </header>
      
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
