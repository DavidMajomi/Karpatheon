'use client'

import { Sparkles, Bell, Lock, Palette, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { icon: Sparkles, label: 'Recommendations', active: true },
  { icon: Bell, label: 'Notifications', active: false },
  { icon: Lock, label: 'Privacy', active: false },
  { icon: Palette, label: 'Appearance', active: false },
  { icon: Globe, label: 'Language', active: false },
]

export function SettingsNav() {
  return (
    <aside className="w-64 border-r border-border/50 bg-background/50 p-6">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start gap-3 ${
                item.active
                  ? 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </div>
    </aside>
  )
}
