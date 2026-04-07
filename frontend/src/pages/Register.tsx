import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Eye, EyeOff, Database, Cloud, Lock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRegister } from '@/hooks/useAuth'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
})

type FormData = z.infer<typeof schema>

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const register = useRegister()

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    register.mutate({ name: data.name, email: data.email, password: data.password })
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-center w-1/2 p-16 bg-[#f2f3ff] border-r border-[#c6c6cd] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 40% 60%, rgba(37,99,235,0.06) 0%, transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #131b2e 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8">
            <Database className="h-8 w-8 text-blue-600" />
          </div>
          <h1
            className="text-4xl font-bold text-[#131b2e] tracking-tight mb-3"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            GeoSaaS
          </h1>
          <p className="text-[#45464d] text-sm leading-relaxed max-w-xs">
            Enterprise-grade data architecture.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Database className="h-4 w-4 text-blue-600" />
            </div>
            <span
              className="font-bold text-[#131b2e]"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              GeoSaaS
            </span>
          </div>

          <div className="mb-8">
            <h2
              className="text-2xl font-bold text-[#131b2e] mb-2"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              Begin Your Curation
            </h2>
            <p className="text-sm text-[#45464d]">
              Enter your professional details to establish your data environment.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#131b2e]">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Marcus Chen"
                autoComplete="name"
                {...formRegister('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#131b2e]">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                {...formRegister('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#131b2e]">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="pr-10"
                  {...formRegister('password')}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#131b2e] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
              <p className="text-xs text-[#76777d]">Min 8 chars, one uppercase, one number</p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={register.isPending}
            >
              {register.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            <div className="flex items-center gap-1.5 text-[11px] text-[#45464d]">
              <CheckCircle className="h-3 w-3 text-blue-600" />
              <span>Enterprise Ready</span>
            </div>
            <div className="w-px h-3 bg-[#c6c6cd]" />
            <div className="flex items-center gap-1.5 text-[11px] text-[#45464d]">
              <Cloud className="h-3 w-3 text-blue-600" />
              <span>Cloud Native</span>
            </div>
            <div className="w-px h-3 bg-[#c6c6cd]" />
            <div className="flex items-center gap-1.5 text-[11px] text-[#45464d]">
              <Lock className="h-3 w-3 text-blue-600" />
              <span>AES-256</span>
            </div>
          </div>

          <p className="text-center text-sm text-[#45464d] mt-5">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
