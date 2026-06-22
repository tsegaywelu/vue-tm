<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import NavButton from "@/components/NavButton.vue";
import LogoAnimation from "@/components/LogoAnimation.vue";
import {
  getNavigationRegistry,
  filterNavsByPermission,
} from "@/router/navigation";
import { useAuthStore } from "@/store/authStore";
import { openModal } from "@customizer/modal-x";

const all_icons = { ...icons, ...raaz_icons };
const authStore = useAuthStore();

const dynamicNavRegistry = computed(() => {
  const registry = getNavigationRegistry(authStore.is_shipper, authStore.is_super_admin);
  return registry
    .map((group) => ({
      ...group,
      items: filterNavsByPermission(group.items, authStore.has_permission),
    }))
    .filter((group) => group.items.some((item) => item.show !== false));
});

const props = defineProps<{
  is_open: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "close"): void;
}>();

const is_desktop = ref(window.innerWidth > 1280);

const show_expanded = computed(() => props.is_open);

const update_media = () => {
  is_desktop.value = window.innerWidth > 1280;
};

onMounted(() => window.addEventListener("resize", update_media));
onUnmounted(() => window.removeEventListener("resize", update_media));

const user = computed(
  () => authStore.current_user?.user ?? authStore.current_user ?? {},
);

const userName = computed(
  () =>
    [user.value?.firstName, user.value?.lastName].filter(Boolean).join(" ") ||
    user.value?.name ||
    user.value?.username ||
    "User",
);

