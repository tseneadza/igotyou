'use client'

import Link from 'next/link'
import {
  Sparkles,
  Users,
  QrCode,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  Megaphone
} from 'lucide-react'
import { Navbar } from '@/components/layout'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section - Bold & Asymmetric */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-white">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-secondary/20 border-brutal"
             style={{ transform: 'rotate(15deg)' }} />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-tertiary/20 border-brutal"
             style={{ transform: 'rotate(-12deg)' }} />

        <div className="container-app relative z-10">
          <div className="max-w-5xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-6 py-3 mb-8 bg-accent text-white border-brutal animate-slide-up">
              <Sparkles className="w-5 h-5" />
              <span className="font-display text-sm font-bold uppercase tracking-wide">
                AI-Powered Platform
              </span>
            </div>

            {/* Oversized Headline */}
            <h1 className="font-display font-bold text-primary mb-8 leading-[0.9] animate-slide-up delay-100">
              YOUR
              <span className="block text-accent">WORKPLACE</span>
              <span className="block">VOICE.</span>
            </h1>

            {/* Subheadline */}
            <div className="relative inline-block mb-12 animate-slide-up delay-200">
              <p className="text-2xl md:text-3xl font-display font-bold text-primary max-w-2xl leading-tight">
                Create compelling petitions. Build unstoppable solidarity.
                <span className="text-accent"> Drive real change.</span>
              </p>
              <div className="absolute -bottom-2 left-0 w-32 h-2 bg-secondary" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-16 animate-slide-up delay-300">
              <Link href="/create" className="btn btn-primary group">
                <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Start Petition
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/explore" className="btn btn-secondary">
                Browse Petitions
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-8 pt-8 border-t-[3px] border-primary animate-slide-up delay-400">
              <div>
                <div className="text-4xl font-display font-bold text-accent mb-1">10K+</div>
                <div className="text-sm font-bold uppercase tracking-wide text-text-muted">Signatures</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-accent mb-1">500+</div>
                <div className="text-sm font-bold uppercase tracking-wide text-text-muted">Active Campaigns</div>
              </div>
              <div>
                <div className="text-4xl font-display font-bold text-accent mb-1">87%</div>
                <div className="text-sm font-bold uppercase tracking-wide text-text-muted">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Grid with Brutal Cards */}
      <section className="py-24 bg-bg-dark relative">
        {/* Decorative accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-accent" />

        <div className="container-app">
          <div className="mb-16">
            <h2 className="font-display font-bold text-primary mb-6">
              BUILT FOR
              <span className="block text-accent">SOLIDARITY</span>
            </h2>
            <p className="text-xl text-text-muted max-w-2xl font-medium">
              Everything you need to organize, mobilize, and win.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Drafting */}
            <div className="card p-8 bg-white hover:scale-[1.02] transition-all group">
              <div className="w-16 h-16 bg-accent text-white flex items-center justify-center mb-6 border-brutal">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mb-4">
                AI DRAFTING
              </h3>
              <p className="text-text-muted leading-relaxed">
                Write compelling petitions with AI assistance. Get smart suggestions
                for titles, demands, and strategy.
              </p>
              <div className="mt-6 w-12 h-1 bg-accent group-hover:w-20 transition-all" />
            </div>

            {/* Success Prediction */}
            <div className="card p-8 bg-white hover:scale-[1.02] transition-all group">
              <div className="w-16 h-16 bg-secondary text-primary flex items-center justify-center mb-6 border-brutal">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mb-4">
                WIN TRACKER
              </h3>
              <p className="text-text-muted leading-relaxed">
                Real-time predictions on success likelihood. Get actionable tips
                to boost your campaign's impact.
              </p>
              <div className="mt-6 w-12 h-1 bg-secondary group-hover:w-20 transition-all" />
            </div>

            {/* QR Codes */}
            <div className="card p-8 bg-white hover:scale-[1.02] transition-all group">
              <div className="w-16 h-16 bg-tertiary text-white flex items-center justify-center mb-6 border-brutal">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mb-4">
                QR SHARING
              </h3>
              <p className="text-text-muted leading-relaxed">
                Generate codes for posters and flyers. Track offline-to-online
                conversions in real-time.
              </p>
              <div className="mt-6 w-12 h-1 bg-tertiary group-hover:w-20 transition-all" />
            </div>

            {/* Verified Signatures */}
            <div className="card p-8 bg-white hover:scale-[1.02] transition-all group">
              <div className="w-16 h-16 bg-primary text-white flex items-center justify-center mb-6 border-brutal">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mb-4">
                VERIFIED SAFE
              </h3>
              <p className="text-text-muted leading-relaxed">
                Tiered verification protects authenticity. Anonymous-but-verified
                option shields identities.
              </p>
              <div className="mt-6 w-12 h-1 bg-primary group-hover:w-20 transition-all" />
            </div>

            {/* Team Building */}
            <div className="card p-8 bg-white hover:scale-[1.02] transition-all group">
              <div className="w-16 h-16 bg-accent text-white flex items-center justify-center mb-6 border-brutal">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mb-4">
                POWER IN NUMBERS
              </h3>
              <p className="text-text-muted leading-relaxed">
                Watch solidarity grow in real-time. Celebrate milestones
                and build momentum together.
              </p>
              <div className="mt-6 w-12 h-1 bg-accent group-hover:w-20 transition-all" />
            </div>

            {/* Strategy Coaching */}
            <div className="card p-8 bg-white hover:scale-[1.02] transition-all group">
              <div className="w-16 h-16 bg-secondary text-primary flex items-center justify-center mb-6 border-brutal">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-primary mb-4">
                STRATEGY COACH
              </h3>
              <p className="text-text-muted leading-relaxed">
                AI-powered tips on timing, escalation, and outreach.
                Learn what makes campaigns win.
              </p>
              <div className="mt-6 w-12 h-1 bg-secondary group-hover:w-20 transition-all" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-white">
        <div className="container-app">
          <div className="flex flex-wrap items-center justify-center gap-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary flex items-center justify-center border-brutal">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-display font-bold text-primary uppercase text-sm">
                  Privacy Protected
                </div>
                <div className="text-text-muted text-sm">End-to-end encryption</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-tertiary flex items-center justify-center border-brutal">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-primary uppercase text-sm">
                  Verified Authentic
                </div>
                <div className="text-text-muted text-sm">Real signatures only</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent flex items-center justify-center border-brutal">
                <Megaphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-primary uppercase text-sm">
                  Maximum Impact
                </div>
                <div className="text-text-muted text-sm">AI-optimized campaigns</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold & Direct */}
      <section className="py-32 bg-primary relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-10 right-20 w-40 h-40 bg-accent/30"
             style={{ transform: 'rotate(25deg)' }} />
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-secondary/30"
             style={{ transform: 'rotate(-20deg)' }} />

        <div className="container-app text-center relative z-10">
          <h2 className="font-display font-bold text-white mb-8 leading-[0.9]">
            READY TO
            <span className="block text-accent">MAKE NOISE?</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-12 font-medium">
            Join thousands standing up for better workplaces. Your voice matters.
          </p>
          <Link href="/create" className="btn bg-accent text-white border-white hover:bg-accent-bright inline-flex">
            <Zap className="w-5 h-5" />
            Start Your Campaign
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-bg-darker border-t-[5px] border-primary">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">✊</div>
                <span className="font-display text-3xl font-bold text-primary">IGotYou</span>
              </div>
              <p className="text-text-muted max-w-xs font-medium">
                Amplifying workplace voices through technology and solidarity.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-display font-bold text-primary uppercase text-sm mb-4">Product</h4>
                <div className="space-y-2">
                  <Link href="/explore" className="block text-text-muted hover:text-accent transition-colors">
                    Explore
                  </Link>
                  <Link href="/create" className="block text-text-muted hover:text-accent transition-colors">
                    Create
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-display font-bold text-primary uppercase text-sm mb-4">Company</h4>
                <div className="space-y-2">
                  <Link href="/about" className="block text-text-muted hover:text-accent transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="block text-text-muted hover:text-accent transition-colors">
                    Contact
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-display font-bold text-primary uppercase text-sm mb-4">Legal</h4>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-text-muted hover:text-accent transition-colors">
                    Privacy
                  </Link>
                  <Link href="/terms" className="block text-text-muted hover:text-accent transition-colors">
                    Terms
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-display font-bold text-primary uppercase text-sm mb-4">Resources</h4>
                <div className="space-y-2">
                  <Link href="/resources" className="block text-text-muted hover:text-accent transition-colors">
                    Guides
                  </Link>
                  <Link href="/support" className="block text-text-muted hover:text-accent transition-colors">
                    Support
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t-[3px] border-primary/20">
            <p className="text-text-muted text-sm font-bold uppercase tracking-wide">
              &copy; {new Date().getFullYear()} IGotYou. Solidarity Forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
