import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, CheckCircle2, Droplets, Factory, FlaskConical, Mail } from 'lucide-react'
import HeroScene from '../sections/HeroScene'
import { useRevealObserver } from '../hooks/useReveal'

const NAV = [
  { label: 'Products', href: '#products' },
  { label: 'Quality', href: '#quality' },
  { label: 'Process', href: '#process' },
  { label: 'Industries', href: '#industries' },
  { label: 'About', href: '#commitment' },
]

const PRODUCTS = [
  {
    id: 'pp',
    name: 'Polypropylene',
    code: 'PP HOMO / COPO',
    desc: 'High flow grades for injection molding of housings, caps, and durable consumer parts with excellent stiffness and chemical resistance.',
    img: '/images/product-pp.jpg',
  },
  {
    id: 'pe',
    name: 'Polyethylene',
    code: 'HDPE / LDPE / LLDPE',
    desc: 'Clean processing and strong impact performance for bottles, films, crates, and pipe applications across high volume lines.',
    img: '/images/product-pe.jpg',
  },
  {
    id: 'abs',
    name: 'ABS Engineering',
    code: 'ABS / ASA',
    desc: 'Glossy surface quality and dimensional stability for electronics enclosures, appliance panels, and premium visible components.',
    img: '/images/product-abs.jpg',
  },
  {
    id: 'mb',
    name: 'Color Masterbatch',
    code: 'CUSTOM COMPOUNDS',
    desc: 'Dispersed pigment systems matched to your brand palette, delivering consistent color batch after batch on your existing equipment.',
    img: '/images/product-masterbatch.jpg',
  },
]

const PROCESS = [
  {
    step: '01',
    title: 'Raw material intake',
    text: 'Every incoming resin lot is verified against supplier certificates and our own receiving checks before it enters storage.',
  },
  {
    step: '02',
    title: 'Controlled compounding',
    text: 'Extrusion parameters are locked per recipe, monitored live, and logged so each run repeats the last one.',
  },
  {
    step: '03',
    title: 'In-line testing',
    text: 'Melt flow, density, and color are sampled at fixed intervals while the line runs, not only at the end.',
  },
  {
    step: '04',
    title: 'Certified release',
    text: 'Shipments leave with a certificate of analysis traceable to the exact production batch and machine.',
  },
]

const INDUSTRIES = [
  {
    title: 'Manufacturing',
    text: 'Structural parts, crates, and components that keep assembly lines moving without interruption.',
    img: '/images/industry-manufacturing.jpg',
  },
  {
    title: 'Electronics',
    text: 'Precision housings and connectors where dimensional stability and surface finish carry the brand.',
    img: '/images/industry-electronics.jpg',
  },
  {
    title: 'Household appliances',
    text: 'Visible panels and internal parts that must survive daily use and still look new for years.',
    img: '/images/industry-appliance.jpg',
  },
]

const STATS = [
  { value: 99.6, suffix: '%', label: 'Batch consistency rating', decimals: 1 },
  { value: 48, suffix: 'h', label: 'Average sampling turnaround', decimals: 0 },
  { value: 120, suffix: '+', label: 'Active compound recipes', decimals: 0 },
  { value: 15, suffix: 'yrs', label: 'Serving regional manufacturers', decimals: 0 },
]

function useCounter(target: number, decimals: number, start: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setVal(target)
      return
    }
    const t0 = performance.now()
    const dur = 1400
    let raf = 0
    const step = (now: number) => {
      const p = Math.min((now - t0) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(target * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [start, target])
  return val.toFixed(decimals)
}

function Marquee() {
  const items = [
    'Polypropylene',
    'Polyethylene',
    'ABS / ASA',
    'Color Masterbatch',
    'ISO aligned standards',
    'Batch traceability',
    'Injection molding',
    'Blow molding',
  ]
  const row = [...items, ...items]
  return (
    <section aria-label="Capabilities ticker" className="border-y border-border bg-white py-5 overflow-hidden">
      <div className="marquee-track flex items-center gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="label-mono text-muted-foreground flex items-center gap-10">
            {t}
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          </span>
        ))}
      </div>
    </section>
  )
}

