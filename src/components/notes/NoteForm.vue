<template>
  <!-- Full Note Form: Supports title, markdown editor/preview, sample templates, word count, and dirty detection -->
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Quick Sample Templates Selector -->
    <div class="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
      <div class="flex items-center justify-between gap-2 mb-2">
        <span class="text-xs font-bold text-[#233258] flex items-center gap-1.5">
          <span>💡</span> Quick Sample Templates:
        </span>
        <!-- Dirty State Indicator -->
        <span v-if="isDirty" class="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
          Unsaved changes
        </span>
        <span v-else class="inline-flex items-center gap-1 text-[11px] font-medium text-[#8c9bb3]">
          ✓ Up to date
        </span>
      </div>

      <!-- Sample Template Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-for="tpl in sampleTemplates"
          :key="tpl.name"
          type="button"
          class="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-[#233258] border border-slate-200/80 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
          @click="applyTemplate(tpl)"
        >
          <span>{{ tpl.icon }}</span>
          <span>{{ tpl.name }}</span>
        </button>
      </div>
    </div>

    <!-- Title Input -->
    <div>
      <div class="flex justify-between items-center mb-1.5">
        <label for="note-title" class="block text-xs font-bold uppercase tracking-wider text-[#233258]">
          Title <span class="text-rose-500">*</span>
        </label>
        <span class="text-[11px] text-[#8c9bb3] font-mono">{{ form.title.length }} / 255</span>
      </div>

      <input
        id="note-title"
        v-model="form.title"
        type="text"
        placeholder="E.g., Weekly Sprint Goals, Meeting Summary..."
        maxlength="255"
        autofocus
        :class="[
          'block w-full rounded-xl border bg-white px-4 py-3 text-[#233258] placeholder-[#94a3b8] font-medium focus:outline-none focus:ring-2 transition duration-150 text-sm shadow-xs',
          errors.title
            ? 'border-rose-400 focus:ring-rose-100'
            : 'border-slate-200 focus:border-navy-500 focus:ring-navy-100 hover:border-slate-300'
        ]"
      />

      <!-- Title Validation Error -->
      <p v-if="errors.title" class="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
        <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ errors.title }}</span>
      </p>
    </div>

    <!-- Content Area with Edit / Preview Mode Tabs -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <label class="block text-xs font-bold uppercase tracking-wider text-[#233258]">
            Content
          </label>
          <!-- Write vs Preview Mode Toggle Buttons -->
          <div class="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
            <button
              type="button"
              :class="[
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors',
                editorMode === 'edit'
                  ? 'bg-[#233258] text-white shadow-xs'
                  : 'text-[#73829e] hover:text-[#233258]'
              ]"
              @click="editorMode = 'edit'"
            >
              ✏️ Write
            </button>
            <button
              type="button"
              :class="[
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors',
                editorMode === 'preview'
                  ? 'bg-[#233258] text-white shadow-xs'
                  : 'text-[#73829e] hover:text-[#233258]'
              ]"
              @click="editorMode = 'preview'"
            >
              👁️ Preview
            </button>
          </div>
        </div>

        <!-- Live Content Metrics (Word count and estimated reading time) -->
        <div class="flex items-center gap-3 text-xs text-[#8c9bb3]">
          <span>{{ wordCount }} words</span>
          <span>•</span>
          <span>~{{ readTimeMinutes }} min read</span>
        </div>
      </div>

      <!-- Write Mode Textarea -->
      <div v-show="editorMode === 'edit'">
        <textarea
          id="note-content"
          v-model="form.content"
          rows="11"
          placeholder="Write note ideas, tasks, markdown headings, checklists (- [ ] task), or code snippets..."
          class="block w-full rounded-xl border border-slate-200 bg-white p-4 text-[#334155] placeholder-[#94a3b8] text-sm leading-relaxed focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100 hover:border-slate-300 transition duration-150 resize-y font-sans shadow-xs"
        ></textarea>
        <div class="flex items-center justify-between text-[11px] text-[#8c9bb3] mt-1.5">
          <span>Supports **bold**, *italic*, # headings, - [ ] checklists, and `code`</span>
          <span>{{ (form.content || '').length }} characters</span>
        </div>
      </div>

      <!-- Rendered Markdown Preview Area -->
      <div
        v-show="editorMode === 'preview'"
        class="min-h-[264px] rounded-xl border border-slate-200 bg-slate-50 p-5 text-[#334155] text-sm leading-relaxed overflow-y-auto shadow-xs"
      >
        <div v-html="renderedPreview"></div>
      </div>
    </div>

    <!-- Server Error banner if any -->
    <div v-if="serverError" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2 font-medium">
      <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{{ serverError }}</span>
    </div>

    <!-- Actions Bar: Reset changes button, Cancel, and Submit -->
    <div class="flex items-center justify-between pt-4 border-t border-slate-100">
      <button
        v-if="isDirty"
        type="button"
        class="text-xs text-[#73829e] hover:text-[#233258] underline transition-colors"
        @click="resetForm"
      >
        Reset changes
      </button>
      <div v-else></div>

      <div class="flex items-center gap-3">
        <BaseButton
          type="button"
          variant="secondary"
          :disabled="loading"
          @click="$emit('cancel')"
        >
          Cancel
        </BaseButton>

        <BaseButton
          type="submit"
          variant="primary"
          :loading="loading"
          :disabled="loading"
        >
          {{ submitText }}
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
/**
 * NoteForm Component.
 * Reusable full-featured editor form for both creating and editing notes.
 * Includes markdown live preview, word counter, template presets, and validation.
 */
