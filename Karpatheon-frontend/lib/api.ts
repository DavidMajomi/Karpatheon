const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export type Note = {
  file_id: string
  title: string
  url?: string
  storage_path: string
  version_id?: string
  created_at: string
  updated_at: string
  size_bytes: number
}

export type NoteWithContent = Note & {
  content: string
}

export type CreateNoteRequest = {
  file_id: string
  title: string
  content: string
  url?: string
}

export type UpdateNoteRequest = {
  title?: string
  content?: string
}

export const notesAPI = {
  /**
   * List all notes (metadata only, no content)
   */
  async list(limit: number = 100): Promise<Note[]> {
    const response = await fetch(`${API_URL}/api/notes?limit=${limit}`)
    if (!response.ok) throw new Error('Failed to fetch notes')
    return response.json()
  },

  /**
   * Get a single note with full content
   */
  async get(fileId: string): Promise<NoteWithContent> {
    const response = await fetch(`${API_URL}/api/notes/${fileId}`)
    if (!response.ok) {
      if (response.status === 404) throw new Error('Note not found')
      throw new Error('Failed to fetch note')
    }
    return response.json()
  },

  /**
   * Create a new note
   */
  async create(data: CreateNoteRequest): Promise<Note> {
    const response = await fetch(`${API_URL}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      if (response.status === 409) throw new Error('Note already exists')
      throw new Error('Failed to create note')
    }
    return response.json()
  },

  /**
   * Update an existing note
   */
  async update(fileId: string, data: UpdateNoteRequest): Promise<Note> {
    const response = await fetch(`${API_URL}/api/notes/${fileId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      if (response.status === 404) throw new Error('Note not found')
      throw new Error('Failed to update note')
    }
    return response.json()
  },

  /**
   * Delete a note
   */
  async delete(fileId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/notes/${fileId}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      if (response.status === 404) throw new Error('Note not found')
      throw new Error('Failed to delete note')
    }
  }
}
