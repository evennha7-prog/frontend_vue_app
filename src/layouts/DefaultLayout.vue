<template>
  <!-- Main application shell layout for authenticated views -->
  <div class="min-h-screen flex flex-col bg-[#edf1f7] text-[#233258]">
    <!-- Top Sticky Navigation Bar -->
    <header class="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Brand Logo and Link to Home/Notes -->
        <router-link to="/" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 rounded-xl bg-[#233258] flex items-center justify-center text-white shadow-sm shadow-[#233258]/20 group-hover:scale-105 transition-transform duration-200">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span class="text-lg font-bold tracking-tight text-[#233258]">
            Notes <span class="text-navy-500">Tok</span>
          </span>
        </router-link>

        <!-- Right Side: User Profile Badge & Logout Action -->
        <div class="flex items-center gap-3">
          <div v-if="authStore.user" class="flex items-center gap-3">
            <!-- User initial avatar circle -->
            <div class="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-[#233258]">
              {{ authStore.user.username.charAt(0).toUpperCase() }}
            </div>
            <!-- Username and email details -->
            <div class="hidden sm:block text-left">
              <div class="text-xs font-semibold text-[#233258] leading-tight">
                {{ authStore.user.username }}
              </div>
              <div class="text-[11px] text-[#73829e] truncate max-w-[140px]">
                {{ authStore.user.email }}
              </div>
            </div>
            <!-- Logout Button -->
            <button
              type="button"
              title="Sign out"
              class="p-2 rounded-xl text-[#6b7c9e] hover:text-rose-600 hover:bg-slate-100 transition-colors ml-1"
              @click="handleLogout"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area: Renders router view contents -->
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <slot></slot>
    </main>

    <!-- App Footer -->
    <footer class="border-t border-slate-200/80 py-6 text-center text-xs text-[#8c9bb3]">
      <p>© 2026 Notes Tok by CHEA Panha</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
/**
 * DefaultLayout: The primary application container with sticky top navbar,
 * active user info, logout handler, content slot, and persistent footer.
 */
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

/**
 * Logs out user, clears token from store & localStorage, and redirects to login page.
 */
function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>
