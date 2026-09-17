<template>
  <!-- Interactive Note Card: Displays note title snippet, content, formatted timestamp, and quick action icons -->
  <div
    class="group relative bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer border border-slate-200/80 shadow-[0_4px_20px_rgba(43,58,103,0.05)] hover:shadow-[0_8px_25px_rgba(43,58,103,0.1)] hover:border-slate-300 transition-all duration-200 min-h-[190px]"
    @click="$emit('view', note.id)"
  >
    <div>
      <!-- Header with Title & Action icons (Edit Pencil & Delete Trash) -->
      <div class="flex items-start justify-between gap-3 mb-3">
        <h3 class="text-[17px] font-bold text-[#233258] tracking-tight group-hover:text-navy-700 transition-colors line-clamp-1">
          {{ note.title }}
        </h3>
        
        <!-- Action Buttons (Stop propagation so clicking them does not trigger card view) -->
        <div class="flex items-center gap-1.5 shrink-0" @click.stop>
          <!-- Edit button -->
          <button
            type="button"
            title="Edit note"
            class="p-1 rounded-md text-[#607294] hover:text-[#233258] hover:bg-slate-100 transition-colors"
            @click.stop="$emit('edit', note.id)"
          >
            <!-- Pencil / Edit Icon -->
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
          <!-- Delete button -->
          <button
            type="button"
            title="Delete note"
            class="p-1 rounded-md text-[#607294] hover:text-rose-600 hover:bg-rose-50 transition-colors"
            @click.stop="$emit('delete', note.id)"
          >
            <!-- Trash / Delete Icon -->
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Note Content Snippet (truncated after 4 lines) -->
      <p class="text-xs sm:text-[13px] text-[#4b5563] line-clamp-4 leading-relaxed font-normal">
        {{ note.content || 'No additional content provided.' }}
      </p>
    </div>

    <!-- Card Footer with Date & optional Edited indicator -->
    <div class="pt-4 mt-2 flex items-center justify-between text-xs text-[#8c9bb3] font-normal">
      <span class="font-medium text-[#475569]">{{ formatSlashDate(note.createdAt) }}</span>
      <span v-if="note.updatedAt && note.updatedAt !== note.createdAt" class="text-[11px] text-[#9ca3af] italic">
        Edited
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * NoteCard Component.
 * Visual card representing a single note in the grid with view, edit, and delete action hooks.
 */
import type { Note } from '@/types/note'
import { formatSlashDate } from '@/utils/date'

defineProps<{
  /** The note object to display */
  note: Note
}>()

defineEmits<{
  /** Emitted when card body is clicked to navigate to detail view */
  (e: 'view', id: number): void
  /** Emitted when edit pencil button is clicked */
  (e: 'edit', id: number): void
  /** Emitted when trash delete button is clicked */
  (e: 'delete', id: number): void
}>()
</script>
