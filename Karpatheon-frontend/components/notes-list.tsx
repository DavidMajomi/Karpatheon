'use client'

import { useState, useEffect } from 'react'
import { Search, Tag, Clock, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { notesAPI, type Note } from '@/lib/api'

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

type NotesListProps = {
  onSelectNote: (noteId: string) => void
  selectedNoteId: string | null
}

export function NotesList({ onSelectNote, selectedNoteId }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNotes() {
      try {
        setLoading(true)
        const data = await notesAPI.list()
        setNotes(data)
        if (data.length > 0 && !selectedNoteId) {
          onSelectNote(data[0].file_id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load notes')
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

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
        {loading && (
          <div className="p-4 text-center text-muted-foreground">
            Loading notes...
          </div>
        )}

        {error && (
          <div className="p-4 text-center text-destructive text-sm">
            {error}
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No notes yet. Create your first note!
          </div>
        )}

        {!loading && !error && notes.map((note) => (
          <button
            key={note.file_id}
            onClick={() => onSelectNote(note.file_id)}
            className={cn(
              'w-full rounded-lg p-4 text-left transition-colors',
              selectedNoteId === note.file_id
                ? 'bg-primary/10 border border-primary/20'
                : 'hover:bg-muted/30 border border-transparent'
            )}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="font-serif font-semibold text-foreground leading-tight line-clamp-1">
                {note.title}
              </h3>
            </div>
            <p className="mb-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {note.url || 'No URL'}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <Badge
                  variant="secondary"
                  className="text-xs bg-accent/10 text-accent border-accent/20"
                >
                  {(note.size_bytes / 1024).toFixed(1)}KB
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatTimestamp(note.updated_at)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
