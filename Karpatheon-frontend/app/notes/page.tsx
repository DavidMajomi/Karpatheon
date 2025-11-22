import { NotesHeader } from '@/components/notes-header'
import { NotesList } from '@/components/notes-list'
import { NotesEditor } from '@/components/notes-editor'

export default function NotesPage() {
  return (
    <main className="flex h-screen flex-col bg-background">
      <NotesHeader />
      <div className="flex flex-1 overflow-hidden">
        <NotesList />
        <NotesEditor />
      </div>
    </main>
  )
}
