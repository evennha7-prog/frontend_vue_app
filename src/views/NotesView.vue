<template>
  <!-- Main Notes Dashboard View -->
  <DefaultLayout>
    <div class="space-y-8">
      <!-- Top "Add a Note" Quick Input Card -->
      <QuickAddNote
        ref="quickAddRef"
        :loading="createLoading"
        @submit="handleCreateNote"
      />

      <!-- "My Notes" Section Header & Controls -->
      <div class="space-y-4 pt-2">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <!-- Section Title & Subtitle -->
          <div>
            <div class="flex items-center gap-2.5">
              <!-- Folded Document Icon -->
              <svg class="w-5 h-5 text-[#233258] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
              <h1 class="text-xl sm:text-2xl font-bold text-[#233258] tracking-tight">
                My Notes
              </h1>
              <!-- Badge showing count of currently displayed notes -->
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-white border border-slate-200 text-[#233258] shadow-xs">
                {{ filteredNotes.length }}
              </span>
            </div>
            <p class="text-xs sm:text-[13px] text-[#73829e] font-medium mt-1 pl-7">
              Recently viewed
            </p>
          </div>

          <!-- Search & Sorting Controls -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Search Bar Component -->
            <div class="w-full sm:w-64">
              <NoteSearch
                v-model="search"
                @search="handleSearch"
              />
            </div>

            <!-- Sort Dropdown Component -->
            <div class="self-end sm:self-auto">
              <NoteFilter
                v-model="sort"
                @update:model-value="handleSort"
              />
            </div>
          </div>
        </div>

        <!-- Filter Tabs / Chips for Quick In-Memory Filtering -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <!-- All Notes Tab -->
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl font-medium transition-all duration-150 whitespace-nowrap"
            :class="[
              activeFilter === 'all'
                ? 'bg-[#233258] text-white shadow-xs'
                : 'bg-white text-[#6b7c9e] hover:text-[#233258] border border-slate-200/80 hover:border-slate-300'
            ]"
            @click="activeFilter = 'all'"
          >
            All Notes ({{ notesStore.notes.length }})
          </button>

          <!-- Recent (This Week) Tab -->
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl font-medium transition-all duration-150 whitespace-nowrap"
            :class="[
              activeFilter === 'recent'
                ? 'bg-[#233258] text-white shadow-xs'
                : 'bg-white text-[#6b7c9e] hover:text-[#233258] border border-slate-200/80 hover:border-slate-300'
            ]"
            @click="activeFilter = 'recent'"
          >
            Recent (This Week)
          </button>

          <!-- With Description Tab -->
          <button
            type="button"
            class="px-3.5 py-1.5 rounded-xl font-medium transition-all duration-150 whitespace-nowrap"
            :class="[
              activeFilter === 'has_content'
                ? 'bg-[#233258] text-white shadow-xs'
                : 'bg-white text-[#6b7c9e] hover:text-[#233258] border border-slate-200/80 hover:border-slate-300'
            ]"
            @click="activeFilter = 'has_content'"
          >
            With Description
          </button>

          <!-- Active Search Indicator with reset button -->
          <div v-if="search.trim()" class="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-[#73829e]">
            <span>Filter by: "<strong>{{ search }}</strong>"</span>
            <button
              type="button"
              class="text-rose-600 hover:underline font-semibold ml-1"
              @click="search = ''; handleSearch('')"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Backend Error Notification Banner -->
      <div
        v-if="notesStore.error"
        class="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center justify-between shadow-sm"
      >
        <span>{{ notesStore.error }}</span>
        <button
          type="button"
          class="text-xs font-bold text-rose-700 underline hover:text-rose-900 ml-4"
          @click="notesStore.fetchNotes"
        >
          Try again
        </button>
      </div>

      <!-- Notes Grid / List (CRUD: Read) -->
      <NoteList
        :notes="filteredNotes"
        :loading="notesStore.loading"
        :is-searching="!search.trim() || activeFilter !== 'all'"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="confirmDelete"
      >
        <template #empty-action>
          <div class="flex flex-col items-center gap-2">
            <p v-if="search.trim() || activeFilter !== 'all'" class="text-xs text-[#8c9bb3]">
              No notes match the current search or filter criteria.
            </p>
            <p v-else class="text-xs text-[#8c9bb3]">
              Type a title and take notes in the card above to save your first note.
            </p>
            <button
              v-if="search.trim() || activeFilter !== 'all'"
              type="button"
              class="text-xs font-semibold text-navy-600 hover:text-navy-800 underline"
              @click="search = ''; activeFilter = 'all'; handleSearch('')"
            >
              Show all notes
            </button>
          </div>
        </template>
      </NoteList>

      <!-- 1. READ: Quick View Note Details Modal -->
      <BaseModal
        :is-open="isViewModalOpen"
        :title="viewingNote?.title || 'Note Details'"
        @close="isViewModalOpen = false"
      >
        <div v-if="viewingNote" class="space-y-4">
          <!-- Timestamps banner -->
          <div class="flex flex-wrap items-center gap-3 text-xs text-[#8c9bb3] pb-3 border-b border-slate-100">
            <span>Created: <strong class="text-[#233258]">{{ formatSlashDate(viewingNote.createdAt) }}</strong></span>
            <span v-if="viewingNote.updatedAt && viewingNote.updatedAt !== viewingNote.createdAt" class="text-navy-600 font-medium">
              • Edited: <strong class="text-[#233258]">{{ formatSlashDate(viewingNote.updatedAt) }}</strong>
            </span>
          </div>

          <!-- Note Content Body -->
          <div class="max-h-[55vh] overflow-y-auto pr-1">
            <p v-if="viewingNote.content" class="text-sm sm:text-base text-[#334155] whitespace-pre-wrap leading-relaxed">
              {{ viewingNote.content }}
            </p>
            <p v-else class="text-sm italic text-slate-400">
              No description or extra text added to this note.
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between w-full">
            <!-- Copy content to clipboard button -->
            <button
              type="button"
              class="inline-flex items-center gap-1.5 text-xs text-[#6b7c9e] hover:text-[#233258] transition-colors"
              @click="copyNoteContent"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>{{ copyStatus || 'Copy Note' }}</span>
            </button>

            <div class="flex items-center gap-2">
              <BaseButton
                variant="secondary"
                size="sm"
                @click="isViewModalOpen = false"
              >
                Close
              </BaseButton>
              <BaseButton
                variant="primary"
                size="sm"
                @click="switchFromViewToEdit"
              >
                <template #iconLeft>
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </template>
                Edit
              </BaseButton>
            </div>
          </div>
        </template>
      </BaseModal>

      <!-- 2. UPDATE: Quick Edit Note Modal -->
      <BaseModal
        :is-open="isEditModalOpen"
        title="Edit Note"
        description="Modify your note title and content below."
        @close="isEditModalOpen = false"
      >
        <form @submit.prevent="executeEdit" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-[#233258] mb-1.5">
              Title <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="editForm.title"
              type="text"
              required
              placeholder="e.g., Feedbacks, Weekly Task, Lyrics"
              class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#233258] placeholder-[#8c9bb3] focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100 transition-colors"
            />
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-xs font-bold text-[#233258]">
                Content
              </label>
              <span class="text-[11px] text-[#8c9bb3]">
                {{ editForm.content.length }} characters
              </span>
            </div>
            <textarea
              v-model="editForm.content"
              rows="5"
              placeholder="Add your note body here..."
              class="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[#475569] placeholder-[#8c9bb3] focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-100 transition-colors leading-relaxed resize-y"
            ></textarea>
          </div>
        </form>

        <template #footer>
          <BaseButton
            variant="secondary"
            :disabled="editLoading"
            @click="isEditModalOpen = false"
          >
            Cancel
          </BaseButton>
          <BaseButton
            variant="primary"
            :loading="editLoading"
            :disabled="!editForm.title.trim()"
            @click="executeEdit"
          >
            Save Changes
          </BaseButton>
        </template>
      </BaseModal>

      <!-- 3. DELETE: Delete Confirmation Modal -->
      <BaseModal
        :is-open="isDeleteModalOpen"
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        @close="isDeleteModalOpen = false"
      >
        <p v-if="noteToDelete" class="text-xs sm:text-sm text-[#233258] font-medium p-3 rounded-xl bg-slate-50 border border-slate-200 truncate">
          "{{ noteToDelete.title }}"
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

      <!-- Toast Alerts for Feedback Notifications -->
      <BaseToast
        :show="toast.show"
        :message="toast.message"
        :type="toast.type"
        @close="toast.show = false"
      />
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
/**
 * NotesView Component.
 * Main application dashboard:
 * - QuickAddNote widget for rapid task/thought capture
 * - NoteSearch & NoteFilter controls
 * - Responsive note grid with skeleton loaders
 * - Modals for quick view, quick edit, and deletion
 * - Toast notification feedback
 */
import { ref, reactive, computed, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseToast from '@/components/common/BaseToast.vue'
import QuickAddNote from '@/components/notes/QuickAddNote.vue'
import NoteSearch from '@/components/notes/NoteSearch.vue'
import NoteFilter from '@/components/notes/NoteFilter.vue'
import NoteList from '@/components/notes/NoteList.vue'
import { useNotesStore } from '@/stores/notes.store'
import type { Note, NoteSortOption } from '@/types/note'
import { formatDate, formatRelativeTime, formatSlashDate, liveNow } from '@/utils/date'

const notesStore = useNotesStore()

// State: Search, Sorting & Filter chips
const search = ref('')
const sort = ref<NoteSortOption>('newest')
const activeFilter = ref<'all' | 'recent' | 'has_content'>('all')

// Toast notification state
const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'info',
})

let toastTimeout: number | undefined

/**
 * Triggers a temporary toast notification on screen.
 */
function showToast(message: string, type: 'success' | 'error' | 'info' = 'success') {
  toast.message = message
  toast.type = type
  toast.show = true
  window.clearTimeout(toastTimeout)
  toastTimeout = window.setTimeout(() => {
    toast.show = false
  }, 3500)
}

// -------------------------------------------------------------
// 1. CREATE Operation
// -------------------------------------------------------------
const createLoading = ref(false)
const quickAddRef = ref<InstanceType<typeof QuickAddNote> | null>(null)

/**
 * Handles fast note creation from the top input widget.
 */
async function handleCreateNote(noteData: { title: string; content: string }) {
  createLoading.value = true
  try {
    const created = await notesStore.createNote(noteData)
    quickAddRef.value?.resetForm()
    showToast(`Note "${created.title}" added!`, 'success')
  } catch (err: any) {
    showToast(err.message || 'Failed to create note.', 'error')
  } finally {
    createLoading.value = false
  }
}

// -------------------------------------------------------------
// 2. READ Operation (View Details Modal)
// -------------------------------------------------------------
const isViewModalOpen = ref(false)
const viewingNote = ref<Note | null>(null)
const copyStatus = ref('')

/**
 * Opens modal to preview note text.
 */
function openViewModal(id: number) {
  const note = notesStore.notes.find(n => n.id === id)
  if (note) {
    viewingNote.value = note
    copyStatus.value = ''
    isViewModalOpen.value = true
  }
}

/**
 * Copies note title and content to system clipboard.
 */
async function copyNoteContent() {
  if (!viewingNote.value) return
  const text = `${viewingNote.value.title}\n\n${viewingNote.value.content || ''}`
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = 'Copied!'
    setTimeout(() => {
      copyStatus.value = ''
    }, 2000)
  } catch (err) {
    copyStatus.value = 'Failed to copy'
  }
}

