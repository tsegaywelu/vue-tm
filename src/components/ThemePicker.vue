<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore, ACCENT_OPTIONS } from '@/store/themeStore'

const themeStore = useThemeStore()
const open = ref(false)
const btnRef = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (btnRef.value && !btnRef.value.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))
</script>

<template>
  <div ref="btnRef" class="relative">
    <button
      @click="open = !open"
      class="flex items-center justify-center size-9 rounded-xl hover:bg-surface-hover transition-colors"
      :title="themeStore.mode === 'light' ? 'Switch to dark' : 'Switch to light'"
      :class="open ? 'bg-surface-hover' : ''"
    >
      <!-- Sun icon (shown in dark/black mode — click to go light) -->
      <svg
        v-if="themeStore.mode === 'dark' || themeStore.mode === 'black'"
        xmlns="http://www.w3.org/2000/svg"
        class="size-5 text-faint-text"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
        />
      </svg>
      <!-- Moon icon (shown in light mode — click to go dark) -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="size-5 text-faint-text"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.8"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
        />
      </svg>
    </button>

    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-1"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-1"
    >
      <div
        v-if="open"
        class="absolute right-0 top-full mt-2 w-56 bg-surface rounded-2xl shadow-lg border border-line z-50 p-3 flex flex-col gap-3 origin-top-right"
      >
        <!-- Label -->
        <p class="text-xs font-semibold text-dim-text uppercase tracking-wider px-1">Appearance</p>

        <!-- Light / Dark / Black toggle -->
        <div class="flex gap-1 p-0.5 bg-surface-muted rounded-xl border border-line">
          <button
            @click="themeStore.setMode('light')"
            class="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
            :class="themeStore.mode === 'light' ? 'bg-surface shadow-sm text-base-text' : 'text-dim-text hover:text-base-text'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
            Light
          </button>
          <button
            @click="themeStore.setMode('dark')"
            class="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
            :class="themeStore.mode === 'dark' ? 'bg-surface shadow-sm text-base-text' : 'text-dim-text hover:text-base-text'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
            Dark
          </button>
          <button
            @click="themeStore.setMode('black')"
            class="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
            :class="themeStore.mode === 'black' ? 'bg-[#0f0f0f] shadow-sm text-white' : 'text-dim-text hover:text-base-text'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="size-3.5" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="9" />
            </svg>
            Black
          </button>
        </div>

        <!-- Accent colors -->
        <div class="flex flex-col gap-1.5 px-1">
          <p class="text-xs text-faint-text">Accent color</p>
          <div class="flex items-center gap-2">
            <button
              v-for="a in ACCENT_OPTIONS"
              :key="a.key"
              @click="themeStore.setAccent(a.key)"
              class="size-7 rounded-full transition-all flex-shrink-0 flex items-center justify-center"
              :style="{ backgroundColor: a.color }"
              :title="a.label"
            >
              <svg
                v-if="themeStore.accent === a.key"
                xmlns="http://www.w3.org/2000/svg"
                class="size-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="3"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
