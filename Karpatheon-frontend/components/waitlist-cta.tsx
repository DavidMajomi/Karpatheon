'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'

export function WaitlistCTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[v0] Waitlist submission:', email)
    setSubmitted(true)
  }

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-light mb-6 text-balance leading-tight">
          Ready to think <span className="text-primary italic">faster?</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
          Join the waitlist for exclusive early access. Limited spots for founding members.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="you@company.com"
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
                Join Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-lg text-foreground font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                ✓ Welcome to Pantheon. Check your inbox.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-light text-primary mb-2">2,847</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-light" style={{ fontFamily: 'Inter, sans-serif' }}>On Waitlist</div>
          </div>
          <div className="text-center border-x border-border/30">
            <div className="text-4xl font-light text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-light" style={{ fontFamily: 'Inter, sans-serif' }}>CEOs Signed Up</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-light text-primary mb-2">Q1 2025</div>
            <div className="text-sm text-muted-foreground uppercase tracking-wider font-light" style={{ fontFamily: 'Inter, sans-serif' }}>Launch Date</div>
          </div>
        </div>
      </div>
    </section>
  )
}
