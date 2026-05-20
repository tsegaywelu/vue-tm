<template>
  <ModalWrapper
    @close="closeModal()"
    wrapperClass="flex items-center justify-center p-4"
  >
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden relative pointer-events-auto"
      @click.stop
    >
      <!-- Header -->
      <div
        class="flex justify-between items-center border-b border-gray-100 px-6 py-4"
      >
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-semibold text-gray-900">Document Viewer</h2>
          <span v-if="totalFiles > 1" class="text-sm text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {{ currentIndex + 1 }} / {{ totalFiles }}
          </span>
        </div>
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
      <div
        v-if="isPDF || isImage"
        class="flex justify-center items-center gap-3 py-3 border-b border-gray-100 bg-gray-50/50"
      >
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
      <div class="flex-1 overflow-hidden bg-gray-100 flex justify-center items-center p-4 relative">
        <!-- Prev button -->
        <button
          v-if="totalFiles > 1"
          @click="prev"
          :disabled="currentIndex === 0"
          class="absolute left-4 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Next button -->
        <button
          v-if="totalFiles > 1"
          @click="next"
          :disabled="currentIndex === totalFiles - 1"
          class="absolute right-4 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- PDF -->
        <div v-if="isPDF" class="w-full h-full flex justify-center items-center overflow-auto rounded-xl">
          <div v-if="isPDFLoading" class="flex flex-col items-center gap-3 text-gray-500">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <span class="text-sm">Loading PDF…</span>
          </div>
          <div v-else-if="pdfBlobURL" class="w-full h-full">
            <iframe
              :src="`${pdfBlobURL}#toolbar=0`"
              class="transition-transform duration-200 ease-in-out origin-center w-full h-full border-0 bg-white"
              :style="{ transform: `scale(${zoom}) rotate(${rotation}deg)` }"
            ></iframe>
          </div>
          <div v-else class="text-center text-red-500 text-sm">Failed to load PDF.</div>
        </div>

        <!-- Image -->
        <div v-else-if="isImage" class="w-full h-full flex justify-center items-center overflow-auto relative">
          <img
            :src="activeFileURL"
            :key="activeFileURL"
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
          <a :href="activeFileURL" target="_blank" class="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
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
import { ref, computed, watch, onUnmounted } from "vue";
import { closeModal } from "@customizer/modal-x";
import ModalWrapper from "./ModalWrapper.vue";

export type Props = {
  fileURL?: string;
  filePath?: string;
  files?: string[];
};

const props = defineProps<{ data: Props; close: (res: any) => void }>();

// Normalise: use files[] array if provided, else wrap single fileURL
const allFiles = computed<string[]>(() => {
  if (props.data.files?.length) return props.data.files;
  return props.data.fileURL ? [props.data.fileURL] : [];
});

const totalFiles = computed(() => allFiles.value.length);
const currentIndex = ref(0);

// Reset index when files change
watch(allFiles, () => { currentIndex.value = 0; });

const activeFileURL = computed(() => allFiles.value[currentIndex.value] ?? "");
const activeFilePath = computed(() => props.data.filePath ?? "");

function hasExt(ext: string) {
  return (
    activeFileURL.value?.toLowerCase().includes(ext) ||
    activeFilePath.value?.toLowerCase().includes(ext)
  );
}

const zoom = ref(1);
const rotation = ref(0);

const isPDF = computed(() => hasExt(".pdf"));

const pdfBlobURL = ref("");
const isPDFLoading = ref(false);

async function loadPDFBlob(url: string) {
  if (pdfBlobURL.value) {
    URL.revokeObjectURL(pdfBlobURL.value);
    pdfBlobURL.value = "";
  }
  if (!url) return;
  isPDFLoading.value = true;
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    pdfBlobURL.value = URL.createObjectURL(blob);
  } catch {
    pdfBlobURL.value = "";
  } finally {
    isPDFLoading.value = false;
  }
}

watch(
  [activeFileURL, isPDF],
  ([url, pdf]) => { if (pdf) loadPDFBlob(url); },
  { immediate: true },
);

onUnmounted(() => {
  if (pdfBlobURL.value) URL.revokeObjectURL(pdfBlobURL.value);
});
const isImage = computed(() =>
  [".jpg", ".jpeg", ".png", ".gif", ".webp"].some(hasExt),
);

const prev = () => { if (currentIndex.value > 0) { currentIndex.value--; reset(); } };
const next = () => { if (currentIndex.value < totalFiles.value - 1) { currentIndex.value++; reset(); } };

const zoomIn = () => { zoom.value += 0.25; };
const zoomOut = () => { if (zoom.value > 0.25) zoom.value -= 0.25; };
const rotate = () => { rotation.value = (rotation.value + 90) % 360; };
const reset = () => { zoom.value = 1; rotation.value = 0; };
</script>
