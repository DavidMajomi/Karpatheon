'use client'

import { useState } from 'react'
import { Star, Tag, Link2, Sparkles, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export function NotesEditor() {
  const [title, setTitle] = useState('Neural Network Architectures')
  const [content, setContent] = useState(
    'Deep dive into transformer models and their applications in modern AI systems.\n\nKey concepts:\n- Self-attention mechanisms\n- Positional encoding\n- Multi-head attention\n- Feed-forward networks\n\nThe transformer architecture has revolutionized natural language processing and is now being applied to computer vision, reinforcement learning, and more.'
  )

  return (
    <div className="flex flex-1 flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-background/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Star className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Tag className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Link2 className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary hover:bg-primary/5">
            <Sparkles className="h-4 w-4" />
            Enhance with AI
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-8">
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4 border-0 bg-transparent px-0 text-3xl font-serif font-semibold focus-visible:ring-0"
            placeholder="Note title..."
          />

          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              AI
            </Badge>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Deep Learning
            </Badge>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground">
              + Add tag
            </Button>
          </div>

          {/* Content */}
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] resize-none border-0 bg-transparent px-0 text-base leading-relaxed focus-visible:ring-0"
            placeholder="Start writing..."
          />

          {/* AI Suggestions */}
          <Card className="mt-6 border-primary/20 bg-primary/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-sm text-foreground">AI Suggestions</h4>
            </div>
            <div className="space-y-2">
              <button className="w-full rounded-lg border border-border/50 bg-background/50 p-3 text-left text-sm text-foreground hover:bg-background/80 transition-colors">
                Link to your "Attention Mechanisms" note
              </button>
              <button className="w-full rounded-lg border border-border/50 bg-background/50 p-3 text-left text-sm text-foreground hover:bg-background/80 transition-colors">
                Add related research papers from your graph
              </button>
              <button className="w-full rounded-lg border border-border/50 bg-background/50 p-3 text-left text-sm text-foreground hover:bg-background/80 transition-colors">
                Generate summary for knowledge graph
              </button>
            </div>
          </Card>

          {/* Connected Knowledge */}
          <div className="mt-6">
            <h4 className="mb-3 font-serif text-sm font-semibold text-foreground">Connected Knowledge</h4>
            <div className="space-y-2">
              {[
                { title: 'Attention Mechanisms', connections: 12 },
                { title: 'Model Architecture Patterns', connections: 8 },
                { title: 'Training Optimization', connections: 5 },
              ].map((item) => (
                <button
                  key={item.title}
                  className="flex w-full items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3 text-left hover:bg-background/80 transition-colors"
                >
                  <span className="text-sm text-foreground">{item.title}</span>
                  <Badge variant="secondary" className="bg-muted/50 text-xs text-muted-foreground">
                    {item.connections} links
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Footer */}
      <div className="border-t border-border/50 bg-background/50 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Last edited 2 hours ago</span>
          <span>{content.split(' ').length} words</span>
        </div>
      </div>
    </div>
  )
}
