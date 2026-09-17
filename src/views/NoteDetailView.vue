<template>
  <!-- Note Detail View Page -->
  <DefaultLayout>
    <div class="max-w-4xl mx-auto">
      <!-- Top Navigation and Quick Actions Bar -->
      <div class="flex items-center justify-between gap-4 mb-6">
        <!-- Breadcrumbs -->
        <nav class="flex items-center gap-2 text-xs text-slate-400">
          <router-link to="/notes" class="hover:text-slate-200 transition-colors flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Notes
          </router-link>
          <span>/</span>
          <span class="text-slate-200 font-medium truncate max-w-[200px]">
            {{ note?.title || 'Detail' }}
          </span>
        </nav>

        <!-- Top Action Buttons (Copy, Edit, Delete) -->
        <div v-if="note" class="flex items-center gap-2">
          <!-- Copy to clipboard button -->
          <BaseButton
            variant="secondary"
            size="sm"
            @click="copyContent"
          >
            <template #iconLeft>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </template>
            {{ copySuccess ? 'Copied!' : 'Copy' }}
          </BaseButton>

          <!-- Edit note button -->
          <router-link :to="`/notes/${note.id}/edit`">
            <BaseButton variant="secondary" size="sm">
              <template #iconLeft>
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </template>
              Edit
            </BaseButton>
          </router-link>

          <!-- Delete note button -->
          <BaseButton
            variant="danger"
            size="sm"
            @click="isDeleteModalOpen = true"
          >
            <template #iconLeft>
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </template>
            Delete
          </BaseButton>
        </div>
      </div>

      <!-- Loading skeleton state -->
      <div v-if="loading" class="rounded-3xl bg-white p-16 text-center border border-slate-200/80 shadow-sm">
        <LoadingSpinner size="lg" class="text-[#233258] mb-3" />
        <p class="text-xs sm:text-sm text-[#73829e]">Loading note details...</p>
      </div>

      <!-- Not found / Error state -->
      <div v-else-if="!note" class="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-sm">
        <div class="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-lg font-bold text-[#233258] mb-1">Note Not Found</h2>
        <p class="text-xs text-[#73829e] mb-6">The requested note might have been removed or you may not have access to it.</p>
        <router-link to="/notes">
          <BaseButton variant="primary">Return to Notes</BaseButton>
        </router-link>
      </div>

      <!-- Full Detail Content Card -->
      <div v-else class="rounded-3xl bg-white p-6 sm:p-10 border border-slate-200/80 shadow-[0_4px_25px_rgba(43,58,103,0.06)] space-y-8 animate-fade-in">
        <!-- Header -->
        <div class="space-y-4 pb-6 border-b border-slate-100">
          <h1 class="text-2xl sm:text-3xl font-extrabold text-[#233258] tracking-tight break-words">
            {{ note.title }}
          </h1>

          <!-- Meta Timestamps Bar -->
          <div class="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#73829e]">
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-navy-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Created on <strong class="text-[#233258]">{{ formatDate(note.createdAt) }}</strong></span>
            </div>

            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-[#8c9bb3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last updated <strong class="text-[#233258]">{{ formatDate(note.updatedAt) }}</strong></span>
            </div>
          </div>
        </div>

        <!-- Rendered Markdown Note Content Body -->
        <div class="rounded-2xl bg-slate-50 border border-slate-200/80 p-6 text-[#334155] text-sm sm:text-base leading-relaxed font-sans shadow-xs">
          <div v-html="renderedContent"></div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <BaseModal
        :is-open="isDeleteModalOpen"
        title="Delete Note"
        description="Are you sure you want to delete this note? This action is permanent and cannot be undone."
        @close="isDeleteModalOpen = false"
      >
        <p class="text-sm text-slate-200 font-medium p-3 rounded-xl bg-slate-900 border border-slate-800 truncate">
          "{{ note?.title }}"
        </p>

        <template #footer>
          <BaseButton
            variant="secondary"
            :disabled="deleteLoading"
            @click="isDeleteModalOpen = false"
          >
            Cancel
          </BaseButton>
          <BaseButton
            variant="danger"
            :loading="deleteLoading"
            @click="executeDelete"
          >
            Delete Note
          </BaseButton>
        </template>
      </BaseModal>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
/**
 * NoteDetailView Component.
 * Displays the complete note with rendered markdown typography,
 * creation and last modification timestamps, copy-to-clipboard,
 * and direct links to edit or delete.
 */
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { useNotesStore } from '@/stores/notes.store'
import { formatDate } from '@/utils/date'
import { renderMarkdown } from '@/utils/markdown'
import type { Note } from '@/types/note'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const noteId = computed(() => Number(route.params.id))
const loading = ref(true)
const note = ref<Note | null>(null)
const isDeleteModalOpen = ref(false)
const deleteLoading = ref(false)
const copySuccess = ref(false)

// Convert raw note content into sanitized styled HTML
const renderedContent = computed(() => {
  return renderMarkdown(note.value?.content)
})

// Fetch note on mount
onMounted(async () => {
  if (!noteId.value) {
    router.push('/notes')
    return
  }

  loading.value = true
  const fetchedNote = await notesStore.fetchNoteById(noteId.value)
  note.value = fetchedNote
  loading.value = false
})

/**
 * Copies note title and content to user's clipboard.
 */
async function copyContent() {
  if (!note.value) return
  const text = `${note.value.title}\n\n${note.value.content || ''}`
  try {
    await navigator.clipboard.writeText(text)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch {
    console.error('Failed to copy to clipboard')
  }
}

/**
 * Deletes note and navigates back to /notes list.
 */
async function executeDelete() {
  if (!note.value) return
  deleteLoading.value = true
  try {
    await notesStore.deleteNote(note.value.id)
    isDeleteModalOpen.value = false
    router.push('/notes')
  } catch (err) {
    console.error(err)
  } finally {
    deleteLoading.value = false
  }
}
</script>
