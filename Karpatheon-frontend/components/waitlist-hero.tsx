'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Sparkles } from 'lucide-react'

export function WaitlistHero() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle waitlist submission
    console.log('[v0] Waitlist submission:', email)
    setSubmitted(true)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Logo/Brand */}
        <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-light tracking-wider text-primary">PANTHEON</h2>
        </div>

        {/* Main Headline */}
        <h1 className="text-6xl md:text-8xl font-light mb-6 text-balance leading-tight animate-fade-in-up tracking-tight">
          Search that learns.
          <br />
          <span className="text-primary">Knowledge that grows.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up font-light" style={{ animationDelay: '0.1s', fontFamily: 'Inter, sans-serif' }}>
          The intelligent search platform built for top performers. 
          Pantheon evolves with your curiosity, remembering what matters and surfacing insights you didn't know you needed.
        </p>

        {/* Waitlist Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 px-6 bg-card/50 backdrop-blur border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary transition-all"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <Button 
                type="submit" 
                size="lg"
                className="h-14 px-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Join Waitlist
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4 font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
              Limited early access for visionary leaders
            </p>
          </form>
        ) : (
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-lg text-foreground font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                ✓ You're on the list. We'll be in touch soon.
              </p>
            </div>
          </div>
        )}

        {/* Social Proof */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-muted-foreground mb-4 tracking-wider uppercase font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
            Trusted by leaders at
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap opacity-50">
            {['Vercel', 'OpenAI', 'Stripe', 'Notion', 'Linear'].map((company) => (
              <div key={company} className="text-foreground/60 font-light text-lg tracking-wide">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
