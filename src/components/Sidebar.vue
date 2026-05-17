<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import NavButton from "@/components/NavButton.vue";
import { getNavigationRegistry } from "@/router/navigation";
import { useAuthStore } from "@/store/authStore";

const all_icons = { ...icons, ...raaz_icons };
const authStore = useAuthStore();

const dynamicNavRegistry = computed(() =>
  getNavigationRegistry(authStore.is_shipper),
);

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
          <img
            src="@/assets/rlogo.png"
            class="transition-all duration-300 object-contain"
            :class="is_open ? 'h-full w-40' : 'h-8 w-8'"
            alt="TMS Logo"
            style="filter: brightness(0)"
          />
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
        class="h-full overflow-y-auto"
        :class="is_open ? 'px-2 pb-4' : 'px-0 pb-4 flex flex-col items-center'"
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
