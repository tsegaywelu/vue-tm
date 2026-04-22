<template>
  <div class="relative inline-block text-left" ref="containerRef" @click.stop>
    <!-- Trigger -->
    <button
      type="button"
      class="rounded-lg cursor-pointer border grid place-items-center size-8 border-gray-200 hover:bg-gray-50 transition-colors"
      @click.stop="toggle"
    >
      <i class="*:size-full size-4.5" v-html="icons.v_elipssis"></i>
    </button>

    <!-- Content (portal to body) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          ref="contentRef"
          class="fixed z-[9999] rounded-xl border border-gray-100 bg-white shadow-2xl ring-1 ring-black/5 min-w-48 p-1"
          :style="floatingStyle"
          @click.stop
        >
          <slot :close="close" />
        </div>
      </Transition>
    </Teleport>

    <!-- Backdrop (invisible, closes dropdown) -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9998]"
        @click.stop="close"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount } from "vue";
import { icons } from "@/utils/icons";

const isOpen = ref(false);
const containerRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();
const floatingStyle = ref<Record<string, string>>({});

const updatePosition = async () => {
  await nextTick();
  if (!containerRef.value || !contentRef.value) return;

  const triggerRect = containerRef.value.getBoundingClientRect();
  const contentRect = contentRef.value.getBoundingClientRect();
  const margin = 8;

  // Vertical: prefer below, flip above if not enough space
  const spaceBelow = window.innerHeight - triggerRect.bottom - margin;
  const spaceAbove = triggerRect.top - margin;
  let top: number;
  if (spaceBelow >= contentRect.height || spaceBelow >= spaceAbove) {
    top = triggerRect.bottom + 4;
  } else {
    top = triggerRect.top - contentRect.height - 4;
  }

  // Horizontal: align right edge with trigger right edge
  let left = triggerRect.right - contentRect.width;
  if (left < margin) left = margin;
  if (left + contentRect.width > window.innerWidth - margin) {
    left = window.innerWidth - contentRect.width - margin;
  }

  floatingStyle.value = {
    top: `${top}px`,
    left: `${left}px`,
  };
};

const toggle = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    updatePosition();
  }
};

const close = () => {
  isOpen.value = false;
};

onBeforeUnmount(() => {
  isOpen.value = false;
});

defineExpose({ close });
</script>
