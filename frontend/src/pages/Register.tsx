import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Eye, EyeOff, Database, Cloud, Lock, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
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

const trustBadges = [
  { icon: CheckCircle, label: 'Enterprise Ready' },
  { icon: Cloud, label: 'Cloud Native' },
  { icon: Lock, label: 'AES-256' },
]

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
              Begin Your Curation
            </h2>
            <p className="text-sm text-[#45464d]">
              Enter your professional details to establish your data environment.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <motion.div variants={fieldVariant} className="space-y-2">
              <Label htmlFor="name" className="text-[#131b2e]">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Marcus Chen"
                autoComplete="name"
                {...formRegister('name')}
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    className="text-xs text-red-600 overflow-hidden"
                    variants={errorVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email */}
            <motion.div variants={fieldVariant} className="space-y-2">
              <Label htmlFor="email" className="text-[#131b2e]">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                {...formRegister('email')}
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
              <p className="text-xs text-[#76777d]">Min 8 chars, one uppercase, one number</p>
            </motion.div>

            {/* Submit */}
            <motion.div
              variants={fieldVariant}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button type="submit" className="w-full" disabled={register.isPending}>
                {register.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </motion.div>
          </form>

          {/* Trust badges */}
          <motion.div
            variants={fieldVariant}
            className="flex items-center justify-center gap-3 mt-5 flex-wrap"
          >
            {trustBadges.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-1.5 text-[11px] text-[#45464d]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.3, type: 'spring' }}
              >
                <Icon className="h-3 w-3 text-blue-600" />
                <span>{label}</span>
                {i < trustBadges.length - 1 && (
                  <div className="w-px h-3 bg-[#c6c6cd] ml-3" />
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.p variants={fieldVariant} className="text-center text-sm text-[#45464d] mt-5">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-500 transition-colors font-medium"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  )
}
