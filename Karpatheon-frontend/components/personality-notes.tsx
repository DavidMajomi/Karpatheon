'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { X, Maximize2, Minimize2, MoreHorizontal, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export function PersonalityNotes({ className }: { className?: string }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [noteContent, setNoteContent] = useState(
        '# My Personality Insights\n\n- I seem to be a "Deep Diver" when it comes to learning.\n- Need to focus more on breadth according to the recommendations.\n\n**Action Items:**\n1. [ ] Schedule time for random exploration\n2. [ ] Connect with 2 people from different fields'
    )
    const [isEditing, setIsEditing] = useState(true)

    return (
        <div
            className={cn(
                'flex flex-col rounded-2xl border border-border/50 bg-background shadow-sm transition-all duration-300',
                isExpanded ? 'fixed inset-4 z-50 shadow-2xl' : 'h-full min-h-[400px]',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                        <Sparkles className="h-4 w-4 text-accent" />
                    </div>
                    <span className="font-medium text-foreground">Notes</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        <span className="text-xs font-medium">{isEditing ? 'Preview' : 'Edit'}</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                    {isExpanded && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={() => setIsExpanded(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {isEditing ? (
                    <Textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="h-full w-full resize-none border-0 bg-transparent p-4 text-base leading-relaxed focus-visible:ring-0"
                        placeholder="Jot down your thoughts..."
                    />
                ) : (
                    <div className="prose prose-sm h-full max-w-none overflow-y-auto p-4 dark:prose-invert [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <ReactMarkdown>{noteContent}</ReactMarkdown>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border/50 bg-muted/20 px-4 py-2">
                <span className="text-xs text-muted-foreground">Markdown supported</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
