import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      isDarkMode: false,
      isSidebarCollapsed: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
    }),
    {
      name: 'app-storage', // name of the item in the storage (must be unique)
    }
  )
);
