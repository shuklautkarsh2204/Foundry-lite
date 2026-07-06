import { NavLink } from 'react-router-dom';
import { Home, Database, Network, Bot, Settings, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

const navLinks = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/sources', label: 'My Datasets', icon: Database },
  { to: '/relationships', label: 'Relationships', icon: Network },
  { to: '/ai', label: 'AI Assistant', icon: Bot },
];

const bottomLinks = [
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarCollapsed ? 80 : 256 }}
      className="relative flex flex-col h-full bg-gray-900 border-r border-gray-800 text-gray-300 shrink-0"
    >
      <div className="flex items-center h-16 px-4 border-b border-gray-800 overflow-hidden">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center justify-center w-10 h-10 rounded bg-blue-600 text-white shrink-0">
            <LayoutGrid size={24} />
          </div>
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col whitespace-nowrap"
            >
              <span className="font-semibold text-white tracking-tight">Foundry Lite</span>
              <span className="text-xs text-gray-400">Workspace</span>
            </motion.div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        <div className="mb-4">
          {!isSidebarCollapsed && <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main Menu</h3>}
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive ? 'bg-blue-600/10 text-blue-500' : 'hover:bg-gray-800 hover:text-white',
                  isSidebarCollapsed && 'justify-center px-0'
                )
              }
              title={isSidebarCollapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-gray-800">
        {bottomLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors mb-2',
                  isActive ? 'bg-blue-600/10 text-blue-500' : 'hover:bg-gray-800 hover:text-white',
                  isSidebarCollapsed && 'justify-center px-0'
                )
              }
              title={isSidebarCollapsed ? label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
        ))}

        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </motion.aside>
  );
}
