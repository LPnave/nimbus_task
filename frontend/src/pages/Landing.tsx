import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import {
  MapPin,
  Filter,
  Eye,
  Shield,
  ArrowRight,
  Star,
  Globe,
  Layers,
  Lock,
  CheckCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const features = [
  {
    icon: Globe,
    title: 'Map Explorer Engine',
    description:
      'Proprietary rendering engine handles massive geospatial datasets with sub-millisecond latency. Built for global infrastructure monitoring.',
  },
  {
    icon: Filter,
    title: 'Granular Data Filters',
    description:
      'Filter by category, region, or custom attributes with a clean interface that stays out of your way.',
  },
  {
    icon: Eye,
    title: 'Saved Views',
    description:
      'Synchronize dashboard layouts and filter configurations across your entire engineering team instantly.',
  },
  {
    icon: Shield,
    title: 'RBAC Control',
    description:
      'Enterprise-grade permissions for auditing and dataset access. SOC2 Type II compliant architecture.',
  },
  {
    icon: Layers,
    title: 'Clustered Markers',
    description:
      'Intelligently cluster up to 500 markers without perceptible lag. Zoom in to explore individual records.',
  },
  {
    icon: Lock,
    title: 'Secure by Design',
    description:
      'JWT authentication with refresh tokens, BCrypt password hashing, and no plaintext credentials ever stored.',
  },
]

const testimonials = [
  {
    quote:
      '"The asymmetric layout and focus on tonal depth makes GeoSaaS the only platform our engineers actually enjoy looking at for hours. It\'s editorial for enterprise data."',
    name: 'David Vance',
    title: 'CTO at Vertex Systems',
  },
  {
    quote:
      '"We reduced our mean-time-to-recovery by 40% simply because the UI highlights architectural anomalies through tonal stacking rather than noisy alarms."',
    name: 'Sarah Jenkins',
    title: 'VP Architecture at CloudScale',
  },
]

function useScrollReveal() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return { ref, isInView }
}

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    const unsub = scrollY.on('change', (y) => setScrolled(y > 20))
    return unsub
  }, [scrollY])

  const heroRef = useRef(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(heroProgress, [0, 1], [0, 60])

  const featuresReveal = useScrollReveal()
  const testimonialsReveal = useScrollReveal()
  const ctaReveal = useScrollReveal()

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e]">
      {/* Nav */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md"
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
          borderColor: scrolled ? 'rgba(198,198,205,0.8)' : 'rgba(198,198,205,0.3)',
          boxShadow: scrolled ? '0 1px 16px 0 rgba(19,27,46,0.06)' : 'none',
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
        >
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>
          <span
            className="font-bold text-[#131b2e] tracking-tight"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            GeoSaaS
          </span>
        </motion.div>
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const, delay: 0.1 }}
        >
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button size="sm" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.nav>

      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0 }}
          >
            <Badge className="mb-6 text-xs font-semibold tracking-widest uppercase px-3 py-1">
              Enterprise Ready 2.0
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#131b2e] tracking-tight leading-none mb-6"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.1 }}
          >
            Data Curation
            <br />
            <motion.span
              className="text-blue-600 inline-block"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.2 }}
            >
              for Architects.
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg text-[#45464d] max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.3 }}
          >
            Move beyond simple dashboards. GeoSaaS provides an editorial-grade environment for
            containerized data orchestration and enterprise geospatial insights.
          </motion.p>

          <motion.div
            className="flex items-center justify-center gap-4 mt-10"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" asChild>
                <Link to="/register">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero visual */}
        <motion.div
          style={{ y: heroY }}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.5 }}
          className="relative rounded-2xl border border-[#c6c6cd] bg-white overflow-hidden h-80 flex items-center justify-center shadow-sm"
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 50%, #2563eb 0%, transparent 50%), radial-gradient(circle at 70% 30%, #1d4ed8 0%, transparent 40%)',
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className="flex gap-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full bg-blue-500"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' as const }}
                />
              ))}
            </div>
            <motion.p
              className="text-[#45464d] text-sm font-medium tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              92,401 data points across grid
            </motion.p>
            <motion.div
              className="flex gap-6 text-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <div className="text-center">
                <div className="text-blue-600 font-bold text-xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  842.1 Gb/s
                </div>
                <div className="text-[#45464d] text-xs mt-1">Architecture Load</div>
              </div>
              <Separator orientation="vertical" className="h-10 bg-[#c6c6cd]" />
              <div className="text-center">
                <div className="text-blue-600 font-bold text-xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  1,284
                </div>
                <div className="text-[#45464d] text-xs mt-1">Total Curations</div>
              </div>
              <Separator orientation="vertical" className="h-10 bg-[#c6c6cd]" />
              <div className="text-center">
                <div className="text-blue-600 font-bold text-xl" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                  89.4
                </div>
                <div className="text-[#45464d] text-xs mt-1">Signal Index</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section ref={featuresReveal.ref} className="py-24 px-6 bg-[#f2f3ff] border-y border-[#c6c6cd]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              initial={{ opacity: 0, y: 32 }}
              animate={featuresReveal.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{ duration: 0.6, ease: 'easeOut' as const }}
            >
              Designed for Technical Perfection.
            </motion.h2>
            <motion.p
              className="text-[#45464d] mt-4 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 32 }}
              animate={featuresReveal.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.1 }}
            >
              Every feature engineered for the way enterprise teams actually work with geospatial data.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group p-6 rounded-xl border border-[#c6c6cd] bg-white hover:border-blue-500/40 hover:bg-[#eaedff] transition-colors duration-300 cursor-default"
                initial={{ opacity: 0, y: 32 }}
                animate={featuresReveal.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.15 + i * 0.08 }}
                whileHover={{
                  y: -4,
                  boxShadow: '0 8px 32px rgba(37,99,235,0.10)',
                  transition: { type: 'spring', stiffness: 300, damping: 24 },
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <f.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-[#131b2e] mb-2">{f.title}</h3>
                <p className="text-sm text-[#45464d] leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsReveal.ref} className="py-24 px-6 bg-[#faf8ff]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              initial={{ opacity: 0, y: 32 }}
              animate={testimonialsReveal.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{ duration: 0.6, ease: 'easeOut' as const }}
            >
              Trusted by Architects.
            </motion.h2>
            <motion.p
              className="text-[#45464d] mt-4 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 32 }}
              animate={testimonialsReveal.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
              transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.1 }}
            >
              We don't just provide data; we provide the narrative for your enterprise infrastructure.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="p-8 rounded-xl border border-[#c6c6cd] bg-white shadow-sm"
                initial={{ opacity: 0, x: i === 0 ? -40 : 40 }}
                animate={
                  testimonialsReveal.isInView
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: i === 0 ? -40 : 40 }
                }
                transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.2 + i * 0.15 }}
                whileHover={{
                  y: -3,
                  boxShadow: '0 8px 32px rgba(19,27,46,0.08)',
                  transition: { type: 'spring', stiffness: 280, damping: 22 },
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={
                        testimonialsReveal.isInView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0 }
                      }
                      transition={{ delay: 0.35 + i * 0.15 + idx * 0.05, duration: 0.3, type: 'spring' }}
                    >
                      <Star className="h-4 w-4 fill-blue-500 text-blue-500" />
                    </motion.div>
                  ))}
                </div>
                <blockquote className="text-[#45464d] leading-relaxed mb-6">{t.quote}</blockquote>
                <div>
                  <p className="font-semibold text-[#131b2e]">{t.name}</p>
                  <p className="text-sm text-[#45464d]">{t.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaReveal.ref} className="py-24 px-6 bg-[#131b2e] overflow-hidden">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            initial={{ opacity: 0, y: 32 }}
            animate={ctaReveal.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
          >
            Ready to curate your architecture?
          </motion.h2>
          <motion.p
            className="text-[#b4c5ff] mb-10"
            initial={{ opacity: 0, y: 32 }}
            animate={ctaReveal.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.1 }}
          >
            Join over 2,000 enterprise teams scaling with the GeoSaaS methodology.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 32 }}
            animate={ctaReveal.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const, delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button size="lg" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold" asChild>
                <Link to="/register">
                  Get Started Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10" asChild>
                <Link to="/login">Request Demo</Link>
              </Button>
            </motion.div>
          </motion.div>
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-[#b4c5ff]">
            {['No credit card required', 'SOC2 compliant', 'AES-256 encrypted'].map((label, i) => (
              <motion.div
                key={label}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={ctaReveal.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
              >
                <CheckCircle className="h-4 w-4 text-blue-400" />
                <span>{label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="py-8 px-6 border-t border-[#c6c6cd] bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[#45464d]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-[#131b2e]">GeoSaaS</span>
          </div>
          <span>© 2026 GeoSaaS. Enterprise-grade geospatial data.</span>
        </div>
      </motion.footer>
    </div>
  )
}
