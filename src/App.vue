<template>
  <!-- Root application wrapper with consistent background and typography styling -->
  <div id="app" class="min-h-screen text-[#233258] bg-[#edf1f7]">
    <!-- Dynamic page component loaded by Vue Router according to current URL -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
/**
 * Root Application Component.
 * Runs authentication check on mount to restore user session if a valid token exists in localStorage.
 */
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

// Validate existing session token on application boot
onMounted(() => {
  authStore.checkAuth()
})
</script>
