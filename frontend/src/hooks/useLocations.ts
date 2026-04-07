import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, getErrorMessage, type ApiResponse } from '@/lib/api'
import { useLocationStore, type Location } from '@/store/locationStore'
import { toast } from '@/hooks/useToast'

const LOCATIONS_KEY = ['locations'] as const
const CLUSTERS_KEY = ['clusters'] as const

export interface BboxParams {
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
}

export interface ClusterResult {
  lat: number
  lng: number
  count: number
  cell: string
}

// Fetch all locations (sidebar / fallback — no bbox)
export function useLocations() {
  const filterCategory = useLocationStore((s) => s.filterCategory)

  return useQuery({
    queryKey: [...LOCATIONS_KEY, { category: filterCategory }],
    queryFn: async () => {
      const params: Record<string, string> = { page: '1', pageSize: '200' }
      if (filterCategory) params.category = filterCategory
      const res = await api.get<ApiResponse<Location[]>>('/api/locations', { params })
      return res.data.data
    },
  })
}

// Fetch locations within the current map viewport
export function useViewportLocations(bbox: BboxParams | null) {
  const filterCategory = useLocationStore((s) => s.filterCategory)

  return useQuery({
    queryKey: [...LOCATIONS_KEY, 'viewport', bbox, { category: filterCategory }],
    queryFn: async ({ signal }) => {
      if (!bbox) return []
      const params: Record<string, string> = {
        page: '1',
        pageSize: '500',
        minLat: String(bbox.minLat),
        maxLat: String(bbox.maxLat),
        minLng: String(bbox.minLng),
        maxLng: String(bbox.maxLng),
      }
      if (filterCategory) params.category = filterCategory
      const res = await api.get<ApiResponse<Location[]>>('/api/locations', {
        params,
        signal,
      })
      return res.data.data ?? []
    },
    enabled: bbox !== null,
    staleTime: 30_000,
  })
}

// Fetch server-side clusters for low-zoom views
export function useClusters(bbox: BboxParams | null, zoom: number) {
  return useQuery({
    queryKey: [...CLUSTERS_KEY, bbox, zoom],
    queryFn: async ({ signal }) => {
      if (!bbox) return []
      const params = {
        minLat: String(bbox.minLat),
        maxLat: String(bbox.maxLat),
        minLng: String(bbox.minLng),
        maxLng: String(bbox.maxLng),
        zoom: String(zoom),
      }
      const res = await api.get<ApiResponse<ClusterResult[]>>(
        '/api/locations/clusters',
        { params, signal }
      )
      return res.data.data ?? []
    },
    enabled: bbox !== null && zoom < 14,
    staleTime: 60_000,
  })
}

export function useLocation(id: string | null) {
  return useQuery({
    queryKey: [...LOCATIONS_KEY, id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Location>>(`/api/locations/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}

export interface LocationPayload {
  name: string
  description: string
  category: string
  latitude: number
  longitude: number
}

export function useCreateLocation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: LocationPayload) => {
      const res = await api.post<ApiResponse<Location>>('/api/locations', payload)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LOCATIONS_KEY })
      toast({ variant: 'success' as never, title: 'Location added', description: 'Your new location has been saved.' })
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Failed to add location', description: getErrorMessage(error) })
    },
  })
}

export function useUpdateLocation(id: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Partial<LocationPayload>) => {
      const res = await api.put<ApiResponse<Location>>(`/api/locations/${id}`, payload)
      return res.data.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LOCATIONS_KEY })
      toast({ title: 'Location updated' })
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Failed to update', description: getErrorMessage(error) })
    },
  })
}

export function useDeleteLocation() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/locations/${id}`)
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LOCATIONS_KEY })
      toast({ title: 'Location deleted' })
    },
    onError: (error) => {
      toast({ variant: 'destructive', title: 'Failed to delete', description: getErrorMessage(error) })
    },
  })
}

export function useCategories() {
  const { data: locations } = useLocations()
  if (!locations) return []
  return [...new Set(locations.map((l) => l.category))].sort()
}
