<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import NavButton from "@/components/NavButton.vue";
import {
  getNavigationRegistry,
  filterNavsByPermission,
} from "@/router/navigation";
import { useAuthStore } from "@/store/authStore";
import { openModal } from "@customizer/modal-x";

const all_icons = { ...icons, ...raaz_icons };
const authStore = useAuthStore();

const dynamicNavRegistry = computed(() => {
  const registry = getNavigationRegistry(authStore.is_shipper);
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
const is_hovered = ref(false);

// Desktop: hover-driven. Mobile: is_open prop-driven.
const show_expanded = computed(
  () => props.is_open || (is_desktop.value && is_hovered.value),
);

const update_media = () => {
  is_desktop.value = window.innerWidth > 1280;
  if (!is_desktop.value) is_hovered.value = false;
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
        : 'fixed inset-0 z-20 backdrop-blur-xs xl:bg-transparent transition-all duration-150 flex'
    "
    :style="!is_desktop ? { transform: is_open ? 'translateX(0)' : 'translateX(-100%)' } : {}"
    @click="!is_desktop && $emit('close')"
  >
    <!-- Panel -->
    <div
      @click.stop
      class="h-full flex flex-col gap-5 bg-white overflow-hidden"
      :class="{
        // Mobile
        'w-full max-w-70 shadow-lg': !is_desktop,
        // Desktop: always absolute so it overlays content when expanded
        'absolute inset-y-0 left-0 z-50': is_desktop,
        // Width + shadow animate; transition only runs on xl (disabled on small screens)
        'xl:transition-[width,box-shadow] xl:duration-300 xl:ease-in-out': is_desktop,
        'w-72 shadow-2xl shadow-gray-300/50 rounded-r-3xl': is_desktop && show_expanded,
        'w-22 shadow-none': is_desktop && !show_expanded,
      }"
      @mouseenter="is_desktop && (is_hovered = true)"
      @mouseleave="is_desktop && (is_hovered = false)"
    >
      <!-- Header -->
      <div
        class="flex items-center gap-2 border-b-[0.5px] border-grey-100 transition-all duration-300"
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
          <img
            v-if="show_expanded"
            src="@/assets/rlogo.png"
            class="h-full w-40 object-contain"
            alt="TMS Logo"
            style="filter: brightness(0)"
          />
          <div v-else class="p-1 bg-primary/10 rounded-lg">
            <i
              class="*:h-10 *:w-10 block text-primary"
              v-html="all_icons['raaz-logo']"
            ></i>
          </div>
        </div>

        <!-- Toggle buttons — mobile only (desktop uses hover) -->
        <button
          v-if="show_expanded"
          @click="$emit('toggle')"
          class="xl:hidden grid place-items-center p-0 size-8 variant-ghost ml-auto rounded-full hover:bg-grey-50"
        >
          <i class="*:size-6 text-grey-500" v-html="all_icons.nav"></i>
        </button>
        <button
          v-else
          @click="$emit('toggle')"
          class="xl:hidden grid place-items-center p-0 size-12 variant-ghost mx-auto mt-2 rounded-full hover:bg-grey-50"
        >
          <i class="*:size-6 text-grey-500" v-html="all_icons.nav"></i>
        </button>
      </div>

      <!-- Navigation -->
      <div
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
      <div class="shrink-0 border-t border-grey-100 p-3">
        <button
          class="w-full flex items-center gap-3 rounded-2xl p-2 hover:bg-grey-50 transition-colors"
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
            <span class="text-sm font-semibold text-gray-800 truncate">{{
              userName
            }}</span>
            <span v-if="userRole" class="text-[10px] text-gray-400 truncate">{{
              userRole
            }}</span>
          </div>
          <svg
            v-if="show_expanded"
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-gray-400 shrink-0"
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
