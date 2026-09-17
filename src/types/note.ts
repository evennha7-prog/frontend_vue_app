/**
 * Note-related TypeScript interfaces and types.
 */

/**
 * Domain representation of a note item returned from the backend API.
 */
export interface Note {
  /** Unique note primary key ID */
  id: number
  /** Headline or title of the note */
  title: string
  /** Body content of the note (supports markdown and plain text) */
  content?: string | null
  /** ISO date string of when the note was created */
  createdAt: string
  /** ISO date string of when the note was last modified */
  updatedAt: string
}

/**
 * Payload sent to backend when creating a new note.
 */
export interface CreateNoteRequest {
  /** Mandatory title of the note */
  title: string
  /** Optional body content */
  content?: string | null
}

/**
 * Payload sent to backend when updating an existing note.
 */
export interface UpdateNoteRequest {
  /** Updated note title */
  title: string
  /** Updated note content */
  content?: string | null
}

/**
 * Supported sorting modes for notes list.
 */
export type NoteSortOption = 'newest' | 'oldest' | 'title_asc' | 'title_desc' | 'updated'
