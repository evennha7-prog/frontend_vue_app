<template>
  <!-- Search input bar with search icon and quick clear button -->
  <div class="relative w-full">
    <!-- Search magnifying glass icon -->
    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8c9bb3]">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>

    <!-- Search Text Input -->
    <input
      :value="modelValue"
      type="text"
      placeholder="Search notes..."
      class="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 py-2 text-xs sm:text-sm text-[#233258] placeholder-[#8c9bb3] focus:border-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-100 shadow-sm transition-colors"
      @input="handleInput"
    />

    <!-- Quick clear button (X icon, shown when query is non-empty) -->
    <button
      v-if="modelValue"
      type="button"
      title="Clear search"
      class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8c9bb3] hover:text-[#233258]"
      @click="clearSearch"
    >
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * NoteSearch Component.
 * Debounced search input field that prevents excessive backend API requests while user is actively typing.
 */
defineProps<{
  /** Current search query string */
  modelValue: string
}>()

const emit = defineEmits<{
  /** Emitted on every keystroke to update local v-model */
  (e: 'update:modelValue', value: string): void
  /** Emitted after 300ms debounce to perform search */
  (e: 'search', value: string): void
}>()

let timeout: number | undefined

/**
 * Handles typing input with 300ms debounce before firing the search event.
 */
function handleInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)

  window.clearTimeout(timeout)
  timeout = window.setTimeout(() => {
    emit('search', value)
  }, 300)
}

/**
 * Clears search input and emits empty query immediately.
 */
function clearSearch() {
  emit('update:modelValue', '')
  emit('search', '')
}
</script>
