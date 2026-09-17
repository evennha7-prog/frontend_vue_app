<template>
  <!-- Teleport modal dialog directly to <body> to prevent z-index clipping -->
  <Teleport to="body">
    <!-- Backdrop Fade Transition -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        @click.self="closeOnBackdrop && $emit('close')"
      >
        <!-- Modal Card Zoom/Slide Transition -->
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl relative border border-slate-200 animate-slide-up"
            role="dialog"
            aria-modal="true"
          >
            <!-- Modal Header (Title, description, and close button) -->
            <div class="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 class="text-lg font-bold text-[#233258]">
                  {{ title }}
                </h3>
                <p v-if="description" class="text-xs sm:text-sm text-[#6b7c9e] mt-1">
                  {{ description }}
                </p>
              </div>
              <button
                type="button"
                title="Close"
                class="rounded-lg p-1.5 text-[#8c9bb3] hover:text-[#233258] hover:bg-slate-100 transition-colors focus:outline-none"
                @click="$emit('close')"
              >
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Content Body slot -->
            <div class="py-4 text-[#475569]">
              <slot></slot>
            </div>

            <!-- Modal Action Footer slot (Cancel, Confirm, etc.) -->
            <div v-if="$slots.footer" class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * BaseModal Component.
 * Accessible modal dialog rendered via Teleport with backdrop click handling,
 * ESC key listener, and scroll lock on the body element.
 */
import { onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Visibility state of the dialog */
    isOpen: boolean
    /** Headline title in modal header */
    title: string
    /** Optional secondary explanation text below title */
    description?: string
    /** If true, clicking backdrop closes the modal */
    closeOnBackdrop?: boolean
  }>(),
  {
    closeOnBackdrop: true,
  }
)

const emit = defineEmits<{
  /** Emitted when modal requests to close */
  (e: 'close'): void
}>()

/**
 * Closes modal on Escape key press.
 */
function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close')
  }
}

// Lock/unlock background page scrolling when modal opens or closes
watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

// Register global keyboard listener on mount
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

// Clean up listeners and restore body scroll on unmount
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>
