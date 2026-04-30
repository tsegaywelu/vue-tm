<template>
  <ModalWrapper @close="closeModal()" wrapperClass="flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden relative pointer-events-auto" @click.stop>
      <!-- Header -->
      <div class="flex justify-between items-center border-b border-gray-100 px-6 py-4">
        <h2 class="text-xl font-semibold text-gray-900">Document Viewer</h2>
        <button
          @click="closeModal()"
          class="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Toolbar -->
      <div v-if="isPDF || isImage" class="flex justify-center items-center gap-3 py-3 border-b border-gray-100 bg-gray-50/50">
        <button @click="zoomIn" class="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors text-gray-700 shadow-sm flex items-center gap-1.5">
          <span class="text-lg">+</span> Zoom In
        </button>
        <button @click="zoomOut" class="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors text-gray-700 shadow-sm flex items-center gap-1.5">
          <span class="text-lg">-</span> Zoom Out
        </button>
        <button @click="rotate" class="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors text-gray-700 shadow-sm flex items-center gap-1.5">
          <span>↻</span> Rotate
        </button>
        <button @click="reset" class="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors text-gray-700 shadow-sm flex items-center gap-1.5">
          <span>↺</span> Reset
        </button>
      </div>

      <!-- Viewer Content -->
      <div class="flex-1 overflow-hidden bg-gray-100 flex justify-center items-center p-4">
        <!-- PDF -->
        <div v-if="isPDF" class="w-full h-full flex justify-center items-center overflow-auto rounded-xl">
          <iframe
            :src="`${fileURL}#toolbar=0`"
            class="transition-transform duration-200 ease-in-out origin-center w-full h-full border-0 bg-white"
            :style="{ transform: `scale(${zoom}) rotate(${rotation}deg)` }"
          ></iframe>
        </div>

        <!-- Image -->
        <div v-else-if="isImage" class="w-full h-full flex justify-center items-center overflow-auto relative">
          <img
            :src="fileURL"
            alt="Document Preview"
            class="object-contain transition-transform duration-200 ease-in-out max-h-full max-w-full shadow-sm"
            :style="{ transform: `scale(${zoom}) rotate(${rotation}deg)` }"
          />
        </div>

        <!-- Unsupported -->
        <div v-else class="text-center p-8 bg-white rounded-2xl shadow-sm">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p class="text-gray-900 font-medium text-lg mb-2">File preview not available</p>
          <p class="text-gray-500 mb-6">This file type cannot be previewed directly in the browser.</p>
          <a :href="fileURL" target="_blank" class="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download File
          </a>
        </div>
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { closeModal } from '@customizer/modal-x';
import ModalWrapper from './ModalWrapper.vue';

export type Props = {
  fileURL: string;
};

const props = defineProps<{ data: Props; close: (res: any) => void }>();

const fileURL = computed(() => props.data.fileURL);

const zoom = ref(1);
const rotation = ref(0);

const isPDF = computed(() => {
  return fileURL.value?.toLowerCase().includes('.pdf');
});

const isImage = computed(() => {
  const url = fileURL.value?.toLowerCase() || '';
  return url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.gif') || url.includes('.webp');
});

const zoomIn = () => { zoom.value += 0.25; };
const zoomOut = () => { if (zoom.value > 0.25) zoom.value -= 0.25; };
const rotate = () => { rotation.value = (rotation.value + 90) % 360; };
const reset = () => { zoom.value = 1; rotation.value = 0; };
</script>
