<template>
  <i class="inline-svg-icon flex items-center justify-center shrink-0" v-html="svgContent"></i>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  }
});

const svgContent = ref('');

// Import all SVGs as raw text, eager load them
const svgModules = import.meta.glob('@/assets/**/*.svg', { query: '?raw', eager: true, import: 'default' });

watchEffect(() => {
  if (!props.src) return;
  
  // Clean up the src to match the keys in svgModules
  // props.src might be like "@/assets/icons/xxx.svg" or "ix_operate-plant.svg"
  let key = props.src;
  if (!key.startsWith('/src') && !key.startsWith('@/')) {
    key = `/src/assets/icons/${key}`;
  }
  if (key.startsWith('@/')) {
    key = key.replace('@/', '/src/');
  }

  if (svgModules[key]) {
    svgContent.value = svgModules[key];
  } else {
    // Attempt relative to icons folder
    const fallbackKey = `/src/assets/icons/${props.src.split('/').pop()}`;
    if (svgModules[fallbackKey]) {
      svgContent.value = svgModules[fallbackKey];
    } else {
      console.warn(`InlineSvg: Icon not found for key ${key} and ${fallbackKey}`);
    }
  }
});
</script>

<style>
.inline-svg-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}
.inline-svg-icon svg path, .inline-svg-icon svg circle, .inline-svg-icon svg rect {
  fill: currentColor !important;
}
/* If the original stroke was active instead of fill */
.inline-svg-icon svg[stroke] path {
  stroke: currentColor !important;
}
</style>
