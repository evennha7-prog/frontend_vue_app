<template>
  <div class="w-full">
    <!-- Loading Skeletons: Shown while notes are being retrieved from backend -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="i in 6"
        :key="i"
        class="h-44 rounded-2xl bg-white p-5 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(43,58,103,0.04)] animate-pulse flex flex-col justify-between"
      >
        <div class="space-y-3">
          <div class="h-5 bg-slate-200 rounded w-2/3"></div>
          <div class="h-3.5 bg-slate-100 rounded w-full"></div>
          <div class="h-3.5 bg-slate-100 rounded w-4/5"></div>
        </div>
        <div class="h-3 bg-slate-200/60 rounded w-1/3"></div>
      </div>
    </div>

    <!-- Empty State: Shown when user has no notes or no search results match -->
    <div
      v-else-if="notes.length === 0"
      class="rounded-2xl bg-white p-12 text-center border border-dashed border-slate-300 shadow-[0_4px_20px_rgba(43,58,103,0.04)] flex flex-col items-center justify-center my-6"
    >
      <div class="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center text-navy-800 mb-3 border border-navy-100">
        <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 class="text-base font-bold text-[#233258] mb-1">
        {{ isSearching ? 'No matching notes found' : 'No notes yet' }}
      </h3>
      <p class="text-xs sm:text-sm text-[#6b7c9e] max-w-sm mb-4">
        {{ isSearching ? 'Try adjusting your search terms or filters.' : 'Capture your thoughts, ideas, and tasks by adding your first note above.' }}
      </p>
      <slot name="empty-action"></slot>
    </div>

    <!-- Note Cards Grid: Renders a NoteCard for each note item -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
      <NoteCard
        v-for="note in notes"
        :key="note.id"
        :note="note"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * NoteList Component.
 * Responsive grid container that orchestrates loading skeletons,
 * empty state illustrations, and NoteCard components.
 */
import type { Note } from '@/types/note'
import NoteCard from './NoteCard.vue'

defineProps<{
  /** Array of note objects */
  notes: Note[]
  /** True if data is actively being fetched */
  loading?: boolean
  /** True if a search filter is currently applied */
  isSearching?: boolean
}>()

defineEmits<{
  /** Forwarded view event with note ID */
  (e: 'view', id: number): void
  /** Forwarded edit event with note ID */
  (e: 'edit', id: number): void
  /** Forwarded delete event with note ID */
  (e: 'delete', id: number): void
}>()
</script>
