'use client'

import { Target, Zap, Brain, Plus, Search, Globe, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const personalityTraits = [
    {
        category: 'Learning Style',
        icon: Brain,
        traits: [
            { name: 'Deep Diver', score: 94 },
            { name: 'Systems Thinker', score: 89 },
            { name: 'Technical Focus', score: 92 },
        ],
    },
    {
        category: 'Exploration Patterns',
        icon: Target,
        traits: [
            { name: 'Vertical Explorer', score: 87 },
            { name: 'Question-Driven', score: 91 },
            { name: 'Iterative Learner', score: 85 },
        ],
    },
    {
        category: 'Knowledge Integration',
        icon: Zap,
        traits: [
            { name: 'Cross-Domain Connector', score: 88 },
            { name: 'Pattern Recognizer', score: 93 },
            { name: 'Practical Applicator', score: 90 },
        ],
    },
]

export function PersonalityTraitsSidebar() {
    return (
        <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-background shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <span className="font-medium text-foreground">Traits</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </div>

            {/* Actions */}
            <div className="space-y-3 p-4">
                <Button className="w-full justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20" variant="ghost">
                    <Plus className="h-4 w-4" />
                    Add trait source
                </Button>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search traits..."
                        className="h-9 border-border/50 bg-muted/30 pl-9 focus-visible:ring-1"
                    />
                </div>
            </div>

            {/* Sources List */}
            <div className="flex-1 overflow-y-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="mb-2 flex items-center justify-between px-2 text-xs text-muted-foreground">
                    <span>Select all traits</span>
                    <Checkbox />
                </div>

                <div className="space-y-1">
                    {personalityTraits.map((category) => {
                        const Icon = category.icon
                        return (
                            <div key={category.category} className="group flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50">
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded bg-accent/10 text-accent">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm text-foreground">{category.category}</span>
                                        <Checkbox className="h-4 w-4 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" defaultChecked />
                                    </div>
                                    <div className="space-y-1">
                                        {category.traits.map(trait => (
                                            <div key={trait.name} className="flex items-center justify-between text-xs text-muted-foreground">
                                                <span>{trait.name}</span>
                                                <span className="font-mono opacity-70">{trait.score}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
