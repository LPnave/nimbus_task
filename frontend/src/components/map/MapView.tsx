import { useEffect, useRef, useCallback, useState } from 'react'
import Map, {
  Source,
  Layer,
  type MapRef,
  type MapLayerMouseEvent,
} from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Location } from '@/store/locationStore'
import { useLocationStore } from '@/store/locationStore'
import type { BboxParams, ClusterResult } from '@/hooks/useLocations'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

const CATEGORY_COLORS: Record<string, string> = {
  'Coffee Shops': '#f59e0b',
  Parks: '#22c55e',
  Offices: '#3b82f6',
  Restaurants: '#f97316',
  Hotels: '#8b5cf6',
  Landmarks: '#ec4899',
  Transit: '#06b6d4',
  default: '#14b8a6',
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default
}

const MAP_STYLE = {
  version: 8 as const,
  sources: {
    carto: {
      type: 'raster' as const,
      tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    },
  },
  layers: [
    {
      id: 'carto-tiles',
      type: 'raster' as const,
      source: 'carto',
    },
  ],
}

const INTERACTIVE_LAYER_IDS = ['location-points', 'location-points-selected', 'cluster-circles']

interface MapViewProps {
  locations: Location[]
  allLocations: Location[]
  clusters: ClusterResult[]
  zoom: number
  onMarkerClick: (id: string) => void
  onMapClick: (lat: number, lng: number) => void
  onBoundsChange: (bbox: BboxParams, zoom: number) => void
}

export function MapView({
  locations,
  allLocations,
  clusters,
  zoom,
  onMarkerClick,
  onMapClick,
  onBoundsChange,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const selectedLocationId = useLocationStore((s) => s.selectedLocationId)
  const [cursor, setCursor] = useState<string>('grab')

  // Fly to selected location — always search allLocations so it works at any zoom level
  useEffect(() => {
    if (!selectedLocationId || !mapRef.current) return
    const loc = allLocations.find((l) => l.id === selectedLocationId)
    if (loc) {
      mapRef.current.flyTo({
        center: [loc.longitude, loc.latitude],
        zoom: Math.max(mapRef.current.getZoom(), 14),
        duration: 1200,
      })
    }
  }, [selectedLocationId, allLocations])

  const reportBounds = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const bounds = map.getBounds()
    const currentZoom = Math.round(map.getZoom())
    onBoundsChange(
      {
        minLat: bounds.getSouth(),
        maxLat: bounds.getNorth(),
        minLng: bounds.getWest(),
        maxLng: bounds.getEast(),
      },
      currentZoom
    )
  }, [onBoundsChange])

  const handleMoveEnd = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(reportBounds, 300)
  }, [reportBounds])

  const handleLoad = useCallback(() => {
    reportBounds()
  }, [reportBounds])

  // Unified click handler: feature click or background click
  const handleClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const feature = e.features?.[0]
      if (feature) {
        const id = feature.properties?.id as string | undefined
        if (id) {
          onMarkerClick(id)
          return
        }
      }
      onMapClick(e.lngLat.lat, e.lngLat.lng)
    },
    [onMarkerClick, onMapClick]
  )

  const handleMouseEnter = useCallback(() => setCursor('pointer'), [])
  const handleMouseLeave = useCallback(() => setCursor('grab'), [])

  // Build GeoJSON for individual locations (zoom >= 14)
  const locationsGeoJson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: locations.map((loc) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [loc.longitude, loc.latitude] },
      properties: {
        id: loc.id,
        name: loc.name,
        category: loc.category,
        color: getCategoryColor(loc.category),
        selected: loc.id === selectedLocationId,
      },
    })),
  }

  // Build GeoJSON for server-side clusters (zoom < 14)
  const clustersGeoJson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: clusters.map((c) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
      properties: { count: c.count, cell: c.cell },
    })),
  }

  const useVectorTiles = zoom < 14 && clusters.length === 0

  return (
    <Map
      ref={mapRef}
      initialViewState={{ longitude: 0, latitude: 20, zoom: 3 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle={MAP_STYLE}
      cursor={cursor}
      interactiveLayerIds={INTERACTIVE_LAYER_IDS}
      onMoveEnd={handleMoveEnd}
      onLoad={handleLoad}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Vector tile source — fallback at very low zoom before clusters load */}
      {useVectorTiles && (
        <Source
          id="locations-tiles"
          type="vector"
          tiles={[`${API_BASE}/api/tiles/{z}/{x}/{y}.mvt`]}
          minzoom={0}
          maxzoom={14}
        >
          <Layer
            id="location-dots-tile"
            type="circle"
            source-layer="locations"
            paint={{
              'circle-radius': 4,
              'circle-color': '#2563eb',
              'circle-opacity': 0.75,
            }}
          />
        </Source>
      )}

      {/* Server-side clusters (zoom < 14, after they load) */}
      {zoom < 14 && clusters.length > 0 && (
        <Source id="clusters-source" type="geojson" data={clustersGeoJson}>
          <Layer
            id="cluster-circles"
            type="circle"
            paint={{
              'circle-radius': [
                'interpolate', ['linear'], ['get', 'count'],
                1, 12, 100, 22, 1000, 32, 10000, 44,
              ],
              'circle-color': '#2563eb',
              'circle-opacity': 0.85,
            }}
          />
          <Layer
            id="cluster-labels"
            type="symbol"
            layout={{
              'text-field': ['to-string', ['get', 'count']],
              'text-size': 11,
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            }}
            paint={{ 'text-color': '#ffffff' }}
          />
        </Source>
      )}

      {/* Individual location markers (zoom >= 14) */}
      {zoom >= 14 && (
        <Source id="locations-source" type="geojson" data={locationsGeoJson}>
          <Layer
            id="location-points"
            type="circle"
            filter={['!=', ['get', 'selected'], true]}
            paint={{
              'circle-radius': 8,
              'circle-color': ['get', 'color'],
              'circle-opacity': 0.9,
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#ffffff',
            }}
          />
          <Layer
            id="location-points-selected"
            type="circle"
            filter={['==', ['get', 'selected'], true]}
            paint={{
              'circle-radius': 12,
              'circle-color': ['get', 'color'],
              'circle-opacity': 1,
              'circle-stroke-width': 3,
              'circle-stroke-color': '#ffffff',
            }}
          />
        </Source>
      )}
    </Map>
  )
}
