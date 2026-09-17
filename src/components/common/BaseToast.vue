<template>
  <!-- Teleport toast notification to <body> floating at bottom-right corner -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-3 sm:translate-y-0 sm:translate-x-3"
      enter-to-class="opacity-100 translate-y-0 sm:translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="show"
        class="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium transition-all"
        :class="[
          type === 'success' ? 'bg-white border-emerald-200 text-emerald-900 shadow-emerald-500/10' :
          type === 'error' ? 'bg-white border-rose-200 text-rose-900 shadow-rose-500/10' :
          'bg-white border-slate-200 text-[#233258] shadow-slate-500/10'
        ]"
      >
        <!-- Success Icon (Green checkmark) -->
        <div
          v-if="type === 'success'"
          class="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <!-- Error Icon (Red X) -->
        <div
          v-else-if="type === 'error'"
          class="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <!-- Info Icon (Blue exclamation circle) -->
        <div
          v-else
          class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <!-- Notification Message text -->
        <span class="text-xs sm:text-sm font-semibold">{{ message }}</span>

        <!-- Manual Dismiss Button -->
        <button
          type="button"
          title="Dismiss"
          class="ml-2 text-slate-400 hover:text-slate-600 p-1"
          @click="$emit('close')"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * BaseToast Component.
 * Floating notification pill supporting success, error, and informational feedback messages.
 */
defineProps<{
  /** Visibility toggle */
  show: boolean
  /** Text content displayed in toast */
  message: string
  /** Visual type styling: 'success' | 'error' | 'info' */
  type?: 'success' | 'error' | 'info'
}>()

defineEmits<{
  /** Emitted when toast close button is clicked */
  (e: 'close'): void
}>()
</script>
