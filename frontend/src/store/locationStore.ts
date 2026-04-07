import { create } from 'zustand'

export interface Location {
  id: string
  name: string
  description: string
  category: string
  latitude: number
  longitude: number
  createdBy: string
  createdAt: string
  updatedAt: string
}

interface LocationState {
  selectedLocationId: string | null
  filterCategory: string
  sidebarOpen: boolean
  setSelectedLocation: (id: string | null) => void
  setFilterCategory: (category: string) => void
  setSidebarOpen: (open: boolean) => void
}

export const useLocationStore = create<LocationState>()((set) => ({
  selectedLocationId: null,
  filterCategory: '',
  sidebarOpen: true,
  setSelectedLocation: (id) => set({ selectedLocationId: id }),
  setFilterCategory: (category) => set({ filterCategory: category }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
