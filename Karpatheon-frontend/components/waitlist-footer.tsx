import { Sparkles } from 'lucide-react'

export function WaitlistFooter() {
  return (
    <footer className="border-t border-border/30 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-lg font-light tracking-wider text-primary">PANTHEON</span>
          </div>

          {/* Links */}
          <nav className="flex gap-8">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
              Contact
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
            © 2025 Pantheon. Built for the curious.
          </p>
        </div>
      </div>
    </footer>
  )
}
