<template>
  <!-- Fullscreen centered container for authentication pages (Login & Register) -->
  <div class="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative bg-[#edf1f7]">
    <!-- Decorative subtle ambient background blur circles -->
    <div class="absolute -top-32 -left-32 w-80 h-80 bg-navy-200/40 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Centered Card Container -->
    <div class="w-full max-w-md relative z-10">
      <!-- App Brand Logo and Headline -->
      <div class="text-center mb-8">
        <div class="inline-flex w-12 h-12 rounded-2xl bg-[#233258] items-center justify-center text-white shadow-lg shadow-[#233258]/20 mb-3 transition-transform hover:scale-105 duration-200">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-[#233258]">
          Notes <span class="text-navy-500">Tok</span>
        </h1>
        <p class="text-xs sm:text-sm text-[#73829e] mt-1.5 font-medium">
          Your personal space for organized thoughts and notes
        </p>
      </div>

      <!-- Main auth card containing page-specific form slot -->
      <div class="rounded-3xl bg-white p-7 sm:p-9 shadow-[0_10px_35px_rgba(43,58,103,0.07)] border border-slate-200/80">
        <slot></slot>
      </div>

      <!-- Footer security note -->
      <div class="mt-6 text-center text-xs text-[#8c9bb3] font-medium">
        Protected with Secure JWT &amp; SQL Server
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * AuthLayout: Provides an aesthetic, centered single-card layout
 * for login, registration, and password recovery pages.
 */
</script>
