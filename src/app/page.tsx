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
  Zap
} from 'lucide-react'
import { Navbar } from '@/components/layout'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container-app text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Petition Platform
          </div>
          
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Your Workplace Voice,
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              Amplified
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Create compelling workplace petitions with AI assistance. Build solidarity, 
            track progress, and drive real change at your company.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="btn btn-primary text-lg px-8 py-4">
              <Zap className="w-5 h-5" />
              Create Your Petition
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/explore" className="btn btn-secondary text-lg px-8 py-4">
              Browse Petitions
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              <span>Verified Signatures</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>Success Tracking</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Workplace Advocacy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create effective petitions and build support for your cause.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Drafting */}
            <div className="card p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">
                AI Drafting Assistant
              </h3>
              <p className="text-gray-600">
                Our AI helps you write compelling petitions that resonate. Get suggestions 
                for titles, descriptions, and targets.
              </p>
            </div>
            
            {/* Success Prediction */}
            <div className="card p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Success Prediction
              </h3>
              <p className="text-gray-600">
                Get real-time predictions on your petition&apos;s likelihood of success, 
                with actionable tips to improve your odds.
              </p>
            </div>
            
            {/* QR Codes */}
            <div className="card p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-6">
                <QrCode className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">
                QR Code Sharing
              </h3>
              <p className="text-gray-600">
                Generate QR codes for break room flyers, handouts, and easy sharing. 
                Track offline-to-online conversions.
              </p>
            </div>
            
            {/* Verified Signatures */}
            <div className="card p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Verified Signatures
              </h3>
              <p className="text-gray-600">
                Tiered verification from basic email to verified employee status. 
                Anonymous-but-verified option protects identities.
              </p>
            </div>
            
            {/* Team Building */}
            <div className="card p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Build Solidarity
              </h3>
              <p className="text-gray-600">
                See who&apos;s got your back. Watch signatures grow in real-time and 
                celebrate milestones together.
              </p>
            </div>
            
            {/* Strategy Coaching */}
            <div className="card p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-3">
                Strategy Coaching
              </h3>
              <p className="text-gray-600">
                Get AI-powered tips on timing, escalation, and outreach. 
                Learn what makes workplace petitions succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="container-app text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
            Join thousands of employees who are standing up for better workplaces.
          </p>
          <Link href="/create" className="btn btn-success text-lg px-8 py-4">
            Start Your Petition Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container-app">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✊</span>
              <span className="font-display text-xl font-bold text-gray-900">IGotYou</span>
            </div>
            
            <div className="flex items-center gap-6 text-gray-600">
              <Link href="/about" className="hover:text-gray-900 transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link>
              <Link href="/resources" className="hover:text-gray-900 transition-colors">Resources</Link>
              <Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
            </div>
            
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} IGotYou. Solidarity forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
