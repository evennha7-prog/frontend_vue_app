<template>
  <!-- Registration Page Layout wrapped in AuthLayout card -->
  <AuthLayout>
    <div class="mb-6">
      <h2 class="text-xl sm:text-2xl font-bold text-[#233258] tracking-tight">Create your account</h2>
      <p class="text-xs sm:text-sm text-[#73829e] mt-1 font-medium">Start organizing your ideas with instant note taking</p>
    </div>

    <!-- Error Alert: Displayed on registration failure or duplicate user/email -->
    <div
      v-if="errorMessage"
      class="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium"
    >
      <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <!-- Registration Form -->
    <form @submit.prevent="handleRegister" class="space-y-4">
      <!-- Username Input -->
      <BaseInput
        id="register-username"
        v-model="form.username"
        label="Username"
        placeholder="Choose a username"
        required
        autocomplete="username"
        :error="errors.username"
      >
        <template #prefix>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </template>
      </BaseInput>

      <!-- Email Address Input -->
      <BaseInput
        id="register-email"
        v-model="form.email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        required
        autocomplete="email"
        :error="errors.email"
      >
        <template #prefix>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </template>
      </BaseInput>

      <!-- Password Input -->
      <BaseInput
        id="register-password"
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        placeholder="At least 6 characters"
        required
        autocomplete="new-password"
        :error="errors.password"
      >
        <template #prefix>
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </template>
        <template #suffix>
          <button
            type="button"
            title="Toggle password visibility"
            class="focus:outline-none text-[#8c9bb3] hover:text-[#233258] transition-colors"
            @click="showPassword = !showPassword"
          >
            <svg v-if="!showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
            </svg>
          </button>
        </template>
      </BaseInput>

      <!-- Password Confirmation Input -->
      <BaseInput
        id="register-confirm"
        v-model="form.confirmPassword"
        :type="showPassword ? 'text' : 'password'"
        label="Confirm Password"
        placeholder="Repeat your password"
        required
        autocomplete="new-password"
        :error="errors.confirmPassword"
      />

      <!-- Submit Registration Button -->
      <BaseButton
        type="submit"
        variant="primary"
        class="w-full mt-2 py-2.5 font-semibold text-sm shadow-sm"
        :loading="authStore.loading"
      >
        Create Account
      </BaseButton>
    </form>

    <!-- Navigation Link to Login Page -->
    <div class="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-[#73829e]">
      Already have an account?
      <router-link to="/login" class="text-[#233258] hover:text-navy-700 font-bold ml-1 hover:underline">
        Sign in
      </router-link>
    </div>
  </AuthLayout>
</template>

<script setup lang="ts">
/**
 * RegisterView Component.
 * Provides user account creation with email, username, password validation,
 * password matching verification, and immediate login upon successful creation.
 */
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuthStore } from '@/stores/auth.store'
import { validateEmail } from '@/utils/validation'

const router = useRouter()
const authStore = useAuthStore()

// State toggles
const showPassword = ref(false)
const errorMessage = ref<string | null>(null)

// Form fields state
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// Field errors state
const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

/**
 * Validates registration fields on client side before hitting backend.
 */
function validate(): boolean {
  let valid = true
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!form.username.trim() || form.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.'
    valid = false
  }

  if (!form.email.trim() || !validateEmail(form.email.trim())) {
    errors.email = 'Please provide a valid email address.'
    valid = false
  }

  if (!form.password || form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
    valid = false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
    valid = false
  }

  return valid
}

/**
 * Submits registration request to Pinia auth store and navigates to /notes on success.
 */
async function handleRegister() {
  if (!validate()) return
  errorMessage.value = null

  try {
    await authStore.register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    })
    router.push('/notes')
  } catch (err: any) {
    errorMessage.value = err.message || 'Registration failed.'
  }
}
</script>
