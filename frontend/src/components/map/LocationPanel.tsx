import { useMemo, useState } from 'react'
import {
  X,
  Clock,
  Tag,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Shield,
  Activity,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { LocationForm } from '@/components/map/LocationForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useLocation, useDeleteLocation } from '@/hooks/useLocations'
import { useAuthStore } from '@/store/authStore'

interface LocationPanelProps {
  locationId: string
  onClose: () => void
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatTimeSince(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function seededBars(seed: string): number[] {
  return Array.from({ length: 7 }, (_, i) => {
    const a = seed.charCodeAt(i % seed.length)
    const b = seed.charCodeAt((i * 3 + 2) % seed.length)
    return 20 + ((a * 7 + b * 13) % 55)
  })
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

const categorySecurityLevel: Record<string, string> = {
  'Coffee Shops': 'Standard',
  Parks: 'Public Access',
  Offices: 'Tier-2 Restricted',
  Restaurants: 'Standard',
  Hotels: 'Tier-3 Private',
  Landmarks: 'Public Access',
  default: 'Standard',
}

export function LocationPanel({ locationId, onClose }: LocationPanelProps) {
  const { data: location, isLoading } = useLocation(locationId)
  const deleteLocation = useDeleteLocation()
  const currentUser = useAuthStore((s) => s.user)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const isOwner = location?.createdBy === currentUser?.id
  const bars = useMemo(() => seededBars(locationId), [locationId])
  const maxBar = Math.max(...bars)

  const pointId = `#${locationId.slice(0, 8).toUpperCase()}`
  const securityLevel =
    categorySecurityLevel[location?.category ?? ''] ?? categorySecurityLevel.default

  const handleDelete = () => {
    deleteLocation.mutate(locationId, {
      onSuccess: () => {
        setDeleteOpen(false)
        onClose()
      },
    })
  }

  return (
    <>
      <div className="w-80 flex-shrink-0 border-l border-[#c6c6cd] bg-white flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#c6c6cd] bg-[#f2f3ff]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <Skeleton className="h-4 w-24 mb-1" />
              ) : (
                <p className="text-[11px] font-mono text-[#76777d] mb-1">{pointId}</p>
              )}
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Data Node Insight
              </p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 p-1.5 rounded-md text-[#76777d] hover:text-[#131b2e] hover:bg-[#eaedff] transition-colors"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isLoading ? (
            <>
              <Skeleton className="h-5 w-44 mb-1.5" />
              <Skeleton className="h-3.5 w-36" />
            </>
          ) : (
            <>
              <h2
                className="font-bold text-base text-[#131b2e] truncate"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                {location?.name ?? '—'}
              </h2>
              {location && (
                <p className="text-xs text-[#45464d] mt-0.5">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)} &bull; Last
                  sync:{' '}
                  <span className="text-blue-600">{formatTimeSince(location.updatedAt)}</span>
                </p>
              )}
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {isLoading ? (
            <div className="p-5">
              <LocationPanelSkeleton />
            </div>
          ) : location ? (
            <>
              {/* Status + actions */}
              <div className="flex items-center gap-2 px-5 py-3 border-b border-[#c6c6cd]">
                <Badge variant="success" className="text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse inline-block" />
                  Operational
                </Badge>
                {isOwner && (
                  <Badge variant="secondary" className="text-xs">
                    Owned
                  </Badge>
                )}
                <div className="ml-auto flex items-center gap-1.5">
                  {isOwner && (
                    <button
                      onClick={() => setEditOpen(true)}
                      className="flex items-center gap-1 text-[11px] text-[#45464d] hover:text-[#131b2e] transition-colors px-2 py-1 rounded hover:bg-[#eaedff]"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </button>
                  )}
                  <a
                    href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-[#45464d] hover:text-[#131b2e] transition-colors px-2 py-1 rounded hover:bg-[#eaedff]"
                  >
                    <Share2 className="h-3 w-3" />
                    Export
                  </a>
                </div>
              </div>

              {/* Coordinate metrics */}
              <div className="grid grid-cols-2 gap-3 p-5 pb-3">
                <div className="p-3 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff]">
                  <p className="text-[10px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                    Latitude
                  </p>
                  <p
                    className="text-base font-bold text-[#131b2e] leading-tight"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    {location.latitude.toFixed(4)}
                  </p>
                  <p className="text-[10px] text-blue-600 mt-1">
                    {location.latitude >= 0 ? '↑ North' : '↓ South'}
                  </p>
                </div>
                <div className="p-3 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff]">
                  <p className="text-[10px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                    Longitude
                  </p>
                  <p
                    className="text-base font-bold text-[#131b2e] leading-tight"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    {location.longitude.toFixed(4)}
                  </p>
                  <p className="text-[10px] text-blue-600 mt-1">
                    {location.longitude >= 0 ? '→ East' : '← West'}
                  </p>
                </div>
              </div>

              {/* 7-Day Activity Trend */}
              <div className="px-5 pb-4">
                <div className="p-4 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Activity className="h-3.5 w-3.5 text-blue-600" />
                      <span className="text-xs font-semibold text-[#131b2e]">
                        7-Day Activity Trend
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-600 animate-pulse">
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-end gap-1 h-14">
                    {bars.map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-sm transition-all"
                          style={{
                            height: `${(h / maxBar) * 100}%`,
                            background:
                              i === 6
                                ? 'rgba(37,99,235,0.85)'
                                : 'rgba(37,99,235,0.2)',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    {DAYS.map((d, i) => (
                      <div key={d} className="flex-1 text-center">
                        <span
                          className={`text-[9px] font-medium ${
                            i === 6 ? 'text-blue-600' : 'text-[#76777d]'
                          }`}
                        >
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="bg-[#c6c6cd]" />

              {/* Security level */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff]">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#45464d] uppercase tracking-wider font-semibold">
                      Security Level
                    </p>
                    <p className="text-sm font-medium text-[#131b2e] truncate">{securityLevel}</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-[#76777d] flex-shrink-0" />
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff]">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Tag className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#45464d] uppercase tracking-wider font-semibold">
                      Category
                    </p>
                    <p className="text-sm font-medium text-[#131b2e] truncate">
                      {location.category}
                    </p>
                  </div>
                </div>

                {/* Health stats row */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff] text-center">
                    <p className="text-[10px] text-[#45464d] mb-0.5">Owner</p>
                    <p className="text-xs font-semibold text-[#131b2e]">
                      {isOwner ? 'You' : 'Other'}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff] text-center">
                    <p className="text-[10px] text-[#45464d] mb-0.5">Health</p>
                    <p className="text-xs font-semibold text-green-600">Stable</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {location.description && (
                <div className="px-5 pb-4">
                  <p className="text-[10px] font-semibold text-[#45464d] uppercase tracking-wider mb-2">
                    Description
                  </p>
                  <p className="text-sm text-[#45464d] leading-relaxed">{location.description}</p>
                </div>
              )}

              <Separator className="bg-[#c6c6cd]" />

              {/* Timeline + Google Maps */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#45464d]">
                  <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>Added {formatDate(location.createdAt)}</span>
                </div>
                {location.updatedAt !== location.createdAt && (
                  <div className="flex items-center gap-2 text-xs text-[#45464d]">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Updated {formatDate(location.updatedAt)}</span>
                  </div>
                )}

                <a
                  href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff] hover:border-blue-500/40 hover:bg-[#eaedff] transition-all group text-sm text-[#45464d] hover:text-[#131b2e]"
                >
                  <span className="flex items-center gap-2 text-xs">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Full Audit Trace
                  </span>
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <p className="text-[10px] text-[#76777d] text-center">
                  View all logs since node inception
                </p>
              </div>

              {/* Map legend */}
              <div className="px-5 pb-5">
                <Separator className="mb-4 bg-[#c6c6cd]" />
                <p className="text-[10px] font-semibold text-[#45464d] uppercase tracking-wider mb-3">
                  Map Legend
                </p>
                <div className="grid grid-cols-3 gap-2 text-[10px] text-[#45464d]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <span>Coffee</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <span>Parks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span>Offices</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />
                    <span>Eats</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                    <span>Hotels</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-5 text-center text-[#45464d] text-sm py-8">
              Location not found.
            </div>
          )}
        </div>

        {/* Footer actions (owner only) */}
        {isOwner && !isLoading && location && (
          <div className="p-5 border-t border-[#c6c6cd] flex gap-2 bg-white">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setEditOpen(true)}
            >
              <Edit2 className="h-3.5 w-3.5" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {location && (
        <LocationForm open={editOpen} onOpenChange={setEditOpen} editLocation={location} />
      )}

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <strong className="text-[#131b2e]">{location?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLocation.isPending}
            >
              {deleteLocation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function LocationPanelSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-6 w-24 rounded-full" />
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff] space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        <div className="p-3 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff] space-y-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
      <div className="p-4 rounded-lg border border-[#c6c6cd] bg-[#f2f3ff] space-y-3">
        <Skeleton className="h-3 w-32" />
        <div className="flex items-end gap-1 h-12">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="flex-1 rounded-sm" style={{ height: `${30 + i * 8}%` }} />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}