import { reactive, ref, computed, watch } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { renderMarkdown } from '@/utils/markdown'
import type { CreateNoteRequest } from '@/types/note'

interface TemplateItem {
  icon: string
  name: string
  title: string
  content: string
}

const props = withDefaults(
  defineProps<{
    /** Initial note data when editing an existing note */
    initialData?: CreateNoteRequest
    /** Label on the primary action button */
    submitText?: string
    /** Submitting state */
    loading?: boolean
    /** Backend error message if submission failed */
    serverError?: string | null
  }>(),
  {
    submitText: 'Save Note',
    loading: false,
    serverError: null,
  }
)

const emit = defineEmits<{
  /** Emitted on valid form submission */
  (e: 'submit', payload: CreateNoteRequest): void
  /** Emitted when cancel button is clicked */
  (e: 'cancel'): void
  /** Emitted when unsaved changes state changes */
  (e: 'dirty-change', isDirty: boolean): void
}>()

// Active editor tab: 'edit' or 'preview'
const editorMode = ref<'edit' | 'preview'>('edit')

// Reactive form model
const form = reactive<CreateNoteRequest>({
  title: props.initialData?.title || '',
  content: props.initialData?.content || '',
})

// Validation error states
const errors = reactive({
  title: '',
})

// Sample templates library
const sampleTemplates: TemplateItem[] = [
  {
    icon: '🚀',
    name: 'Sprint Goals',
    title: 'Sprint 4 Planning & Objectives',
    content: `# Sprint Objectives
- [x] Integrate Vue 3 Pinia state stores
- [ ] Implement responsive card UI
- [ ] Connect ASP.NET Core JWT backend
- [ ] Write integration test suite

> Target deadline: Friday 5:00 PM`
  },
  {
    icon: '💡',
    name: 'Architecture RFC',
    title: 'RFC: SPA State Management & Caching',
    content: `### Architecture Plan
We are designing an offline-capable client state architecture for Notes Tok.

## Key Considerations
- In-memory Pinia store with localStorage hydration
- Automated JWT token refresh via Axios interceptors
- Optimistic UI updates for ultra-low latency`
  },
  {
    icon: '☕',
    name: 'Meeting Notes',
    title: 'Weekly Sync: Frontend Engineering',
    content: `# Weekly Engineering Sync
**Attendees:** Alex, Jordan, Panha

### Agenda
1. Vue 3 Composition API migration review
2. Tailwind CSS design tokens consistency
3. Performance benchmark review (Vite bundle < 300kB)`
  },
  {
    icon: '🐛',
    name: 'Bug Report',
    title: 'Bug: Modal dialog scroll locking on mobile',
    content: `# Bug Details
**Severity:** Medium
**Reproducibility:** Consistent on iOS Safari

### Expected Behavior
Background content should not scroll when the modal is open.

### Actual Behavior
Body element continues scrolling behind the backdrop blur overlay.`
  }
]

// Check if form has modified fields compared to initialData
const isDirty = computed(() => {
  const initTitle = props.initialData?.title || ''
  const initContent = props.initialData?.content || ''
  return form.title.trim() !== initTitle.trim() || (form.content || '').trim() !== initContent.trim()
})

// Watch dirty state and notify parent
watch(isDirty, (newVal) => {
  emit('dirty-change', newVal)
})

// Sync form if initialData prop updates
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.title = newData.title || ''
      form.content = newData.content || ''
    }
  },
  { deep: true }
)

// Calculate content word count
const wordCount = computed(() => {
  if (!form.content || !form.content.trim()) return 0
  return form.content.trim().split(/\s+/).filter(Boolean).length
})

// Calculate estimated reading time
const readTimeMinutes = computed(() => {
  const words = wordCount.value
  return Math.max(1, Math.ceil(words / 200))
})

// Generate rendered markdown preview HTML
const renderedPreview = computed(() => {
  return renderMarkdown(form.content)
})

// Apply selected template into form
function applyTemplate(tpl: TemplateItem) {
  form.title = tpl.title
  form.content = tpl.content
  errors.title = ''
}

// Reset form back to initial prop values
function resetForm() {
  form.title = props.initialData?.title || ''
  form.content = props.initialData?.content || ''
  errors.title = ''
}

// Form client-side validation
function validate(): boolean {
  errors.title = ''
  if (!form.title || !form.title.trim()) {
    errors.title = 'Title is mandatory and cannot be empty.'
    return false
  }
  if (form.title.trim().length > 255) {
    errors.title = 'Title must be 255 characters or less.'
    return false
  }
  return true
}

// Handle form submission
function handleSubmit() {
  if (!validate()) return
  emit('submit', {
    title: form.title.trim(),
    content: form.content ? form.content.trim() : null,
  })
}

// Expose state and reset method
defineExpose({
  isDirty,
  form,
  resetForm
})
</script>
