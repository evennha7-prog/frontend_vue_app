<template>
  <!-- Reusable button with support for variants, sizes, loading spinners, and slots -->
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.98]',
      sizeClasses,
      variantClasses,
      (disabled || loading) ? 'opacity-60 cursor-not-allowed transform-none' : 'cursor-pointer shadow-sm hover:shadow'
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Optional spinner shown when button is in loading state -->
    <LoadingSpinner v-if="loading" size="sm" class="mr-2" />
    <!-- Left-aligned icon slot -->
    <span v-if="$slots.iconLeft && !loading" class="mr-2 inline-flex items-center">
      <slot name="iconLeft"></slot>
    </span>
    <!-- Default button label / text slot -->
    <slot></slot>
    <!-- Right-aligned icon slot -->
    <span v-if="$slots.iconRight" class="ml-2 inline-flex items-center">
      <slot name="iconRight"></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * BaseButton Component.
 * Customizable button supporting primary, secondary, danger, ghost, and outline themes.
 */
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = withDefaults(
  defineProps<{
    /** Button HTML type: button, submit, or reset */
    type?: 'button' | 'submit' | 'reset'
    /** Visual theme variant */
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
    /** Button size preset */
    size?: 'sm' | 'md' | 'lg'
    /** If true, displays spinner and disables interaction */
    loading?: boolean
    /** If true, disables button interactions */
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
  }
)

defineEmits<{
  /** Emitted when button is clicked by user */
  (e: 'click', event: MouseEvent): void
}>()

// Dynamic Tailwind padding and typography based on size prop
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-xs'
    case 'lg':
      return 'px-6 py-3 text-base'
    default:
      return 'px-4 py-2 text-sm'
  }
})

// Dynamic color, background, and hover classes based on variant prop
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-slate-100 hover:bg-slate-200 text-[#233258] border border-slate-200 focus:ring-slate-400'
    case 'danger':
      return 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm'
    case 'ghost':
      return 'bg-transparent hover:bg-slate-100 text-[#475569] hover:text-[#233258] focus:ring-slate-300'
    case 'outline':
      return 'bg-transparent border border-slate-200 hover:bg-slate-50 text-[#233258] focus:ring-slate-300'
    case 'primary':
    default:
      return 'bg-[#233258] hover:bg-[#1a2542] text-white focus:ring-navy-600 shadow-sm'
  }
})
</script>
