'use client'

import { useState, useEffect } from 'react'
import { Star, Tag, Link2, Sparkles, MoreVertical, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { notesAPI, type NoteWithContent } from '@/lib/api'

type NotesEditorProps = {
  selectedNoteId?: string | null
}

export function NotesEditor({ selectedNoteId }: NotesEditorProps) {
  const [note, setNote] = useState<NoteWithContent | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load note when selectedNoteId changes
  useEffect(() => {
    async function loadNote() {
      if (!selectedNoteId) {
        setNote(null)
        setTitle('')
        setContent('')
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await notesAPI.get(selectedNoteId)
        setNote(data)
        setTitle(data.title)
        setContent(data.content)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load note')
      } finally {
        setLoading(false)
      }
    }
    loadNote()
  }, [selectedNoteId])

  // Auto-save handler
  async function handleSave() {
    if (!note) return

    try {
      setSaving(true)
      await notesAPI.update(note.file_id, { title, content })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between border-b border-border/50 bg-background/50 px-6 py-4">
        <div className="flex items-center gap-2">
          {note?.url && (
            <a
              href={note.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <Link2 className="h-3 w-3" />
              Source
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={!note || saving}
            size="sm"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading note...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {!loading && !error && !note && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a note to view or create a new one</p>
          </div>
        )}

        {!loading && !error && note && (
          <div className="mx-auto max-w-3xl px-6 py-8">
            {/* Title */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mb-4 border-0 bg-transparent px-0 text-3xl font-serif font-semibold focus-visible:ring-0"
              placeholder="Note title..."
            />

            {/* Content */}
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] resize-none border-0 bg-transparent px-0 text-base leading-relaxed focus-visible:ring-0"
              placeholder="Start writing..."
            />
          </div>
        )}
      </div>

      {/* Editor Footer */}
      {note && (
        <div className="border-t border-border/50 bg-background/50 px-6 py-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated {new Date(note.updated_at).toLocaleString()}</span>
            <span>{content.split(/\s+/).filter(w => w).length} words</span>
          </div>
        </div>
      )}
    </div>
  )
}
