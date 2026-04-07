import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, Plus } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { MapView } from '@/components/map/MapView'
import { LocationPanel } from '@/components/map/LocationPanel'
import { LocationForm } from '@/components/map/LocationForm'
import { LocationList } from '@/components/sidebar/LocationList'
import { Button } from '@/components/ui/button'
import { useLocations, useViewportLocations, useClusters } from '@/hooks/useLocations'
import type { BboxParams } from '@/hooks/useLocations'
import { useLocationStore } from '@/store/locationStore'
import { cn } from '@/lib/utils'

export default function Map() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: allLocations, isLoading } = useLocations()
  const { selectedLocationId, setSelectedLocation, sidebarOpen } = useLocationStore()

  const [addFormOpen, setAddFormOpen] = useState(false)
  const [addCoords, setAddCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [bbox, setBbox] = useState<BboxParams | null>(null)
  const [mapZoom, setMapZoom] = useState(3)

  const { data: viewportLocations = [] } = useViewportLocations(bbox)
  const { data: clusters = [] } = useClusters(bbox, mapZoom)

  // Use viewport-filtered locations at zoom >= 14, otherwise all for sidebar
  const mapLocations = mapZoom >= 14 ? viewportLocations : (allLocations ?? [])

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) setSelectedLocation(id)
  }, [searchParams, setSelectedLocation])

  const handleMarkerClick = useCallback(
    (id: string) => {
      setSelectedLocation(id)
      setSearchParams({ id })
    },
    [setSelectedLocation, setSearchParams]
  )

  const handleClosePanel = useCallback(() => {
    setSelectedLocation(null)
    setSearchParams({})
  }, [setSelectedLocation, setSearchParams])

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (!selectedLocationId) {
        setAddCoords({ lat, lng })
        setAddFormOpen(true)
      }
    },
    [selectedLocationId]
  )

  const handleBoundsChange = useCallback((newBbox: BboxParams, zoom: number) => {
    setBbox(newBbox)
    setMapZoom(zoom)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-[#faf8ff] overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            'flex-shrink-0 border-r border-[#c6c6cd] bg-white flex flex-col transition-all duration-300 overflow-hidden',
            sidebarOpen ? 'w-80' : 'w-0'
          )}
        >
          <LocationList onSelectLocation={handleMarkerClick} />
        </aside>

        {/* Map area */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#faf8ff]/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-sm text-[#45464d]">Loading locations…</p>
              </div>
            </div>
          )}

          <MapView
            locations={mapLocations}
            allLocations={allLocations ?? []}
            clusters={clusters}
            zoom={mapZoom}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            onBoundsChange={handleBoundsChange}
          />

          {/* Add location button */}
          <div className="absolute bottom-6 right-6 z-[1000]">
            <Button
              onClick={() => {
                setAddCoords(null)
                setAddFormOpen(true)
              }}
              className="shadow-lg h-12 px-5 gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Location
            </Button>
          </div>

          {/* Map hint */}
          {!isLoading && (allLocations?.length ?? 0) > 0 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm border border-[#c6c6cd] rounded-lg px-3 py-2 shadow-sm">
                <p className="text-xs text-[#45464d] text-center">
                  Click a marker to view details · Click the map to add a location
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Location detail panel */}
        {selectedLocationId && (
          <LocationPanel
            locationId={selectedLocationId}
            onClose={handleClosePanel}
          />
        )}
      </div>

      {/* Add/Edit form */}
      <LocationForm
        open={addFormOpen}
        onOpenChange={setAddFormOpen}
        defaultCoords={addCoords}
      />
    </div>
  )
}
