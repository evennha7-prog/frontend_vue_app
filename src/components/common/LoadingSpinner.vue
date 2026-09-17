<template>
  <!-- Animated loading spinner SVG with configurable size -->
  <div :class="['inline-flex items-center justify-center', sizeClasses]">
    <svg
      class="animate-spin text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <!-- Subtle static ring background -->
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <!-- Moving partial circle accent -->
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  </div>
</template>

<script setup lang="ts">
/**
 * LoadingSpinner Component.
 * Pure CSS/SVG animated circular spinner supporting 'sm', 'md', and 'lg' sizing.
 */
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Preset size variant: 'sm' (16px), 'md' (20px), 'lg' (32px) */
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'md',
  }
)

// Tailwind width and height utility classes mapped from size prop
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4'
    case 'lg':
      return 'w-8 h-8'
    default:
      return 'w-5 h-5'
  }
})
</script>
