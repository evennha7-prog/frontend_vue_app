import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notesService } from '@/services/notes.service'
import type { CreateNoteRequest, Note, NoteSortOption, UpdateNoteRequest } from '@/types/note'

/**
 * Pinia Store for Notes Management.
 * Holds active notes array, search filters, sort criteria,
 * and coordinates all note CRUD operations with backend API.
 */
export const useNotesStore = defineStore('notes', () => {
  // -------------------------------------------------------------
  // State
  // -------------------------------------------------------------
  /** List of user's notes currently loaded from backend */
  const notes = ref<Note[]>([])

  /** Currently viewed / edited note details */
  const currentNote = ref<Note | null>(null)

  /** Loading state for list fetch / page load */
  const loading = ref<boolean>(false)

  /** Loading state for create/update/delete operations */
  const actionLoading = ref<boolean>(false)

  /** Error message if an operation fails */
  const error = ref<string | null>(null)

  /** Current search query filter */
  const searchQuery = ref<string>('')

  /** Current active sorting mode */
  const sortBy = ref<NoteSortOption>('newest')

  // -------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------

  /**
   * Fetches all notes matching the current search keyword and sort order.
   */
  async function fetchNotes() {
    loading.value = true
    error.value = null
    try {
      const data = await notesService.getAll(searchQuery.value, sortBy.value)
      notes.value = data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to load notes.'
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetches a specific note by ID.
   * 
   * @param id Note primary key ID
   * @returns The Note object or null
   */
  async function fetchNoteById(id: number): Promise<Note | null> {
    loading.value = true
    error.value = null
    try {
      const data = await notesService.getById(id)
      currentNote.value = data
      return data
    } catch (err: any) {
      error.value = err.response?.data?.message || `Failed to fetch note ${id}.`
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Creates a new note, prepending it to local state for immediate UI update.
   * 
   * @param payload Title and content
   * @returns Newly created Note
   */
  async function createNote(payload: CreateNoteRequest): Promise<Note> {
    actionLoading.value = true
    error.value = null
    try {
      const newNote = await notesService.create(payload)
      notes.value.unshift(newNote) // Prepend so it appears first in the list
      return newNote
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create note.'
      error.value = msg
      throw new Error(msg)
    } finally {
      actionLoading.value = false
    }
  }

  /**
   * Updates an existing note and refreshes both the list and currentNote if matched.
   * 
   * @param id Note ID
   * @param payload Updated title and content
   * @returns Updated Note
   */
  async function updateNote(id: number, payload: UpdateNoteRequest): Promise<Note> {
    actionLoading.value = true
    error.value = null
    try {
      const updatedNote = await notesService.update(id, payload)
      const index = notes.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notes.value[index] = updatedNote
      }
      if (currentNote.value && currentNote.value.id === id) {
        currentNote.value = updatedNote
      }
      return updatedNote
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to update note.'
      error.value = msg
      throw new Error(msg)
    } finally {
      actionLoading.value = false
    }
  }

  /**
   * Deletes a note and removes it from the local reactive notes array.
   * 
   * @param id Note ID to remove
   */
  async function deleteNote(id: number): Promise<void> {
    actionLoading.value = true
    error.value = null
    try {
      await notesService.delete(id)
      notes.value = notes.value.filter(n => n.id !== id)
      if (currentNote.value?.id === id) {
        currentNote.value = null
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to delete note.'
      error.value = msg
      throw new Error(msg)
    } finally {
      actionLoading.value = false
    }
  }

  /**
   * Updates the search keyword and immediately re-queries backend.
   * 
   * @param query Search string
   */
  function setSearch(query: string) {
    searchQuery.value = query
    fetchNotes()
  }

  /**
   * Updates the sorting mode and immediately re-queries backend.
   * 
   * @param sort Sort option
   */
  function setSort(sort: NoteSortOption) {
    sortBy.value = sort
    fetchNotes()
  }

  return {
    // State
    notes,
    currentNote,
    loading,
    actionLoading,
    error,
    searchQuery,
    sortBy,
    // Actions
    fetchNotes,
    fetchNoteById,
    createNote,
    updateNote,
    deleteNote,
    setSearch,
    setSort,
  }
})
