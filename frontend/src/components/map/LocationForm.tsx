import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Loader2, MapPin, Navigation, Tag, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateLocation, useUpdateLocation } from '@/hooks/useLocations'
import type { Location } from '@/store/locationStore'

const CATEGORIES = [
  'Coffee Shops',
  'Parks',
  'Offices',
  'Restaurants',
  'Hotels',
  'Landmarks',
  'Transit',
  'Other',
]

interface FormData {
  name: string
  description: string
  category: string
  latitude: string
  longitude: string
}

interface LocationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultCoords?: { lat: number; lng: number } | null
  editLocation?: Location
}

export function LocationForm({ open, onOpenChange, defaultCoords, editLocation }: LocationFormProps) {
  const isEdit = !!editLocation
  const createLocation = useCreateLocation()
  const updateLocation = useUpdateLocation(editLocation?.id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: '', description: '', category: '', latitude: '0', longitude: '0' },
  })

  const selectedCategory = watch('category')

  useEffect(() => {
    if (open) {
      if (editLocation) {
        reset({
          name: editLocation.name,
          description: editLocation.description,
          category: editLocation.category,
          latitude: String(editLocation.latitude),
          longitude: String(editLocation.longitude),
        })
      } else {
        reset({
          name: '',
          description: '',
          category: '',
          latitude: defaultCoords ? String(defaultCoords.lat.toFixed(6)) : '',
          longitude: defaultCoords ? String(defaultCoords.lng.toFixed(6)) : '',
        })
      }
    }
  }, [open, editLocation, defaultCoords, reset])

  const onSubmit = (data: FormData) => {
    const lat = parseFloat(data.latitude)
    const lng = parseFloat(data.longitude)
    const payload = {
      name: data.name.trim(),
      description: data.description.trim(),
      category: data.category,
      latitude: lat,
      longitude: lng,
    }

    if (isEdit) {
      updateLocation.mutate(payload, { onSuccess: () => onOpenChange(false) })
    } else {
      createLocation.mutate(payload, { onSuccess: () => onOpenChange(false) })
    }
  }

  const isPending = createLocation.isPending || updateLocation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border border-[#c6c6cd] bg-white rounded-xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#e8e8ed]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[#eaedff] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <DialogHeader className="p-0">
              <DialogTitle className="text-base font-semibold text-[#131b2e]">
                {isEdit ? 'Edit Data Node' : 'Register Data Node'}
              </DialogTitle>
            </DialogHeader>
          </div>
          <p className="text-xs text-[#45464d] ml-11">
            {isEdit
              ? 'Update the attributes for this location entry.'
              : 'Pin a new location and attach metadata to it.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="loc-name" className="flex items-center gap-1.5 text-xs font-semibold text-[#45464d] uppercase tracking-wide">
              <FileText className="w-3 h-3" /> Node Label
            </Label>
            <Input
              id="loc-name"
              placeholder="e.g. Central Park Coffee"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'At least 2 characters' },
              })}
            />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-[#45464d] uppercase tracking-wide">
              <Tag className="w-3 h-3" /> Category
            </Label>
            <input type="hidden" {...register('category', { required: 'Category is required' })} />
            <Select
              value={selectedCategory}
              onValueChange={(val) => setValue('category', val, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category…" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-600">{errors.category.message}</p>}
          </div>

          {/* Coordinates */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs font-semibold text-[#45464d] uppercase tracking-wide">
              <Navigation className="w-3 h-3" /> Coordinates
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#76777d] font-mono pointer-events-none">
                    LAT
                  </span>
                  <Input
                    id="loc-lat"
                    type="number"
                    step="any"
                    placeholder="51.5074"
                    className="pl-10"
                    {...register('latitude', {
                      required: 'Required',
                      validate: (v) => {
                        const n = parseFloat(v)
                        if (isNaN(n)) return 'Invalid'
                        if (n < -90 || n > 90) return '-90 to 90'
                        return true
                      },
                    })}
                  />
                </div>
                {errors.latitude && (
                  <p className="text-xs text-red-600">{errors.latitude.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#76777d] font-mono pointer-events-none">
                    LNG
                  </span>
                  <Input
                    id="loc-lng"
                    type="number"
                    step="any"
                    placeholder="-0.1278"
                    className="pl-10"
                    {...register('longitude', {
                      required: 'Required',
                      validate: (v) => {
                        const n = parseFloat(v)
                        if (isNaN(n)) return 'Invalid'
                        if (n < -180 || n > 180) return '-180 to 180'
                        return true
                      },
                    })}
                  />
                </div>
                {errors.longitude && (
                  <p className="text-xs text-red-600">{errors.longitude.message}</p>
                )}
              </div>
            </div>
            {defaultCoords && !isEdit && (
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                Pre-filled from map click
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="loc-desc" className="flex items-center gap-1.5 text-xs font-semibold text-[#45464d] uppercase tracking-wide">
              <FileText className="w-3 h-3" /> Notes <span className="normal-case font-normal text-[#76777d]">(optional)</span>
            </Label>
            <Textarea
              id="loc-desc"
              placeholder="Add any notes about this location…"
              rows={3}
              {...register('description')}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#e8e8ed]">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEdit ? 'Saving…' : 'Registering…'}
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Register Node'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
