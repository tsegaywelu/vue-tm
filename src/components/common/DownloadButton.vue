<template>
  <Button
    :type="'button'"
    @click="handleDownload"
    :disabled="isDownloading || disabled"
    :size="size"
    :variant="variant"
    :class="[
      'relative overflow-hidden font-medium shrink-0 transition-colors flex items-center justify-center',
      isDownloading ? 'opacity-70 cursor-wait' : '',
      class_name,
    ]"
  >
    <!-- Progress bar background -->
    <div
      v-if="isDownloading"
      class="absolute inset-0 bg-black/10 transition-all duration-200 ease-linear z-0"
      :style="{ width: `${progress}%` }"
    ></div>

    <span class="relative z-10 flex items-center gap-1.5">
      <template v-if="isDownloading">
        <i v-html="icons.spinner" class="size-4 animate-spin text-current"></i>
        {{ progress }}%
      </template>
      <template v-else>
        <slot>{{ label }}</slot>
      </template>
    </span>
  </Button>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { downloadFromUrl } from "@/utils/utils";
import { icons } from "@/utils/icons";
import Button, {
  type ButtonSize,
  type ButtonVariant,
} from "@/components/common/Button.vue";

const props = withDefaults(
  defineProps<{
    url: string;
    filename?: string;
    label?: string;
    class_name?: string;
    size?: ButtonSize;
    variant?: ButtonVariant;
    disabled?: boolean;
  }>(),
  {
    label: "Download",
    filename: "download",
    class_name: "",
    size: "default",
    variant: "default",
    disabled: false,
  },
);

const progress = ref<number | null>(null);
const isDownloading = ref(false);
const lastStepRef = ref(0);

const handleDownload = async () => {
  if (isDownloading.value) return;

  isDownloading.value = true;
  lastStepRef.value = 0;
  progress.value = 0;

  await downloadFromUrl(props.url, props.filename, (loaded, total) => {
    if (total > 0) {
      const pct = Math.round((loaded * 100) / total);
      const step = Math.floor(pct / 10) * 10;
      if (step > lastStepRef.value || pct === 100) {
        lastStepRef.value = step;
        progress.value = step === 100 ? 100 : step;
      }
    }
  });

  isDownloading.value = false;
  progress.value = null;
};
</script>
