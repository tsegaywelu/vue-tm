<template>
  <div
    class="relative flex flex-col gap-3 p-4 bg-surface-muted rounded-xl border border-gray-100 overflow-hidden min-h-[120px]"
  >
    <span
      class="font-bold truncate text-gray-900 text-sm wrap-break-words pr-24"
      :title="title"
      >{{ title }}</span
    >

    <div
      v-if="filePath && !readOnly"
      class="absolute top-2 right-2 flex items-center gap-1 bg-surface/60 backdrop-blur-sm rounded-lg p-1 border border-gray-200/50 shadow-sm z-10"
    >
      <button
        class="relative flex items-center justify-center h-8 min-w-[32px] px-2 rounded-md hover:bg-surface text-gray-600 transition-colors shadow-sm"
        :disabled="isUploading"
        @click="fileInput?.click()"
        title="Change File"
      >
        <div
          ref="progressBarRef"
          v-show="isUploading"
          class="absolute inset-0 bg-blue-100 rounded-md z-0"
          style="width: 0%"
        ></div>
        <span
          class="relative z-10 flex items-center justify-center gap-1 font-medium text-xs"
        >
          <template v-if="isUploading">
            <i
              class="size-3 animate-spin text-blue-600 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </i>
            <span ref="progressTextRef" class="text-blue-700">0%</span>
          </template>
          <template v-else>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </template>
        </span>
      </button>

      <button
        v-if="canReject"
        @click="handleReject"
        :disabled="isRejecting || isUploading || isRemoving"
        class="flex items-center justify-center size-8 rounded-md hover:bg-red-50 text-red-500 transition-colors shadow-sm"
        title="Reject Document"
      >
        <i
          v-if="isRejecting"
          class="size-3.5 animate-spin text-red-500 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </i>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m4.9 4.9 14.2 14.2" />
        </svg>
      </button>

      <!-- Remove -->
      <button
        v-if="!hideDelete"
        @click="handleRemove"
        :disabled="isRemoving || isUploading || isRejecting"
        class="flex items-center justify-center size-8 rounded-md hover:bg-surface text-gray-500 hover:text-red-600 transition-colors shadow-sm"
        title="Remove Document"
      >
        <i
          v-if="isRemoving"
          class="size-3.5 animate-spin text-red-600 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </i>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="flex flex-col gap-2 mt-auto">
      <input
        type="file"
        ref="fileInput"
        class="hidden"
        :multiple="allowMultiple"
        @change="onFileChange"
      />

      <!-- Existing Document Buttons -->
      <div v-if="filePath" class="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          class_name="flex-1"
          @click="viewDocument"
          >View</Button
        >
        <DownloadButton
          size="sm"
          variant="primary"
          class_name="flex-1"
          :url="fullUrl || ''"
          :filename="filename"
        />
      </div>

      <div v-else-if="!readOnly" class="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          class_name="flex-1 relative overflow-hidden h-10 border-dashed border-2 border-gray-300 hover:border-gray-400 bg-surface"
          :disabled="isUploading"
          @click="fileInput?.click()"
        >
          <div
            ref="progressBarRefEmpty"
            v-show="isUploading"
            class="absolute inset-0 bg-blue-100 transition-all duration-200 ease-linear z-0"
            style="width: 0%"
          ></div>
          <span
            class="relative z-10 flex items-center gap-1.5 justify-center w-full text-gray-600 font-medium"
          >
            <template v-if="isUploading">
              <i
                class="size-4 animate-spin text-blue-600 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </i>
              <span ref="progressTextRefEmpty" class="text-blue-700">0%</span>
            </template>
            <template v-else>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
              Upload Document
            </template>
          </span>
        </Button>
      </div>

      <div v-else class="flex items-center justify-center py-2 px-1">
        <span class="text-xs italic text-gray-400 font-medium select-none"
          >No document uploaded</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "@/components/common/Button.vue";
import DownloadButton from "@/components/common/DownloadButton.vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import { openModal } from "@customizer/modal-x";
import {
  reject_document,
  remove_document,
} from "@/modules/operation/api/shipment.api";