/**
 * Switches from read modal to edit modal for current note.
 */
function switchFromViewToEdit() {
  if (!viewingNote.value) return
  const id = viewingNote.value.id
  isViewModalOpen.value = false
  openEditModal(id)
}

// -------------------------------------------------------------
// 3. UPDATE Operation (Edit Modal)
// -------------------------------------------------------------
const isEditModalOpen = ref(false)
const editLoading = ref(false)
const editNoteId = ref<number | null>(null)
const editForm = reactive({
  title: '',
  content: '',
})

/**
 * Opens edit modal populated with existing note values.
 */
function openEditModal(id: number) {
  const note = notesStore.notes.find(n => n.id === id)
  if (note) {
    editNoteId.value = note.id
    editForm.title = note.title
    editForm.content = note.content || ''
    isEditModalOpen.value = true
  }
}

/**
 * Saves modified note data to backend.
 */
async function executeEdit() {
  if (!editNoteId.value || !editForm.title.trim()) return
  editLoading.value = true
  try {
    const updated = await notesStore.updateNote(editNoteId.value, {
      title: editForm.title.trim(),
      content: editForm.content.trim(),
    })
    isEditModalOpen.value = false
    showToast(`Note "${updated.title}" updated!`, 'success')
    if (viewingNote.value && viewingNote.value.id === updated.id) {
      viewingNote.value = updated
    }
  } catch (err: any) {
    showToast(err.message || 'Failed to update note.', 'error')
  } finally {
    editLoading.value = false
  }
}

