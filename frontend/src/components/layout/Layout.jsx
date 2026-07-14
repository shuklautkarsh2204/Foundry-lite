import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppStore } from '../../store/useAppStore';

export default function Layout() {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden transition-colors duration-200">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 transition-colors duration-200">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
