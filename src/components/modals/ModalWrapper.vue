<template>
  <div
    class="__modal-wrapper fixed inset-0 z-100 overflow-y-auto bg-black/40 backdrop-blur-[2px]"
    :class="wrapperClass"
    @click="onBackdropClick"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps({
  /** Additional classes to merge onto the wrapper */
  wrapperClass: { type: String, default: "" },
});

const emit = defineEmits(["close"]);

function onBackdropClick(ev: MouseEvent) {
  if ((ev.target as HTMLElement).classList.contains("__modal-wrapper")) {
    emit("close");
  }
}
</script>
