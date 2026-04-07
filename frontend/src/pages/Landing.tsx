import { Link } from 'react-router-dom'
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

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-[#c6c6cd]/60 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <MapPin className="h-4 w-4 text-blue-600" />
          </div>
          <span
            className="font-bold text-[#131b2e] tracking-tight"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            GeoSaaS
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-6 text-xs font-semibold tracking-widest uppercase px-3 py-1">
            Enterprise Ready 2.0
          </Badge>
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#131b2e] tracking-tight leading-none mb-6"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Data Curation
            <br />
            <span className="text-blue-600">for Architects.</span>
          </h1>
          <p className="text-lg text-[#45464d] max-w-2xl mx-auto leading-relaxed">
            Move beyond simple dashboards. GeoSaaS provides an editorial-grade environment for
            containerized data orchestration and enterprise geospatial insights.
          </p>
          <div className="flex items-center justify-center gap-4 mt-10">
            <Button size="lg" asChild>
              <Link to="/register">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative rounded-2xl border border-[#c6c6cd] bg-white overflow-hidden h-80 flex items-center justify-center shadow-sm">
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
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
            <p className="text-[#45464d] text-sm font-medium tracking-wide">
              92,401 data points across grid
            </p>
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <div
                  className="text-blue-600 font-bold text-xl"
                  style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                >
                  842.1 Gb/s
                </div>
                <div className="text-[#45464d] text-xs mt-1">Architecture Load</div>
              </div>
              <Separator orientation="vertical" className="h-10 bg-[#c6c6cd]" />
              <div className="text-center">
                <div
                  className="text-blue-600 font-bold text-xl"
                  style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                >
                  1,284
                </div>
                <div className="text-[#45464d] text-xs mt-1">Total Curations</div>
              </div>
              <Separator orientation="vertical" className="h-10 bg-[#c6c6cd]" />
              <div className="text-center">
                <div
                  className="text-blue-600 font-bold text-xl"
                  style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                >
                  89.4
                </div>
                <div className="text-[#45464d] text-xs mt-1">Signal Index</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-[#f2f3ff] border-y border-[#c6c6cd]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              Designed for Technical Perfection.
            </h2>
            <p className="text-[#45464d] mt-4 max-w-xl mx-auto">
              Every feature engineered for the way enterprise teams actually work with geospatial
              data.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-xl border border-[#c6c6cd] bg-white hover:border-blue-500/40 hover:bg-[#eaedff] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <f.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-[#131b2e] mb-2">{f.title}</h3>
                <p className="text-sm text-[#45464d] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-[#faf8ff]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#131b2e] tracking-tight"
              style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            >
              Trusted by Architects.
            </h2>
            <p className="text-[#45464d] mt-4 max-w-xl mx-auto">
              We don't just provide data; we provide the narrative for your enterprise
              infrastructure.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-8 rounded-xl border border-[#c6c6cd] bg-white shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-blue-500 text-blue-500" />
                  ))}
                </div>
                <blockquote className="text-[#45464d] leading-relaxed mb-6">{t.quote}</blockquote>
                <div>
                  <p className="font-semibold text-[#131b2e]">{t.name}</p>
                  <p className="text-sm text-[#45464d]">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#131b2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            Ready to curate your architecture?
          </h2>
          <p className="text-[#b4c5ff] mb-10">
            Join over 2,000 enterprise teams scaling with the GeoSaaS methodology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-400 text-white font-semibold"
              asChild
            >
              <Link to="/register">
                Get Started Now <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
              asChild
            >
              <Link to="/login">Request Demo</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-10 text-sm text-[#b4c5ff]">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>SOC2 compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-400" />
              <span>AES-256 encrypted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#c6c6cd] bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[#45464d]">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-[#131b2e]">GeoSaaS</span>
          </div>
          <span>© 2026 GeoSaaS. Enterprise-grade geospatial data.</span>
        </div>
      </footer>
    </div>
  )
}
