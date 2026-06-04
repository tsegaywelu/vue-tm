<script setup lang="ts">
import Toast from '@/components/common/Toast.vue';
import RouteProgressBar from '@/components/RouteProgressBar.vue';
import { useThemeStore } from '@/store/themeStore';
useThemeStore();
</script>

<template>
  <RouteProgressBar />
  <Toast />
  <RouterView />
</template>
