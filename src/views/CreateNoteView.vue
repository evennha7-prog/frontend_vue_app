<template>
  <!-- Create Note Page View -->
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
        <span class="text-slate-200 font-medium">Create Note</span>
      </nav>

      <!-- Success Notification Banner -->
      <div
        v-if="creationSuccess"
        class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3 animate-fade-in"
      >
        <svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Note created successfully! Opening note...</span>
      </div>

      <!-- Note Creation Card with Form -->
      <div class="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_25px_rgba(43,58,103,0.06)]">
        <div class="mb-6 pb-4 border-b border-slate-100">
          <h1 class="text-2xl font-bold text-[#233258] tracking-tight">
            Create a New Note
          </h1>
          <p class="text-xs text-[#73829e] mt-1 font-medium">
            Choose a starter sample template or compose your own note with live markdown preview.
          </p>
        </div>

        <!-- NoteForm Reusable Component -->
        <NoteForm
          submit-text="Create Note"
          :loading="isSaving"
          :server-error="errorMessage"
          @dirty-change="isFormDirty = $event"
          @submit="handleCreate"
          @cancel="handleCancel"
        />
      </div>

      <!-- Discard Unsaved Changes Confirmation Modal -->
      <BaseModal
        :is-open="isDiscardModalOpen"
        title="Discard Draft?"
        description="You have entered text in this note. Leaving now will discard your draft."
        @close="isDiscardModalOpen = false"
      >
        <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Are you sure you want to discard this note?</span>
        </div>

        <template #footer>
          <BaseButton variant="secondary" @click="isDiscardModalOpen = false">
            Continue Writing
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
 * CreateNoteView Component.
 * Dedicated page for composing a new note with draft discard warnings
 * and automatic transition to the newly created note's detail page.
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import NoteForm from '@/components/notes/NoteForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useNotesStore } from '@/stores/notes.store'
import type { CreateNoteRequest } from '@/types/note'

const router = useRouter()
const notesStore = useNotesStore()

// State
const isSaving = ref(false)
const creationSuccess = ref(false)
const errorMessage = ref<string | null>(null)
const isFormDirty = ref(false)
const isDiscardModalOpen = ref(false)

/**
 * Handles note creation request and navigates to the new note.
 */
async function handleCreate(payload: CreateNoteRequest) {
  errorMessage.value = null
  isSaving.value = true
  try {
    const createdNote = await notesStore.createNote(payload)
    creationSuccess.value = true
    setTimeout(() => {
      router.push(`/notes/${createdNote.id}`)
    }, 400)
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to create note. Please check your inputs.'
  } finally {
    isSaving.value = false
  }
}

/**
 * Handles user canceling: checks if form is dirty before leaving.
 */
function handleCancel() {
  if (isFormDirty.value) {
    isDiscardModalOpen.value = true
  } else {
    router.push('/notes')
  }
}

/**
 * Confirms draft discard and navigates back to notes list.
 */
function confirmDiscard() {
  isDiscardModalOpen.value = false
  router.push('/notes')
}
</script>
