import { Database, LogOut, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { useLogout } from '@/hooks/useAuth'
import { useLocationStore } from '@/store/locationStore'

export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const { setSidebarOpen, sidebarOpen } = useLocationStore()
  const logout = useLogout()

  return (
    <header className="h-14 flex items-center px-4 border-b border-[#c6c6cd] bg-white/90 backdrop-blur-sm z-30 relative">
      <div className="flex items-center gap-3 flex-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-[#45464d] hover:text-[#131b2e]"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Database className="h-4 w-4 text-blue-600" />
          </div>
          <span
            className="font-semibold text-[#131b2e] text-sm tracking-tight"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            GeoSaaS
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2 text-sm text-[#45464d]">
            <div className="w-7 h-7 rounded-full bg-[#eaedff] border border-[#c6c6cd] flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-[#45464d]" />
            </div>
            <span className="hidden sm:block">{user.name ?? user.email}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className="text-[#45464d] hover:text-red-600"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
