import { WaitlistHero } from '@/components/waitlist-hero'
import { WaitlistFeatures } from '@/components/waitlist-features'
import { WaitlistCTA } from '@/components/waitlist-cta'
import { WaitlistFooter } from '@/components/waitlist-footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border/30 bg-card/30 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-3">
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-muted-foreground">Experience the future of search</span>
            <Button asChild variant="link" size="sm" className="text-primary hover:text-primary/80">
              <Link href="/search" className="flex items-center gap-1">
                Try Demo
                <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <WaitlistHero />
      <WaitlistFeatures />
      <WaitlistCTA />
      <WaitlistFooter />
    </main>
  )
}