const props = defineProps<{
  title: string;
  shipmentId?: string;
  documentType: string;
  index?: number;
  filePath?: string;
  fullUrl?: string;
  canReject?: boolean;
  allowMultiple?: boolean;
  readOnly?: boolean;
  hideDelete?: boolean;
  uploadFunction?: (id: string, data: FormData, config: any) => Promise<any>;
}>();

const queryClient = useQueryClient();
const toast = useToastStore();

const fileInput = ref<HTMLInputElement | null>(null);
const progressBarRef = ref<HTMLElement | null>(null);
const progressTextRef = ref<HTMLElement | null>(null);
const progressBarRefEmpty = ref<HTMLElement | null>(null);
const progressTextRefEmpty = ref<HTMLElement | null>(null);

const viewDocument = () => {
  if (!props.fullUrl) return;
  openModal("FileViewerModal", { fileURL: props.fullUrl, filePath: props.filePath });
};

const { mutateAsync: rejectMutate, isPending: isRejecting } = useMutation({
  mutationFn: async (payload: any) =>
    reject_document(props.shipmentId!, payload),
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Document rejected successfully");
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
    } else {
      toast.error(res.error || "Failed to reject document");
    }
  },
  onError: () => toast.error("Failed to reject document"),
});

const handleReject = async () => {
  if (!props.shipmentId || !props.filePath) return;
  const payload = {
    documentType: props.documentType,
    fileName: props.filePath,
  };
  await rejectMutate(payload);
};

const { mutateAsync: removeMutate, isPending: isRemoving } = useMutation({
  mutationFn: async (payload: any) =>
    remove_document(props.shipmentId!, payload),
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Document removed successfully");
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
    } else {
      toast.error(res.error || "Failed to remove document");
    }
  },
  onError: () => toast.error("Failed to remove document"),
});

const handleRemove = async () => {
  if (!props.shipmentId || !props.filePath) return;

  const confirm = await openModal("ConfirmationModal", {
    title: "Remove Document",
    message:
      "Are you sure you want to remove this document? This action cannot be undone.",
    confirmText: "Yes, Remove",
    cancelText: "Cancel",
    action: "delete",
  });

  if (!confirm) return;

  const payload = {
    documentType: props.documentType,
    fileName: props.filePath,
  };
  await removeMutate(payload);
};

const updateProgressDOM = (percent: number) => {
  if (progressBarRef.value) {
    progressBarRef.value.style.width = `${percent}%`;
  }
  if (progressTextRef.value) {
    progressTextRef.value.innerText = `${percent}%`;
  }
  if (progressBarRefEmpty.value) {
    progressBarRefEmpty.value.style.width = `${percent}%`;
  }
  if (progressTextRefEmpty.value) {
    progressTextRefEmpty.value.innerText = `${percent}%`;
  }
};

const { mutateAsync: uploadMutate, isPending: isUploading } = useMutation({
  mutationFn: async ({
    formData,
    config,
  }: {
    formData: FormData;
    config: any;
  }) => {
    return props.uploadFunction!(props.shipmentId!, formData, config);
  },
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Document uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["shipment"] });
    } else {
      toast.error(res.error || "Failed to upload document");
    }
  },
  onError: () => toast.error("Failed to upload document"),
  onSettled: () => {
    updateProgressDOM(0);
    if (fileInput.value) fileInput.value.value = "";
  },
});

const onFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (!files?.length || !props.shipmentId || !props.uploadFunction) return;

  updateProgressDOM(0);

  const formData = new FormData();
  const config = {
    onUploadProgress: (progressEvent: any) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        updateProgressDOM(percent);
      }
    },
  };

  if (props.allowMultiple) {
    for (let i = 0; i < files.length; i++) {
      formData.append(props.documentType, files[i]);
    }
  } else {
    formData.append(props.documentType, files[0]);
  }

  await uploadMutate({ formData, config });
};

const filename = computed(() => {
  if (!props.filePath) return "download";
  return props.filePath.split("/").pop()?.split("\\").pop() || "download";
});
</script>