function Stat({ value, suffix, label, decimals, start }: { value: number; suffix: string; label: string; decimals: number; start: boolean }) {
  const display = useCounter(value, decimals, start)
  return (
    <div>
      <p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
        {display}
        <span className="text-primary">{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-muted-foreground max-w-[22ch]">{label}</p>
    </div>
  )
}

export default function Home() {
  useRevealObserver()
  const [active, setActive] = useState(0)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ company: '', email: '', need: '' })
  const [error, setError] = useState('')
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsOn, setStatsOn] = useState(false)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setStatsOn(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.company.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Please enter your company name and a valid work email.')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/40 bg-white/60 backdrop-blur-md">
        <div className="container-8 flex items-center justify-between h-16">
          <a href="#top" className="flex items-center gap-2 font-bold tracking-tight text-lg">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
              <Droplets className="h-4 w-4" />
            </span>
            MPI<span className="text-primary">.</span>
          </a>
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="label-mono text-foreground/70 hover:text-foreground transition-colors underline-offset-4 hover:underline">
                {n.label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="pill-btn bg-foreground text-background hover:bg-primary">
            Request a sample
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </header>

      {/* 1. Hero */}
      <section id="top" className="relative min-h-[100dvh] flex items-center overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent md:hidden" aria-hidden="true" />
        <div className="container-8 relative z-10 w-full pt-24 pb-16 grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <p className="label-mono text-primary mb-6 reveal">Muara Profile Industries</p>
            <h1 className="reveal text-[13vw] sm:text-7xl lg:text-8xl font-bold leading-[0.98] tracking-tight">
              Plastic base
              <br />
              material, made
              <br />
              <span className="text-primary">consistently.</span>
            </h1>
          </div>
          <div className="lg:col-span-4 lg:pb-4">
            <p className="reveal text-lg text-muted-foreground leading-relaxed max-w-[38ch]">
              A complete line of polymer resins and compounds produced to industry standards, engineered so every batch matches the one your line already trusts.
            </p>
            <div className="reveal mt-8 flex flex-wrap gap-4">
              <a href="#products" className="pill-btn bg-foreground text-background hover:bg-primary">
                Explore the line
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#process" className="pill-btn border border-foreground/20 text-foreground hover:border-primary hover:text-primary">
                How we produce
              </a>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* Full-bleed media band */}
      <section aria-label="MPI polymer resin" className="relative h-[52vh] md:h-[72vh] overflow-hidden">
        <img src="/images/hero-pellets.jpg" alt="Pastel cyan and white MPI polymer resin pellets" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
      </section>

      {/* 2. Products: interactive carousel */}
      <section id="products" className="container-8 py-24 md:py-36">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div>
            <p className="label-mono text-primary mb-4 reveal">The complete line</p>
            <h2 className="reveal text-4xl md:text-6xl font-bold tracking-tight max-w-[16ch]">
              One supplier for every base material you run.
            </h2>
          </div>
          <p className="reveal text-muted-foreground max-w-[40ch] leading-relaxed">
            Select a grade to see how it performs on your equipment. Each product ships with a certificate of analysis for every batch.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 flex gap-4 overflow-x-auto pb-4 lg:overflow-visible">
            {PRODUCTS.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                aria-label={`Show ${p.name}`}
                className={`relative shrink-0 w-44 md:w-60 aspect-square rounded-3xl overflow-hidden transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active === i ? 'scale-100 opacity-100 ring-2 ring-primary' : 'scale-[0.94] opacity-50 hover:opacity-80'
                }`}
              >
                <img src={p.img} alt={p.name} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <div className="lg:col-span-5 relative min-h-[220px]">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                aria-hidden={active !== i}
                className="transition-all duration-300 ease-out"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: `translateX(${active === i ? '0' : i < active ? '-24px' : '24px'})`,
                  pointerEvents: active === i ? 'auto' : 'none',
                  position: i === 0 ? 'relative' : 'absolute',
                  inset: i === 0 ? undefined : 0,
                }}
              >
                <p className="label-mono text-primary">{p.code}</p>
                <h3 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">{p.name}</h3>
                <p className="mt-4 text-muted-foreground leading-relaxed max-w-[46ch]">{p.desc}</p>
                <a href="#contact" className="pill-btn mt-8 border border-foreground/20 hover:border-primary hover:text-primary">
                  Ask about this grade
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Quality: asymmetric split */}
      <section id="quality" className="bg-secondary/60 border-y border-border">
        <div className="container-8 py-24 md:py-36 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <p className="label-mono text-primary mb-4 reveal">Consistency is the product</p>
            <h2 className="reveal text-4xl md:text-6xl font-bold tracking-tight">
              Tested while the line runs, not after.
            </h2>
            <p className="reveal mt-6 text-muted-foreground leading-relaxed max-w-[52ch]">
              Our lab samples melt flow, density, and color at fixed intervals during every production run. A batch only ships when it matches the reference profile your team approved.
            </p>
            <ul className="reveal mt-8 space-y-4">
              {[
                'Certificate of analysis with every shipment',
                'Full traceability from lot to delivery',
                'Continuous improvement reviews each quarter',
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground/90">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2 reveal">
            <div className="rounded-[2rem] overflow-hidden">
              <img src="/images/qc-lab.jpg" alt="Quality control laboratory at MPI" className="w-full aspect-[4/5] object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Process: vertical timeline */}
      <section id="process" className="container-8 py-24 md:py-36">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="label-mono text-primary mb-4 reveal">From intake to release</p>
            <h2 className="reveal text-4xl md:text-6xl font-bold tracking-tight">
              A process built to repeat itself.
            </h2>
            <div className="reveal mt-10 rounded-[2rem] overflow-hidden hidden lg:block">
              <img src="/images/factory-line.jpg" alt="MPI compounding production line" className="w-full aspect-video object-cover" loading="lazy" />
            </div>
          </div>
          <ol className="lg:col-span-7 lg:col-start-6 relative border-l border-border pl-8 md:pl-12 space-y-14">
            {PROCESS.map((p) => (
              <li key={p.step} className="reveal relative">
                <span className="absolute -left-8 md:-left-12 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-primary ring-4 ring-background" aria-hidden="true" />
                <p className="label-mono text-primary">{p.step}</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-[56ch]">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Industries: bento grid */}
      <section id="industries" className="bg-white border-y border-border">
        <div className="container-8 py-24 md:py-36">
          <div className="mb-14 max-w-2xl">
            <p className="label-mono text-primary mb-4 reveal">Who we supply</p>
            <h2 className="reveal text-4xl md:text-6xl font-bold tracking-tight">
              Specified by the factories that cannot afford downtime.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {INDUSTRIES.map((ind, i) => (
              <article key={ind.title} className={`reveal group relative rounded-[2rem] overflow-hidden ${i === 0 ? 'md:row-span-1' : ''}`}>
                <img src={ind.img} alt={ind.title} className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
                <div className="absolute bottom-0 p-7">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{ind.title}</h3>
                  <p className="mt-2 text-sm text-white/85 leading-relaxed max-w-[36ch]">{ind.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Commitment manifesto + counters */}
      <section id="commitment" className="container-8 py-24 md:py-36">
        <p className="label-mono text-primary mb-6 reveal">Our commitment</p>
        <h2 className="reveal text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight max-w-[24ch]">
          Quality your team can stop thinking about, so they can think about everything else.
        </h2>
        <p className="reveal mt-8 text-muted-foreground leading-relaxed max-w-[62ch] text-lg">
          Muara Profile Industries exists so manufacturers, electronics brands, and appliance makers can run their lines with material they never have to question. We invest in process improvement because your trust is the product we protect.
        </p>
        <div ref={statsRef} className="reveal mt-16 grid grid-cols-2 lg:grid-cols-4 gap-10">
          {STATS.map((s) => (
            <Stat key={s.label} {...s} start={statsOn} />
          ))}
        </div>
      </section>

      {/* 7. CTA + contact */}
      <section id="contact" className="relative overflow-hidden bg-secondary/70 border-t border-border">
        <div className="container-8 py-24 md:py-32 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <p className="label-mono text-primary mb-4 reveal">Start a conversation</p>
            <h2 className="reveal text-4xl md:text-6xl font-bold tracking-tight">
              Send us a spec. We will send back a sample.
            </h2>
            <p className="reveal mt-6 text-muted-foreground leading-relaxed max-w-[48ch]">
              Tell us what you mold, extrude, or blow, and the grade you currently run. Our team responds within one working day.
            </p>
            <p className="reveal mt-8 flex items-center gap-3 text-foreground/80">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:sales@mpi.example" className="hover:text-primary transition-colors underline-offset-4 hover:underline">sales@mpi.example</a>
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            {sent ? (
              <div className="reveal is-visible rounded-[2rem] bg-white p-8 border border-border" role="status">
                <CheckCircle2 className="h-10 w-10 text-primary" />
                <h3 className="mt-4 text-2xl font-bold tracking-tight">Request received.</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Thanks, {form.company}. Our sales engineer will reply to {form.email} within one working day.
                </p>
                <button onClick={() => { setSent(false); setForm({ company: '', email: '', need: '' }) }} className="pill-btn mt-6 border border-foreground/20 hover:border-primary hover:text-primary">
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="reveal rounded-[2rem] bg-white p-8 border border-border space-y-5">
                <div>
                  <label htmlFor="company" className="label-mono text-muted-foreground">Company</label>
                  <input
                    id="company"
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="PT Example Manufacturing"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="label-mono text-muted-foreground">Work email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="procurement@company.com"
                  />
                </div>
                <div>
                  <label htmlFor="need" className="label-mono text-muted-foreground">What do you run today?</label>
                  <textarea
                    id="need"
                    rows={3}
                    value={form.need}
                    onChange={(e) => setForm({ ...form, need: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="e.g. PP copolymer, injection molding, appliance housings"
                  />
                </div>
                {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
                <button type="submit" className="pill-btn w-full justify-center bg-foreground text-background hover:bg-primary">
                  Request a sample
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-foreground text-background">
        <div className="container-8 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-10">
          <div className="col-span-2">
            <p className="flex items-center gap-2 font-bold text-lg">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <Droplets className="h-4 w-4" />
              </span>
              MPI<span className="text-primary">.</span>
            </p>
            <p className="mt-4 text-sm text-background/60 leading-relaxed max-w-[30ch]">
              Muara Profile Industries. Plastic base material, made consistently.
            </p>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <p className="label-mono text-background/50 mb-4">Products</p>
            <ul className="space-y-2 text-sm text-background/80">
              {PRODUCTS.map((p) => (
                <li key={p.id}><a className="hover:text-primary transition-colors" href="#products">{p.name}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-span-1 lg:col-span-2">
            <p className="label-mono text-background/50 mb-4">Company</p>
            <ul className="space-y-2 text-sm text-background/80">
              {NAV.filter((n) => n.label !== 'Products').map((n) => (
                <li key={n.href}><a className="hover:text-primary transition-colors" href={n.href}>{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-2">
            <p className="label-mono text-background/50 mb-4">Facility</p>
            <p className="text-sm text-background/80 leading-relaxed flex items-start gap-2">
              <Factory className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              Industrial Estate Muara, production and laboratory under one roof.
            </p>
            <p className="mt-4 text-sm text-background/80 flex items-start gap-2">
              <FlaskConical className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
              In house QC lab, batch certified.
            </p>
          </div>
        </div>
        <div className="border-t border-background/10">
          <div className="container-8 py-6 flex flex-wrap justify-between gap-4 text-xs text-background/50">
            <p>© 2026 Muara Profile Industries. All rights reserved.</p>
            <a href="#top" className="hover:text-primary transition-colors">Back to top</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
