<template>
  <div class="select-none text-base gap-2 flex items-center">
    <span class="hidden md:inline">Rows per page</span>
    <div
      class="bg-gray-50 rounded-full cursor-pointer relative min-w-12 text-center"
      @click.stop
      v-click-outside="() => (is_open = false)"
    >
      <span
        tabindex="0"
        @click="is_open = !is_open"
        :class="[
          'px-2 flex items-center rounded-full gap-1 text-sm justify-center h-8 transition-shadow',
          is_open
            ? 'input-focus bg-gray-100 outline outline-1 outline-gray-200 shadow-sm'
            : '',
        ]"
      >
        {{ page_size }}
        <div
          class="text-[10px] font-bold -rotate-90 transition-transform *:size-3 flex items-center justify-center"
          v-html="icons.leftAngle"
        ></div>
      </span>

      <transition name="dropdown">
        <div
          v-if="is_open"
          class="flex flex-col gap-1 isolate absolute bottom-[120%] p-1 left-1/2 -translate-x-1/2 bg-[#F9F9F9] shadow-sm rounded-xl z-[999] border border-gray-100"
        >
          <button
            v-for="el in options"
            :key="el"
            @click="setPageSize(el)"
            class="text-xs hover:bg-white rounded-full w-8 h-8 font-bold flex items-center justify-center transition-colors"
          >
            {{ el }}
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { icons } from "@/utils/icons.js";

const props = defineProps({
  page_size: { type: Number, required: true },
});

const emit = defineEmits(["update:page_size"]);
const is_open = ref(false);
const options = [10, 25, 50, 100];

const setPageSize = (val: number) => {
  emit("update:page_size", val);
  is_open.value = false;
};

const closeMenu = () => {
  is_open.value = false;
};
onMounted(() => {
  document.addEventListener("click", closeMenu);
});
onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.1s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>
