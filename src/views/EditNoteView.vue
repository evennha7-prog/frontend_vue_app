<template>
  <!-- Edit Note Page View -->
  <DefaultLayout>
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Breadcrumb navigation -->
      <nav class="flex items-center gap-2 text-xs text-slate-400">
        <router-link to="/notes" class="hover:text-slate-200 transition-colors flex items-center gap-1">
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Notes
        </router-link>
        <span>/</span>
        <router-link v-if="noteId" :to="`/notes/${noteId}`" class="hover:text-slate-200 truncate max-w-[160px]">
          {{ noteTitle || 'Note #' + noteId }}
        </router-link>
        <span>/</span>
        <span class="text-slate-200 font-medium">Edit Note</span>
      </nav>

      <!-- Success Notification Banner -->
      <div
        v-if="updateSuccess"
        class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fade-in"
      >
        <svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Changes saved successfully! Redirecting...</span>
      </div>

      <!-- Loading skeleton state -->
      <div v-if="loading" class="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-sm">
        <LoadingSpinner size="lg" class="text-[#233258] mb-3" />
        <p class="text-xs sm:text-sm text-[#73829e]">Loading note details...</p>
      </div>

      <!-- Error / Not found state -->
      <div v-else-if="!noteData" class="rounded-3xl bg-white p-8 text-center border border-slate-200/80 shadow-sm">
        <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 class="text-base font-bold text-[#233258] mb-1">Could not find note to edit</h3>
        <p class="text-xs text-[#73829e] mb-4">The note might have been deleted or the ID is invalid.</p>
        <router-link to="/notes">
          <BaseButton variant="secondary">Return to Notes</BaseButton>
        </router-link>
      </div>

      <!-- Note Editing Card -->
      <div v-else class="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(43,58,103,0.06)]">
        <div class="mb-6 pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-bold text-[#233258] tracking-tight">
                Edit Note
              </h1>
              <span class="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-[#73829e] border border-slate-200">
                #{{ noteId }}
              </span>
            </div>
            <p class="text-xs text-[#73829e] mt-1 font-medium">
              Update note content or switch to preview mode to verify markdown formatting.
            </p>
          </div>

          <div v-if="lastModifiedDate" class="text-[11px] text-slate-500">
            Last saved: {{ lastModifiedDate }}
          </div>
        </div>

        <NoteForm
          :initial-data="noteData"
          submit-text="Save Changes"
          :loading="isSaving"
          :server-error="errorMessage"
          @dirty-change="isFormDirty = $event"
          @submit="handleUpdate"
          @cancel="handleCancel"
        />
      </div>

      <!-- Discard Unsaved Changes Confirmation Modal -->
      <BaseModal
        :is-open="isDiscardModalOpen"
        title="Discard Unsaved Changes?"
        description="You have modified this note. Leaving now will discard all your recent changes."
        @close="isDiscardModalOpen = false"
      >
        <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Are you sure you want to discard your edits?</span>
        </div>

        <template #footer>
          <BaseButton variant="secondary" @click="isDiscardModalOpen = false">
            Continue Editing
          </BaseButton>
          <BaseButton variant="danger" @click="confirmDiscard">
            Discard &amp; Exit
          </BaseButton>
        </template>
      </BaseModal>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
/**
 * EditNoteView Component.
 * Fetches existing note by ID, initializes the editing form, validates changes,
 * prompts before discarding unsaved edits, and saves modifications back to the backend.
 */
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import NoteForm from '@/components/notes/NoteForm.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useNotesStore } from '@/stores/notes.store'
import { formatRelativeTime } from '@/utils/date'
import type { CreateNoteRequest, Note } from '@/types/note'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const noteId = computed(() => Number(route.params.id))
const loading = ref(true)
const isSaving = ref(false)
const updateSuccess = ref(false)
const noteData = ref<CreateNoteRequest | null>(null)
const noteTitle = ref('')
const lastModifiedDate = ref('')
const errorMessage = ref<string | null>(null)
const isFormDirty = ref(false)
const isDiscardModalOpen = ref(false)

// Fetch note on mount
onMounted(async () => {
  if (!noteId.value) {
    router.push('/notes')
    return
  }

  loading.value = true
  const note: Note | null = await notesStore.fetchNoteById(noteId.value)
  loading.value = false

  if (note) {
    noteData.value = {
      title: note.title,
      content: note.content || '',
    }
    noteTitle.value = note.title
    lastModifiedDate.value = formatRelativeTime(note.updatedAt || note.createdAt)
  }
})

/**
 * Logical update flow:
 * 1. Check if values actually changed. If not, return without redundant network request.
 * 2. If changed, send update request through store.
 * 3. On success, show visual confirmation banner, then navigate to detail view.
 */
async function handleUpdate(payload: CreateNoteRequest) {
  errorMessage.value = null

  // Check if anything was modified
  const currentTitle = noteData.value?.title || ''
  const currentContent = noteData.value?.content || ''
  const hasChanges = payload.title.trim() !== currentTitle.trim() || (payload.content || '').trim() !== currentContent.trim()

  if (!hasChanges) {
    // No modifications were made; return to the note detail view
    router.push(`/notes/${noteId.value}`)
    return
  }

  isSaving.value = true
  try {
    await notesStore.updateNote(noteId.value, payload)
    updateSuccess.value = true
    setTimeout(() => {
      router.push(`/notes/${noteId.value}`)
    }, 400)
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to update note. Please try again.'
  } finally {
    isSaving.value = false
  }
}

/**
 * Checks if unsaved changes exist before canceling.
 */
function handleCancel() {
  if (isFormDirty.value) {
    isDiscardModalOpen.value = true
  } else {
    router.push(`/notes/${noteId.value}`)
  }
}

/**
 * Confirms discard of modifications.
 */
function confirmDiscard() {
  isDiscardModalOpen.value = false
  router.push(`/notes/${noteId.value}`)
}
</script>
