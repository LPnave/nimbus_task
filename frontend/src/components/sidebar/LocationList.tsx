import { useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Search, MapPin, SlidersHorizontal, X, TrendingUp, BarChart2, Download } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLocations, useCategories } from '@/hooks/useLocations'
import { useLocationStore } from '@/store/locationStore'
import { cn } from '@/lib/utils'
import type { Location } from '@/store/locationStore'

const categoryColors: Record<string, string> = {
  'Coffee Shops': 'text-amber-600',
  Parks: 'text-green-600',
  Offices: 'text-blue-600',
  Restaurants: 'text-orange-600',
  Hotels: 'text-purple-600',
  default: 'text-blue-600',
}

function getCategoryColor(category: string): string {
  return categoryColors[category] ?? categoryColors.default
}

interface LocationListProps {
  onSelectLocation: (id: string) => void
}

export function LocationList({ onSelectLocation }: LocationListProps) {
  const [search, setSearch] = useState('')
  const { data: locations, isLoading, isError } = useLocations()
  const categories = useCategories()
  const { selectedLocationId, filterCategory, setFilterCategory } = useLocationStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  const filtered = (locations ?? []).filter((loc) => {
    const matchesSearch =
      !search ||
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.category.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !filterCategory || loc.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const total = locations?.length ?? 0

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 72,
    overscan: 5,
    measureElement: (el) => el.getBoundingClientRect().height,
  })

  return (
    <div className="flex flex-col h-full">
      {/* Stats header */}
      <div className="p-4 border-b border-[#c6c6cd] space-y-3 bg-[#f2f3ff]">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-lg border border-[#c6c6cd] bg-white">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp className="h-3 w-3 text-blue-600" />
              <span className="text-[10px] font-semibold text-[#45464d] uppercase tracking-wider">
                Locations
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-8" />
            ) : (
              <p
                className="text-lg font-bold text-[#131b2e] leading-none"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                {total.toLocaleString()}
              </p>
            )}
          </div>
          <div className="p-3 rounded-lg border border-[#c6c6cd] bg-white">
            <div className="flex items-center gap-1.5 mb-1.5">
              <BarChart2 className="h-3 w-3 text-blue-600" />
              <span className="text-[10px] font-semibold text-[#45464d] uppercase tracking-wider">
                Categories
              </span>
            </div>
            {isLoading ? (
              <Skeleton className="h-5 w-5" />
            ) : (
              <p
                className="text-lg font-bold text-[#131b2e] leading-none"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                {categories.length}
              </p>
            )}
          </div>
        </div>

        {/* Live Feed status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
            <span className="text-xs text-[#45464d]">Live Feed Analysis</span>
          </div>
          <button className="flex items-center gap-1 text-[11px] text-[#45464d] hover:text-blue-600 transition-colors">
            <Download className="h-3 w-3" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Search & Filter header */}
      <div className="p-4 border-b border-[#c6c6cd] space-y-3 bg-white">
        <div className="flex items-center justify-between">
          <h2
            className="text-sm font-semibold text-[#131b2e]"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Locations
          </h2>
          {!isLoading && (
            <span className="text-xs text-[#45464d]">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#76777d]" />
          <Input
            placeholder="Search locations…"
            className="pl-8 h-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#131b2e]"
              onClick={() => setSearch('')}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[#76777d] flex-shrink-0" />
          <Select
            value={filterCategory || 'all'}
            onValueChange={(val) => setFilterCategory(val === 'all' ? '' : val)}
          >
            <SelectTrigger className="h-8 text-xs flex-1">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filterCategory && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setFilterCategory('')}
              className="h-8 w-8 flex-shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Virtualized List */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 bg-white">
        {isLoading ? (
          <LocationListSkeleton />
        ) : isError ? (
          <div className="p-4 text-center">
            <p className="text-sm text-red-600">Failed to load locations.</p>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasSearch={!!search || !!filterCategory} />
        ) : (
          <div
            style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const loc = filtered[virtualItem.index]
              return (
                <div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <LocationCard
                    location={loc}
                    selected={loc.id === selectedLocationId}
                    onSelect={() => onSelectLocation(loc.id)}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function LocationCard({
  location,
  selected,
  onSelect,
}: {
  location: Location
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full text-left p-3 rounded-lg border transition-all duration-150',
        selected
          ? 'border-blue-500/40 bg-blue-500/8 text-[#131b2e]'
          : 'border-transparent hover:border-[#c6c6cd] hover:bg-[#f2f3ff] text-[#45464d]'
      )}
    >
      <div className="flex items-start gap-2.5">
        <MapPin
          className={cn('h-3.5 w-3.5 mt-0.5 flex-shrink-0', getCategoryColor(location.category))}
        />
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'text-sm font-medium truncate',
              selected ? 'text-[#131b2e]' : 'text-[#131b2e]'
            )}
          >
            {location.name}
          </p>
          <Badge
            variant="secondary"
            className="mt-1 text-[10px] px-1.5 py-0 h-4 font-normal border-0 bg-[#eaedff] text-[#45464d]"
          >
            {location.category}
          </Badge>
        </div>
      </div>
    </button>
  )
}

function LocationListSkeleton() {
  return (
    <div className="space-y-1 p-1">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-3 rounded-lg border border-transparent">
          <div className="flex items-start gap-2.5">
            <Skeleton className="h-3.5 w-3.5 rounded-full mt-0.5 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3.5 w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#eaedff] border border-[#c6c6cd] flex items-center justify-center mb-4">
        <MapPin className="h-5 w-5 text-[#45464d]" />
      </div>
      <p className="text-sm font-medium text-[#131b2e] mb-1">
        {hasSearch ? 'No matches found' : 'No locations yet'}
      </p>
      <p className="text-xs text-[#45464d]">
        {hasSearch
          ? 'Try a different search or clear the filter.'
          : 'Click "Add Location" or click anywhere on the map to get started.'}
      </p>
    </div>
  )
}
