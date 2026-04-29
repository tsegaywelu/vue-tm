<template>
  <div class="flex flex-col gap-3 p-4 bg-[#f6f7f9] rounded-xl border border-gray-100">
    <span class="font-bold text-gray-900 text-sm break-words truncate" :title="title">{{ title }}</span>
    
    <div v-if="filePath" class="flex flex-col gap-2 mt-auto">
      <div class="flex items-center gap-2">
        <Button size="sm" variant="outline" class_name="flex-1" @click="$emit('view', filePath)">View</Button>
        <DownloadButton size="sm" variant="primary" class_name="flex-1" :url="fullUrl" :filename="filename" />
      </div>
      <div class="flex items-center gap-2">
        <Button size="sm" variant="secondary" class_name="flex-1" @click="$emit('change', filePath)">Change</Button>
        <Button v-if="canReject" size="sm" variant="destructive" class_name="flex-1" @click="$emit('reject', filePath)">Reject</Button>
      </div>
    </div>
    
    <div v-else class="flex items-center gap-2 mt-auto">
      <Button size="sm" variant="outline" class_name="flex-1" disabled>View</Button>
      <Button size="sm" variant="primary" class_name="flex-1" disabled>Download</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Button from '@/components/common/Button.vue';
import DownloadButton from '@/components/common/DownloadButton.vue';

const props = defineProps<{
  title: string;
  filePath?: string;
  fullUrl: string;
  canReject?: boolean;
}>();

defineEmits(['view', 'change', 'reject']);

const filename = computed(() => {
  if (!props.filePath) return 'download';
  return props.filePath.split('/').pop()?.split('\\').pop() || 'download';
});
</script>
