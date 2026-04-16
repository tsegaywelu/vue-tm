<script setup lang="ts">
import { useSlots } from 'vue'
import { icons } from '@/utils/icons'

const emit = defineEmits<{
  (e: 'toggle_nav'): void
}>()

const slots = useSlots()
</script>

<template>
  <header class="flex items-center justify-between bg-white xl:rounded-4xl p-2 xl:px-4 h-16 xl:h-17 shadow-xs">
    <div class="flex items-center gap-3">
      <!-- Mobile Toggle -->
      <button
        @click="$emit('toggle_nav')"
        class="xl:hidden grid place-items-center p-0 size-8"
      >
        <i
          class="*:size-6 text-grey-600"
          v-html="icons.nav"
        ></i>
      </button>
      
      <!-- Mobile Title (Hidden on XL) -->
      <span v-if="!slots.title" class="font-bold text-xl text-primary tracking-tight xl:hidden">
        ChiNet
      </span>

      <!-- Page Title Slot -->
      <div class="text-grey-900 font-bold text-lg xl:text-xl">
        <slot name="title"></slot>
      </div>
    </div>

    <!-- User Profile & Actions Placeholder -->
    <div class="flex items-center gap-4">
      <slot name="actions"></slot>
    </div>
  </header>
</template>
