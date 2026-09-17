<template>
  <!-- Dropdown selector for sorting notes -->
  <div class="relative inline-block text-left">
    <div class="flex items-center gap-2">
      <span class="text-xs text-[#73829e] font-medium whitespace-nowrap">Sort:</span>
      <div class="relative">
        <select
          :value="modelValue"
          class="rounded-xl border border-slate-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-[#233258] focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100 cursor-pointer shadow-sm appearance-none transition-colors"
          @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value as NoteSortOption)"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title_asc">Title (A - Z)</option>
          <option value="title_desc">Title (Z - A)</option>
          <option value="updated">Recently Updated</option>
        </select>
        <!-- Custom chevron down icon -->
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-[#8c9bb3]">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * NoteFilter Component.
 * Select menu providing multiple sorting criteria ('newest', 'oldest', 'title_asc', 'title_desc', 'updated').
 */
import type { NoteSortOption } from '@/types/note'

defineProps<{
  /** Active sort option */
  modelValue: NoteSortOption
}>()

defineEmits<{
  /** Emitted when user selects a new sort option */
  (e: 'update:modelValue', val: NoteSortOption): void
}>()
</script>
