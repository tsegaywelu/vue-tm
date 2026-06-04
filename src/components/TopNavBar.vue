<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, useSlots } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/authStore";
import { icons } from "@/utils/icons";
import { openModal } from "@customizer/modal-x";
import { useIsMobile } from "@/composables/useIsMobile";
import BottomSheet from "@/components/BottomSheet.vue";

const { isMobile } = useIsMobile();

const emit = defineEmits<{ (e: "toggle_nav"): void }>();
const slots = useSlots();
const router = useRouter();
const authStore = useAuthStore();

const canGoBack = computed(() => !!window.history.state?.back);

const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const user = computed(
  () => authStore.current_user?.user ?? authStore.current_user ?? {},
);

const userName = computed(() => {
  const first = user.value?.firstName || "";
  const last = user.value?.lastName || "";
  return (
    [first, last].filter(Boolean).join(" ") ||
    user.value?.name ||
    user.value?.username ||
    "User"
  );
});

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

function handleChangePassword() {
  dropdownOpen.value = false;
  setTimeout(() => openModal("ChangePasswordModal", {}), 250);
}

async function handleLogout() {
  dropdownOpen.value = false;
  const confirmed = await openModal("ConfirmationModal", {
    title: "Logout",
    message: "Are you sure you want to logout?",
    confirmText: "Logout",
    action: "logout",
  });
  if (confirmed) authStore.logout();
}

function handleClickOutside(e: MouseEvent) {
  if (isMobile.value) return;
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onUnmounted(() =>
  document.removeEventListener("mousedown", handleClickOutside),
);
</script>

<template>
  <header
    class="flex items-center justify-between bg-white xl:rounded-4xl p-2 xl:px-4 min-h-16 xl:min-h-17 shadow-xs"
  >
    <div class="flex items-center gap-3">
      <!-- Mobile Toggle -->
      <button
        @click="$emit('toggle_nav')"
        class="xl:hidden grid place-items-center p-0 size-8"
      >
        <i class="*:size-6 text-grey-600" v-html="icons.nav"></i>
      </button>

      <!-- Back Button -->
      <button
        v-if="canGoBack"
        @click="router.back()"
        class="flex items-center gap-2 p-2 rounded-full hover:bg-grey-50 transition-colors shrink-0"
        title="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 text-grey-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        <span class="hidden sm:inline"> Go Back </span>
      </button>

      <!-- Mobile Title (Hidden on XL) -->
      <span
        v-if="!slots.title"
        class="font-bold text-xl text-primary tracking-tight xl:hidden"
      >
        ChiNet
      </span>

      <!-- Page Title Slot -->
      <div class="text-grey-900 font-bold text-lg xl:text-xl">
        <slot name="title"></slot>
      </div>
    </div>

    <!-- Actions + Profile -->
    <div class="flex items-center gap-3">
      <slot name="actions"></slot>

      <!-- Profile dropdown -->
      <div ref="dropdownRef" class="relative">
        <button
          class="flex items-center gap-2 rounded-xl p-1 hover:bg-gray-100 transition-colors"
          @click="dropdownOpen = !dropdownOpen"
        >
          <div
            class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0 select-none"
          >
            {{ userInitials }}
          </div>
          <div class="hidden xl:flex flex-col items-start leading-tight">
            <span
              class="text-sm font-semibold text-gray-800 max-w-30 truncate"
              >{{ userName }}</span
            >
            <span
              v-if="userRole"
              class="text-[10px] text-gray-400 max-w-30 truncate"
              >{{ userRole }}</span
            >
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="hidden xl:block w-3.5 h-3.5 text-gray-400 transition-transform duration-200"
            :class="dropdownOpen ? 'rotate-180' : ''"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>

        <!-- Desktop dropdown -->
        <Transition
          enter-active-class="transition-all duration-150 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-1"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-100 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-1"
        >
          <div
            v-if="dropdownOpen && !isMobile"
            class="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50 origin-top-right"
          >
            <div class="px-4 py-3 border-b border-gray-100">
              <p class="text-sm font-semibold text-gray-800 truncate">
                {{ userName }}
              </p>
              <p v-if="userRole" class="text-xs text-gray-400 truncate">
                {{ userRole }}
              </p>
            </div>
            <div class="py-1">
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                @click.stop="handleChangePassword"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                Change Password
              </button>
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                @click="handleLogout"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4"
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
                Logout
              </button>
            </div>
          </div>
        </Transition>

        <!-- Mobile: bottom sheet -->
        <BottomSheet v-if="isMobile" v-model="dropdownOpen" title="Account">
          <div class="px-4 py-2">
            <div class="py-3 mb-1 border-b border-gray-100">
              <p class="text-sm font-semibold text-gray-800 truncate">
                {{ userName }}
              </p>
              <p v-if="userRole" class="text-xs text-gray-400 truncate">
                {{ userRole }}
              </p>
            </div>
            <button
              class="w-full flex items-center gap-3 py-3 text-sm text-gray-700"
              @click="handleChangePassword"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              Change Password
            </button>
            <button
              class="w-full flex items-center gap-3 py-3 text-sm text-red-600"
              @click="handleLogout"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5"
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
              Logout
            </button>
          </div>
        </BottomSheet>
      </div>
    </div>
  </header>
</template>
