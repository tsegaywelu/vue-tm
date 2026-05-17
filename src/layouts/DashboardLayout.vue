<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import Sidebar from "@/components/Sidebar.vue";
import TopNavBar from "@/components/TopNavBar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { getNavigationRegistry } from "@/router/navigation";
import { useAuthStore } from "@/store/authStore";
import type { Navs } from "@/types/navigation";
import DashboardPage from "@/components/common/DashboardPage.vue";

const authStore = useAuthStore();

const allNavs = computed(() => {
  const registry = getNavigationRegistry(authStore.is_shipper);
  return registry.reduce((acc, group) => {
    return acc.concat(group.items);
  }, [] as Navs[]);
});

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

// because Teleport requires the parent to be mounted
const isMounted = ref(false);
onMounted(() => {
  isMounted.value = true;
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
        ? 'xl:grid-cols-[18rem_minmax(0,1fr)]'
        : 'xl:grid-cols-[5.5rem_minmax(0,1fr)]'
    "
  >
    <Sidebar
      class="print-hide"
      :is_open="is_open"
      @toggle="toggle_nav"
      @close="close_nav"
    >
      <template #nav>
        <slot name="navigation"></slot>
      </template>
    </Sidebar>

    <div
      class="grid grid-cols-1 grid-rows-[auto_1fr] overflow-hidden p-2 xl:p-4 gap-1 xl:gap-4 h-full max-h-full box-border"
    >
      <TopNavBar class="print-hide" @toggle_nav="toggle_nav">
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
        <div>
          <Breadcrumb :navs="allNavs" />
          <div id="extra-page-data"></div>
        </div>
        <main class="w-full">
          <RouterView v-slot="{ Component, route }">
            <template v-if="isMounted">
              <DashboardPage v-if="!route.meta.noWrapper">
                <component :is="Component" :key="route.path" />
              </DashboardPage>
              <component :is="Component" v-else :key="route.path" />
            </template>
          </RouterView>
        </main>
      </div>
    </div>
    <!-- Chatbox -->
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
}
</style>