const userInitials = computed(() => {
  const name = userName.value;
  if (!name || name === "User") return "U";
  const parts = name.trim().split(" ");
  return (
    parts.length >= 2
      ? (parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")
      : (parts[0][0] ?? "") + (parts[0][1] ?? "")
  ).toUpperCase();
});

const userRole = computed(
  () => user.value?.role?.name || user.value?.type || "",
);

async function handleLogout() {
  const confirmed = await openModal("ConfirmationModal", {
    title: "Logout",
    message: "Are you sure you want to logout?",
    confirmText: "Logout",
    action: "logout",
  });
  if (confirmed) authStore.logout();
}

const close_nav = () => {
  if (!is_desktop.value) emit("close");
};

const navScrollRef = ref<HTMLElement | null>(null);

const scrollToActive = () => {
  requestAnimationFrame(() => {
    const container = navScrollRef.value;
    const activeEl = container?.querySelector(
      "[data-nav-active]",
    ) as HTMLElement | null;
    if (!container || !activeEl) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();
    const top =
      elRect.top -
      containerRect.top +
      container.scrollTop -
      containerRect.height / 2 +
      elRect.height / 2;
    container.scrollTo({ top, behavior: "instant" });
  });
};

// Scroll to active every time the sidebar opens/expands
watch(
  () => props.is_open,
  (opened) => {
    if (opened) {
      scrollToActive();
      // Ensure it scrolls correctly after transition completes
      setTimeout(scrollToActive, 300);
    }
  },
);

// Desktop: save scroll position on collapse, restore on expand
let savedScrollTop = 0;
watch(show_expanded, (expanded) => {
  if (!expanded) {
    savedScrollTop = navScrollRef.value?.scrollTop ?? 0;
  } else {
    requestAnimationFrame(() => {
      if (navScrollRef.value) navScrollRef.value.scrollTo({ top: savedScrollTop, behavior: "instant" });
    });
  }
});
</script>

<template>
  <!--
    Mobile:  position:fixed overlay that slides in from the left (backdrop + panel).
    Desktop: position:relative in the grid column; the inner panel is absolute and
             expands to the right on hover without shifting the layout.
  -->
  <div
    class="h-full"
    :class="
      is_desktop
        ? 'relative overflow-visible'
        : 'fixed inset-0 z-20 backdrop-blur-xs xl:bg-transparent flex'
    "
    :style="
      !is_desktop
        ? { transform: is_open ? 'translateX(0)' : 'translateX(-100%)' }
        : {}
    "
    @click="!is_desktop && $emit('close')"
  >
    <!-- Panel -->
    <div
      @click.stop
      class="h-full flex flex-col gap-5 bg-surface overflow-hidden border-r border-transparent dark:border-white/10 dark:shadow-[8px_0_30px_rgba(255,255,255,0.05)] transition-all duration-300"
      :class="{
        // Mobile
        'w-full max-w-70 shadow-lg': !is_desktop,
        // Desktop: always absolute so it overlays content when expanded
        'absolute inset-y-0 left-0 z-50': is_desktop,
        // Height/width transitions smoothly
        'w-72 shadow-2xl shadow-gray-300/50 rounded-r-3xl':
          is_desktop && show_expanded,
        'w-22 shadow-none': is_desktop && !show_expanded,
      }"
    >
      <!-- Header -->
      <div
        class="flex items-center gap-2 border-b-[0.5px] border-line transition-all duration-300"
        :class="
          show_expanded
            ? 'p-4 h-18'
            : 'p-1 flex flex-col justify-between gap-3 py-4'
        "
      >
        <div
          class="flex items-center justify-center transition-all duration-300"
          :class="show_expanded ? 'h-10' : 'h-10 w-full'"
        >
          <!-- Expanded: wide wordmark -->
          <LogoAnimation
            v-if="show_expanded"
            class="h-full text-primary dark:text-base-text transition-all duration-300"
          />
          <!-- Collapsed: icon only -->
          <LogoAnimation
            v-else
            :show_text="false"
            class="h-10 text-primary"
          />
        </div>

        <!-- Toggle buttons -->
        <button
          v-if="show_expanded"
          @click="$emit('toggle')"
          class="grid place-items-center p-0 size-8 variant-ghost ml-auto rounded-full hover:bg-surface-hover"
        >
          <i class="*:size-6 text-grey-500" v-html="all_icons.nav"></i>
        </button>
        <button
          v-else
          @click="$emit('toggle')"
          class="grid place-items-center p-0 size-12 variant-ghost mx-auto mt-2 rounded-full hover:bg-surface-hover"
        >
          <i class="*:size-6 text-grey-500" v-html="all_icons.nav"></i>
        </button>
      </div>

      <!-- Navigation -->
      <div
        ref="navScrollRef"
        class="flex-1 overflow-y-auto"
        :class="show_expanded ? 'px-2' : 'px-0 flex flex-col items-center'"
      >
        <div
          class="flex flex-col gap-4 mt-2"
          :class="show_expanded ? '' : 'items-center'"
        >
          <div
            v-for="(group, gIdx) in dynamicNavRegistry"
            :key="gIdx"
            class="flex flex-col gap-3"
          >
            <p
              v-if="show_expanded"
              class="text-[10px] text-grey-500 uppercase tracking-widest mb-1 px-3"
            >
              {{ group.name }}
            </p>
            <div
              :class="
                show_expanded
                  ? 'flex flex-col gap-2'
                  : 'inline-flex flex-col gap-2'
              "
            >
              <NavButton
                v-for="(nav, index) in group.items"
                :key="index"
                :nav="nav"
                :type="show_expanded ? 'opened' : 'closed'"
                @nav_item_click="close_nav"
              />
            </div>
          </div>
          <slot name="nav"></slot>
        </div>
      </div>

      <!-- Profile / logout -->
      <div class="shrink-0 border-t border-line p-3">
        <button
          class="w-full flex items-center gap-3 rounded-2xl p-2 hover:bg-surface-hover transition-colors"
          :class="show_expanded ? '' : 'justify-center'"
          @click="handleLogout"
        >
          <div
            class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 select-none"
          >
            {{ userInitials }}
          </div>
          <div
            v-if="show_expanded"
            class="flex flex-col items-start leading-tight min-w-0 flex-1"
          >
            <span class="text-sm font-semibold text-base-text truncate">{{
              userName
            }}</span>
            <span v-if="userRole" class="text-[10px] text-faint-text truncate">{{
              userRole
            }}</span>
          </div>
          <svg
            v-if="show_expanded"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-faint-text shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
