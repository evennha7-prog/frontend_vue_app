/**
 * Named route identifiers and URL path definitions.
 * Eliminates string literal duplication and enables type-safe routing.
 */
export const ROUTE_NAMES = {
  LOGIN: 'login',
  REGISTER: 'register',
  NOTES: 'notes',
  CREATE_NOTE: 'create-note',
  NOTE_DETAIL: 'note-detail',
  EDIT_NOTE: 'edit-note',
} as const

export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  NOTES: '/notes',
  CREATE_NOTE: '/notes/new',
  NOTE_DETAIL: (id: number | string) => `/notes/${id}`,
  EDIT_NOTE: (id: number | string) => `/notes/${id}/edit`,
} as const