// -------------------------------------------------------------
// 4. DELETE Operation (Delete Modal)
// -------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const noteToDelete = ref<Note | null>(null)
const deleteLoading = ref(false)

/**
 * Opens confirmation modal before deleting note.
 */
function confirmDelete(id: number) {
  const note = notesStore.notes.find(n => n.id === id)
  if (note) {
    noteToDelete.value = note
    isDeleteModalOpen.value = true
  }
}

/**
 * Deletes note permanently from backend.
 */
async function executeDelete() {
  if (!noteToDelete.value) return
  const title = noteToDelete.value.title
  deleteLoading.value = true
  try {
    await notesStore.deleteNote(noteToDelete.value.id)
    isDeleteModalOpen.value = false
    if (isViewModalOpen.value && viewingNote.value?.id === noteToDelete.value.id) {
      isViewModalOpen.value = false
    }
    noteToDelete.value = null
    showToast(`Note "${title}" deleted.`, 'info')
  } catch (err: any) {
    showToast(err.message || 'Failed to delete note.', 'error')
  } finally {
    deleteLoading.value = false
  }
}

// Search & Sort Handlers
function handleSearch(query: string) {
  notesStore.setSearch(query)
}

function handleSort(sortOption: NoteSortOption) {
  notesStore.setSort(sortOption)
}

// Client-side quick filter tabs on top of backend query
const filteredNotes = computed(() => {
  let list = notesStore.notes
  if (activeFilter.value === 'has_content') {
    list = list.filter(n => n.content && n.content.trim().length > 0)
  } else if (activeFilter.value === 'recent') {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    list = list.filter(n => new Date(n.createdAt) >= oneWeekAgo)
  }
  return list
})

// Fetch notes on page mount
onMounted(() => {
  notesStore.fetchNotes()
})
</script>
