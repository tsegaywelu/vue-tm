<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "@/components/Sidebar.vue";
import TopNavBar from "@/components/TopNavBar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import { getNavigationRegistry } from "@/router/navigation";
import { useAuthStore } from "@/store/authStore";
import type { Navs } from "@/types/navigation";
import DashboardPage from "@/components/common/DashboardPage.vue";
import AiChatBox from "@/components/AiChatBox.vue";

const authStore = useAuthStore();
const route = useRoute();

const allNavs = computed(() => {
  const registry = getNavigationRegistry(authStore.is_shipper);
  return registry.reduce((acc, group) => {
    return acc.concat(group.items);
  }, [] as Navs[]);
});

const is_dashboard = computed(
  () =>
    route.name === "operation_dashboard" || route.name === "shipper_dashboard",
);

const is_open = ref(window.innerWidth > 1280);
const is_chat_open = ref(false);
// Delayed — keeps the grid column alive during the leave transition
const chat_col_active = ref(false);

function toggle_chat() {
  if (is_chat_open.value) {
    is_chat_open.value = false;
    setTimeout(() => {
      chat_col_active.value = false;
    }, 210);
  } else {
    chat_col_active.value = true;
    nextTick(() => {
      is_chat_open.value = true;
    });
  }
}

// When navigating away from dashboard, drop the grid column immediately
watch(is_dashboard, (onDash) => {
  if (!onDash) chat_col_active.value = false;
  else if (is_chat_open.value) chat_col_active.value = true;
});

const toggle_nav = () => {
  is_open.value = !is_open.value;
};

const close_nav = () => {
  if (window.innerWidth <= 1280) is_open.value = false;
};

const update_layout = () => {
  if (window.innerWidth > 1280) is_open.value = true;
};

const grid_cols_class = computed(() => {
  const with_chat = is_dashboard.value && chat_col_active.value;
  if (is_open.value && with_chat)
    return "xl:grid-cols-[18rem_minmax(0,1fr)_32rem]";
  if (is_open.value) return "xl:grid-cols-[18rem_minmax(0,1fr)]";
  if (with_chat) return "xl:grid-cols-[5.5rem_minmax(0,1fr)_32rem]";
  return "xl:grid-cols-[5.5rem_minmax(0,1fr)]";
});

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
    :class="grid_cols_class"
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
          <button
            :title="is_chat_open ? 'Close AI Assistant' : 'Open AI Assistant'"
            class="flex items-center tracking-wider gap-2 p-2 font-bold text-xs rounded-xl transition-colors"
            :class="
              is_chat_open
                ? 'text-primary bg-primary/10 hover:bg-primary/20'
                : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
            "
            @click="toggle_chat"
          >
            AI
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </button>
        </template>
      </TopNavBar>

      <div
        class="grid grid-cols-1 gap-3 grid-rows-[auto_auto_1fr] overflow-auto"
      >
        <div class="min-w-0">
          <Breadcrumb :navs="allNavs" />
          <div id="extra-page-data"></div>
        </div>
        <main class="w-full @container">
          <RouterView v-slot="{ Component, route: r }">
            <template v-if="isMounted">
              <DashboardPage v-if="!r.meta.noWrapper">
                <component :is="Component" :key="r.path" />
              </DashboardPage>
              <component :is="Component" v-else :key="r.path" />
            </template>
          </RouterView>
        </main>
      </div>
    </div>

    <!-- Inline panel — dashboard only, pushes content aside -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-x-8"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-8"
    >
      <AiChatBox
        v-if="is_chat_open && is_dashboard"
        class="m-2 rounded-2xl overflow-hidden shadow-sm"
        @close="toggle_chat"
      />
    </Transition>
  </div>

  <!-- Floating panel — all other pages -->
  <Teleport v-if="isMounted" to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="is_chat_open && !is_dashboard"
        class="fixed bottom-4 right-4 z-50 w-96 rounded-2xl overflow-hidden shadow-2xl print-hide"
        style="height: 560px"
      >
        <AiChatBox @close="toggle_chat" />
      </div>
    </Transition>
  </Teleport>
</template>

<style>
html,
body,
#app {
  height: 100%;
}
</style>
