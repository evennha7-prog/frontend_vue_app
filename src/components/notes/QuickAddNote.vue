<template>
  <!-- Quick Note Capture Widget: Allows instant note creation directly on the dashboard -->
  <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_4px_25px_rgba(43,58,103,0.06)] p-6 sm:p-7 transition-all duration-200">
    <!-- Header with plus icon and title -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center text-[#233258]">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-[#233258] tracking-tight">
          Add a Note
        </h2>
      </div>
      <span class="text-xs text-[#8c9bb3] hidden sm:inline-block font-medium">
        Quick capture
      </span>
    </div>

    <!-- Note Input Form -->
    <form @submit.prevent="handleSubmit" class="space-y-3.5">
      <!-- Title Textfield -->
      <div>
        <label for="quick-note-title" class="block text-xs font-bold uppercase tracking-wider text-[#233258] mb-1.5">
          Title <span class="text-rose-500">*</span>
        </label>
        <div class="relative">
          <input
            id="quick-note-title"
            ref="titleInputRef"
            v-model="title"
            type="text"
            placeholder="Title"
            class="w-full rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white text-[#233258] placeholder-[#8c9bb3] text-sm sm:text-base font-semibold px-4 py-2.5 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all shadow-xs"
            :disabled="loading"
          />
        </div>
      </div>

      <!-- Note Content Textfield -->
      <div>
        <label for="quick-note-content" class="block text-xs font-bold uppercase tracking-wider text-[#233258] mb-1.5">
          Take a note...
        </label>
        <div class="relative">
          <textarea
            id="quick-note-content"
            ref="textareaRef"
            v-model="content"
            placeholder="Take a note..."
            rows="3"
            class="w-full rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white text-[#334155] placeholder-[#8c9bb3] text-xs sm:text-sm px-4 py-3 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 leading-relaxed transition-all shadow-xs resize-y"
            :disabled="loading"
            @keydown.ctrl.enter="handleSubmit"
            @keydown.meta.enter="handleSubmit"
          ></textarea>
        </div>
      </div>

      <!-- Action Bar: Shortcut hint, Clear button, and Submit button -->
      <div class="pt-2 flex items-center justify-between">
        <span class="text-[11px] text-[#8c9bb3] hidden sm:inline-block">
          Press <kbd class="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono text-[10px] text-slate-600">Ctrl + Enter</kbd> to save
        </span>

        <div class="flex items-center gap-2.5 ml-auto">
          <!-- Clear button: resets fields if populated -->
          <button
            v-if="title.trim() || content.trim()"
            type="button"
            class="px-3 py-1.5 text-xs font-semibold text-[#6b7c9e] hover:text-[#233258] hover:bg-slate-100 rounded-xl transition-colors"
            :disabled="loading"
            @click="resetForm"
          >
            Clear
          </button>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading || !title.trim()"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-[#233258] hover:bg-[#1a2542] text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
          >
            <svg
              v-if="loading"
              class="w-4 h-4 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>{{ loading ? 'Saving...' : 'Add Note' }}</span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
/**
 * QuickAddNote Component.
 * Streamlined note creation card at top of dashboard with keyboard shortcuts (Ctrl+Enter).
 */
import { ref } from 'vue'

const props = defineProps<{
  /** Indicates whether note creation API request is pending */
  loading?: boolean
}>()

const emit = defineEmits<{
  /** Emitted with title and content when user submits */
  (e: 'submit', note: { title: string; content: string }): void
}>()

const title = ref('')
const content = ref('')
const titleInputRef = ref<HTMLInputElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

/**
 * Resets form input values.
 */
function resetForm() {
  title.value = ''
  content.value = ''
}

/**
 * Validates and submits the quick note payload.
 */
function handleSubmit() {
  if (!title.value.trim() || props.loading) return
  emit('submit', {
    title: title.value.trim(),
    content: content.value.trim(),
  })
}

// Expose resetForm method to parent component
defineExpose({
  resetForm,
})
</script>
