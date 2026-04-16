<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import TopNavBar from "@/components/TopNavBar.vue";

const is_open = ref(window.innerWidth > 1280);

const toggle_nav = () => {
  is_open.value = !is_open.value;
};

const close_nav = () => {
  if (window.innerWidth <= 1280) {
    is_open.value = false;
  }
};

const update_layout = () => {
  if (window.innerWidth > 1280) {
    is_open.value = true;
  }
};

onMounted(() => {
  window.addEventListener("resize", update_layout);
});

onUnmounted(() => {
  window.removeEventListener("resize", update_layout);
});
</script>

<template>
  <div
    class="grid transition-all duration-300 ease-in-out bg-[#fafafa] h-full w-full overflow-hidden"
    :class="
      is_open
        ? 'xl:grid-cols-[20rem_minmax(0,1fr)]'
        : 'xl:grid-cols-[5.5rem_minmax(0,1fr)]'
    "
  >
    <!-- Sidebar Component -->
    <Sidebar :is_open="is_open" @toggle="toggle_nav" @close="close_nav">
      <template #nav>
        <slot name="navigation"></slot>
      </template>
    </Sidebar>

    <!-- Main Content Area -->
    <div
      class="grid grid-cols-1 grid-rows-[4rem_1fr] xl:grid-rows-[4.25rem_1fr] overflow-hidden p-2 xl:p-4 gap-1 xl:gap-4 h-full max-h-full box-border"
    >
      <TopNavBar @toggle_nav="toggle_nav">
        <template #title>
          <slot name="header-title"></slot>
        </template>
        <template #actions>
          <slot name="header-actions"></slot>
        </template>
      </TopNavBar>

      <div
        class="grid grid-cols-1 gap-3 grid-rows-[auto_auto_1fr] overflow-auto"
      >
        <!-- Breadcrumbs Placeholder -->
        <slot name="breadcrumbs"></slot>

        <!-- Main Content -->
        <main class="w-full">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<style>
/* Global override for HTML/Body to match Raaz grid layout */
html,
body,
#app {
  height: 100%;
}
</style>
