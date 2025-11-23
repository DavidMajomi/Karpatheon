'use client'

import { AppHeader } from '@/components/app-header'
import { NotesList } from '@/components/notes-list'
import { NotesEditor } from '@/components/notes-editor'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function NotesPage() {
  return (
    <main className="flex h-screen flex-col bg-background">
      <AppHeader
        actions={
          <Button size="sm" className="gap-2 bg-primary text-background hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        }
      />
      <div className="flex flex-1 overflow-hidden">
        <NotesList />
        <NotesEditor />
      </div>
    </main>
  )
}
