<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import NavButton from "@/components/NavButton.vue";
import { getNavigationRegistry, filterNavsByPermission } from "@/router/navigation";
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

const update_media = () => {
  is_desktop.value = window.innerWidth > 1280;
};

onMounted(() => {
  window.addEventListener("resize", update_media);
});

onUnmounted(() => {
  window.removeEventListener("resize", update_media);
});

const user = computed(
  () => authStore.current_user?.user ?? authStore.current_user ?? {},
);

const userInitials = computed(() => {
  const f = user.value?.firstName?.[0] ?? "";
  const l = user.value?.lastName?.[0] ?? "";
  return (f + l).toUpperCase() || "U";
});

const userName = computed(
  () =>
    [user.value?.firstName, user.value?.lastName].filter(Boolean).join(" ") ||
    "User",
);

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
  if (!is_desktop.value) {
    emit("close");
  } else if (!props.is_open) {
    emit("toggle");
  }
};
</script>

<template>
  <div
    @click="$emit('close')"
    class="transition-all duration-150 fixed inset-0 z-20 top-0 left-0 xl:relative xl:rounded-4xl flex-1 backdrop-blur-xs xl:bg-white h-full overflow-hidden"
    :class="[
      is_open ? 'translate-x-0' : '-translate-x-full',
      'xl:translate-x-0!',
    ]"
  >
    <div
      @click.stop
      class="w-full xl:w-full h-full flex flex-col gap-5 bg-white shadow-grey-200/50"
    >
      <!-- Sidebar Header -->
      <div
        class="flex items-center gap-2 border-b-[0.5px] border-grey-100 transition-all duration-300"
        :class="
          is_open ? 'p-4 h-18' : 'p-1 flex flex-col justify-between gap-3 py-4'
        "
      >
        <div
          class="flex items-center justify-center transition-all duration-300"
          :class="is_open ? 'h-10' : 'h-10 w-full'"
        >
          <!-- Expanded: wide wordmark -->
          <img
            v-if="is_open"
            src="@/assets/rlogo.png"
            class="h-full w-40 object-contain transition-all duration-300"
            alt="TMS Logo"
            style="filter: brightness(0)"
          />
          <!-- Collapsed: same icon as login page -->
          <div v-else class="p-1 bg-primary/10 rounded-lg">
            <i
              class="*:h-10 *:w-10 block text-primary"
              v-html="all_icons['raaz-logo']"
            ></i>
          </div>
        </div>

        <button
          v-if="is_open"
          @click="$emit('toggle')"
          class="grid place-items-center p-0 size-8 variant-ghost ml-auto rounded-full hover:bg-grey-50"
        >
          <i class="*:size-6 text-grey-500" v-html="all_icons.nav"></i>
        </button>
        <button
          v-else
          @click="$emit('toggle')"
          class="grid place-items-center p-0 size-12 variant-ghost mx-auto mt-2 rounded-full hover:bg-grey-50"
        >
          <i class="*:size-6 text-grey-500" v-html="all_icons.nav"></i>
        </button>
      </div>

      <!-- Navigation Area -->
      <div
        class="flex-1 overflow-y-auto"
        :class="is_open ? 'px-2' : 'px-0 flex flex-col items-center'"
      >
        <div
          class="flex flex-col gap-4 mt-2"
          :class="is_open ? '' : 'items-center'"
        >
          <div
            v-for="(group, gIdx) in dynamicNavRegistry"
            :key="gIdx"
            class="flex flex-col gap-3"
          >
            <p
              v-if="is_open"
              class="text-[10px] text-grey-500 uppercase tracking-widest mb-1 px-3"
            >
              {{ group.name }}
            </p>

            <div
              :class="
                is_open ? 'flex flex-col gap-2' : 'inline-flex flex-col gap-2'
              "
            >
              <NavButton
                v-for="(nav, index) in group.items"
                :key="index"
                :nav="nav"
                :type="is_open ? 'opened' : 'closed'"
                @nav_item_click="close_nav"
              />
            </div>
          </div>
          <slot name="nav"></slot>
        </div>
      </div>

      <!-- Sticky profile -->
      <div class="shrink-0 border-t border-grey-100 p-3">
        <button
          class="w-full flex items-center gap-3 rounded-2xl p-2 hover:bg-grey-50 transition-colors"
          :class="is_open ? '' : 'justify-center'"
          @click="handleLogout"
        >
          <div
            class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 select-none"
          >
            {{ userInitials }}
          </div>
          <div
            v-if="is_open"
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
            v-if="is_open"
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
