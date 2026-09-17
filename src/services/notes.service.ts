import api from './api'
import type { CreateNoteRequest, Note, NoteSortOption, UpdateNoteRequest } from '@/types/note'

/**
 * Notes API Service.
 * Interacts with backend `/api/notes` endpoints for CRUD operations.
 */
export const notesService = {
  /**
   * Fetches all notes for the authenticated user, with optional search query and sorting.
   * 
   * @param search Optional search keyword to filter by title/content
   * @param sort Optional sort option ('newest', 'oldest', 'title_asc', 'title_desc', 'updated')
   * @returns Array of notes
   */
  async getAll(search?: string, sort?: NoteSortOption): Promise<Note[]> {
    const params: Record<string, string> = {}
    if (search && search.trim()) {
      params.search = search.trim()
    }
    if (sort) {
      params.sort = sort
    }
    const response = await api.get<Note[]>('/notes', { params })
    return response.data
  },

  /**
   * Fetches a single note by its ID.
   * 
   * @param id Note primary key ID
   * @returns Note details
   */
  async getById(id: number): Promise<Note> {
    const response = await api.get<Note>(`/notes/${id}`)
    return response.data
  },

  /**
   * Creates a new note.
   * 
   * @param data Payload containing title and optional content
   * @returns Newly created Note entity
   */
  async create(data: CreateNoteRequest): Promise<Note> {
    const response = await api.post<Note>('/notes', data)
    return response.data
  },

  /**
   * Updates an existing note.
   * 
   * @param id Note ID to update
   * @param data Payload with updated title and content
   * @returns Updated Note entity
   */
  async update(id: number, data: UpdateNoteRequest): Promise<Note> {
    const response = await api.put<Note>(`/notes/${id}`, data)
    return response.data
  },

  /**
   * Deletes a note permanently.
   * 
   * @param id Note ID to delete
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/notes/${id}`)
  },
}
