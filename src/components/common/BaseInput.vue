<template>
  <!-- Reusable Form Input Field with label, validation error, prefix/suffix icons -->
  <div class="w-full">
    <!-- Optional field label & hint -->
    <div v-if="label" class="flex justify-between items-center mb-1.5">
      <label :for="id" class="block text-xs font-bold uppercase tracking-wider text-[#233258]">
        {{ label }}
        <span v-if="required" class="text-rose-500">*</span>
      </label>
      <span v-if="hint" class="text-xs text-[#8c9bb3]">{{ hint }}</span>
    </div>

    <div class="relative rounded-xl shadow-xs">
      <!-- Left prefix icon slot (e.g., search icon or email symbol) -->
      <div
        v-if="$slots.prefix"
        class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#73829e]"
      >
        <slot name="prefix"></slot>
      </div>

      <!-- HTML Input element -->
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :autocomplete="autocomplete"
        :class="[
          'block w-full rounded-xl border bg-slate-50/70 hover:bg-white focus:bg-white text-[#233258] placeholder-[#94a3b8] focus:outline-none focus:ring-2 transition-all duration-150 sm:text-sm font-medium',
          $slots.prefix ? 'pl-10' : 'pl-3.5',
          $slots.suffix ? 'pr-10' : 'pr-3.5',
          'py-2.5',
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-100'
            : 'border-slate-200 focus:border-navy-500 focus:ring-navy-100 hover:border-slate-300',
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <!-- Right suffix icon slot (e.g., clear button or eye toggle) -->
      <div
        v-if="$slots.suffix"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#73829e]"
      >
        <slot name="suffix"></slot>
      </div>
    </div>

    <!-- Error message text block with warning icon -->
    <p v-if="error" class="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
      <svg class="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ error }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * BaseInput Component.
 * Controlled form text input supporting two-way v-model binding, error highlights, and icon slots.
 */
withDefaults(
  defineProps<{
    /** Value bound via v-model */
    modelValue: string | number
    /** HTML input ID for accessibility */
    id?: string
    /** Top field label */
    label?: string
    /** HTML input type: text, password, email, number, etc. */
    type?: string
    /** Placeholder hint text */
    placeholder?: string
    /** Validation error message string (highlights red if present) */
    error?: string | null
    /** Subtext or helper note next to label */
    hint?: string
    /** Whether field is required */
    required?: boolean
    /** Whether input is disabled */
    disabled?: boolean
    /** Autocomplete attribute for browser autofill */
    autocomplete?: string
  }>(),
  {
    type: 'text',
    required: false,
    disabled: false,
  }
)

defineEmits<{
  /** Emitted to update v-model value */
  (e: 'update:modelValue', value: string): void
  /** Emitted when input loses focus */
  (e: 'blur', event: FocusEvent): void
  /** Emitted when input gains focus */
  (e: 'focus', event: FocusEvent): void
}>()
</script>
