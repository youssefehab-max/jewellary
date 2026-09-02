import { create } from 'zustand'

// Global UI state: nav drawer, search overlay, announcement/app bar visibility.
// Kept separate from CartContext so cart re-renders don't cascade into nav/search UI.
export const useUIStore = create((set) => ({
  isNavOpen: false,
  isSearchOpen: false,
  isAppBarVisible: true,
  isAnnouncementVisible: true,

  openNav: () => set({ isNavOpen: true }),
  closeNav: () => set({ isNavOpen: false }),
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  closeSearch: () => set({ isSearchOpen: false }),
  dismissAppBar: () => set({ isAppBarVisible: false }),
  dismissAnnouncement: () => set({ isAnnouncementVisible: false }),
}))
