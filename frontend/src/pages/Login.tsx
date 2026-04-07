import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Eye, EyeOff, Database } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/useAuth'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

const panelVariants = {
  hidden: (dir: number) => ({ opacity: 0, x: dir * 48 }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
}

const fieldVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

const errorVariant = {
  hidden: { opacity: 0, y: -4, height: 0 },
  visible: { opacity: 1, y: 0, height: 'auto', transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, height: 0, transition: { duration: 0.15 } },
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = (data: FormData) => {
    login.mutate({ email: data.email, password: data.password })
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] flex overflow-hidden">
      {/* Left panel — branding */}
      <motion.div
        className="hidden lg:flex flex-col justify-center w-1/2 p-16 bg-[#f2f3ff] border-r border-[#c6c6cd] relative overflow-hidden"
        custom={-1}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
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
          <motion.div
            className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8"
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring', stiffness: 260, damping: 18 }}
          >
            <Database className="h-8 w-8 text-blue-600" />
          </motion.div>
          <motion.h1
            className="text-4xl font-bold text-[#131b2e] tracking-tight mb-3"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' as const }}
          >
            GeoSaaS
          </motion.h1>
          <motion.p
            className="text-[#45464d] text-sm leading-relaxed max-w-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' as const }}
          >
            Enterprise-grade data architecture.
          </motion.p>
        </div>
      </motion.div>

      {/* Right panel — form */}
      <motion.div
        className="flex-1 flex items-center justify-center p-6 bg-white"
        custom={1}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="w-full max-w-sm"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Mobile logo */}
          <motion.div variants={fieldVariant} className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Database className="h-4 w-4 text-blue-600" />
            </div>
            <span
              className="font-bold text-[#131b2e]"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              GeoSaaS
            </span>
          </motion.div>

          <motion.div variants={fieldVariant} className="mb-8">
            <h2
              className="text-2xl font-bold text-[#131b2e] mb-2"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              Welcome back
            </h2>
            <p className="text-sm text-[#45464d]">
              Enter your credentials to access your dashboard
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <motion.div variants={fieldVariant} className="space-y-2">
              <Label htmlFor="email" className="text-[#131b2e]">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                {...register('email')}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    className="text-xs text-red-600 overflow-hidden"
                    variants={errorVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password */}
            <motion.div variants={fieldVariant} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#131b2e]">Password</Label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  {...register('password')}
                />
                <motion.button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#131b2e] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  whileTap={{ scale: 0.85 }}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={showPassword ? 'off' : 'on'}
                      initial={{ opacity: 0, rotate: -15, scale: 0.7 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 15, scale: 0.7 }}
                      transition={{ duration: 0.18 }}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    className="text-xs text-red-600 overflow-hidden"
                    variants={errorVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remember me */}
            <motion.div variants={fieldVariant} className="flex items-center gap-2">
              <input
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 rounded border-[#c6c6cd] bg-white accent-blue-600 cursor-pointer"
                {...register('rememberMe')}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-[#45464d] font-normal cursor-pointer"
              >
                Keep me signed in for 30 days
              </Label>
            </motion.div>

            {/* Submit */}
            <motion.div variants={fieldVariant} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}>
              <Button type="submit" className="w-full" disabled={login.isPending}>
                {login.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div variants={fieldVariant} className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#c6c6cd]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-[#45464d]">Or continue with</span>
            </div>
          </motion.div>

          {/* Google SSO */}
          <motion.div variants={fieldVariant} whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" className="w-full" disabled>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google SSO
            </Button>
          </motion.div>

          <motion.p variants={fieldVariant} className="text-center text-sm text-[#45464d] mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
            >
              Request early access
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}
