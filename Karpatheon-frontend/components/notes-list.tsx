'use client'

import { useState } from 'react'
import { Search, Tag, Clock, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Note = {
  id: string
  title: string
  preview: string
  tags: string[]
  timestamp: string
  starred: boolean
}

const notes: Note[] = [
  {
    id: '1',
    title: 'Neural Network Architectures',
    preview: 'Deep dive into transformer models and their applications in modern AI systems...',
    tags: ['AI', 'Deep Learning'],
    timestamp: '2 hours ago',
    starred: true,
  },
  {
    id: '2',
    title: 'Product Strategy Framework',
    preview: 'Key insights from scaling tech products to enterprise customers...',
    tags: ['Business', 'Strategy'],
    timestamp: 'Yesterday',
    starred: false,
  },
  {
    id: '3',
    title: 'Leadership Principles',
    preview: 'Notes from conversation with Sarah Chen about building high-performing teams...',
    tags: ['Leadership', 'Management'],
    timestamp: '3 days ago',
    starred: true,
  },
  {
    id: '4',
    title: 'Quantum Computing Basics',
    preview: 'Understanding qubits, superposition, and quantum entanglement...',
    tags: ['Quantum', 'Physics'],
    timestamp: '1 week ago',
    starred: false,
  },
]

export function NotesList() {
  const [selectedNote, setSelectedNote] = useState('1')

  return (
    <aside className="w-80 border-r border-border/50 bg-background/50 overflow-y-auto">
      {/* Search */}
      <div className="sticky top-0 border-b border-border/50 bg-background/95 p-4 backdrop-blur">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-9 border-border/50 bg-background/50 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* Filter Tags */}
      <div className="border-b border-border/50 p-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer border-primary/20 bg-primary/5 text-primary hover:bg-primary/10">
            All Notes
          </Badge>
          <Badge variant="outline" className="cursor-pointer border-border/50 hover:bg-muted/50">
            <Star className="mr-1 h-3 w-3" />
            Starred
          </Badge>
        </div>
      </div>

      {/* Notes List */}
      <div className="p-2">
        {notes.map((note) => (
          <button
            key={note.id}
            onClick={() => setSelectedNote(note.id)}
            className={cn(
              'w-full rounded-lg p-4 text-left transition-colors',
              selectedNote === note.id
                ? 'bg-primary/10 border border-primary/20'
                : 'hover:bg-muted/30 border border-transparent'
            )}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-serif font-semibold text-foreground leading-tight line-clamp-1">
                {note.title}
              </h3>
              {note.starred && <Star className="h-4 w-4 shrink-0 fill-primary text-primary" />}
            </div>
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {note.preview}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-accent/10 text-accent border-accent/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {note.timestamp}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
