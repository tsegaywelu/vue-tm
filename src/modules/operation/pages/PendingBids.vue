<template>
  <div class="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto min-h-screen animate-fade-in">
    <!-- Header Area -->
    <div class="flex flex-col gap-2">
      <h1 class="text-3xl font-extrabold text-primary tracking-tight">Pending Bids</h1>
      <p class="text-gray-500 font-medium text-lg">Review and manage carrier bids for open shipments.</p>
    </div>

    <!-- Placeholder Content -->
    <div class="flex-1 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-12 overflow-hidden shadow-sm">
      <div class="size-24 rounded-full bg-blue-50 flex items-center justify-center mb-6 animate-pulse">
        <div class="size-12 text-primary" v-html="raaz_icons.shipment"></div>
      </div>
      <h3 class="text-2xl font-bold text-gray-800 mb-2">Bidding System Coming Soon</h3>
      <p class="text-gray-500 text-center max-w-md">Our high-performance bidding engine is currently under development. Stay tuned for real-time carrier negotiations.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { raaz_icons } from '@/utils/raaz_icons'
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
