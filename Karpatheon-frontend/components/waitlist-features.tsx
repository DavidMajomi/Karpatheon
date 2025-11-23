import { Brain, TrendingUp, Shield, Zap } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'Learns Your Interests',
    description: 'Karpatheon builds a knowledge graph of your curiosity, connecting ideas and surfacing patterns you\'d never find manually.'
  },
  {
    icon: TrendingUp,
    title: 'Evolves With You',
    description: 'As your interests grow and shift, Karpatheon adapts. Your search engine becomes more intelligent over time, not stale.'
  },
  {
    icon: Shield,
    title: 'Private by Design',
    description: 'Your knowledge graph belongs to you. End-to-end encryption ensures your intellectual property stays yours.'
  },
  {
    icon: Zap,
    title: 'Instant Insights',
    description: 'Get answers in milliseconds, not minutes. Karpatheon pre-computes connections so you never wait for brilliance.'
  }
]

export function WaitlistFeatures() {
  return (
    <section className="py-32 px-4 relative">
      {/* Subtle divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-light mb-6 text-balance">
            Built for the <span className="text-primary">relentlessly curious</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
            Stop searching the same things twice. Karpatheon remembers, connects, and reveals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-8 bg-card/30 backdrop-blur border border-border/50 rounded-lg hover:border-primary/30 transition-all hover:bg-card/50 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
