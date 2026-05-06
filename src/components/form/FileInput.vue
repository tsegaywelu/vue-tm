<script setup lang="ts">
import { ref } from "vue";
import InputParent from "./InputParent.vue";
import InputLayout from "./InputLayout.vue";
import { type InputLayoutProps } from "./InputLayout.vue";

export interface FileInputProps extends Omit<InputLayoutProps, "error"> {
  name: string;
  multiple?: boolean;
  accept?: string;
  validation?: Record<string, any>;
  on_change?: (val: any, form: any) => void;
}

const props = withDefaults(defineProps<FileInputProps>(), {
  multiple: false,
  accept: "*/*",
  validation: () => ({}),
});

const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileChange(e: Event, field: any) {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    addFiles(Array.from(target.files), field);
  }
}

function handleDrop(e: DragEvent, field: any) {
  isDragging.value = false;
  if (e.dataTransfer?.files) {
    addFiles(Array.from(e.dataTransfer.files), field);
  }
}

function addFiles(newFiles: File[], field: any) {
  const currentValues = Array.isArray(field.state.value)
    ? field.state.value
    : field.state.value
      ? [field.state.value]
      : [];

  if (props.multiple) {
    field.handleChange([...currentValues, ...newFiles]);
  } else {
    field.handleChange(newFiles[0]);
  }
}

function removeFile(index: number, field: any) {
  const currentValues = Array.isArray(field.state.value)
    ? [...field.state.value]
    : [field.state.value];
  currentValues.splice(index, 1);

  if (props.multiple) {
    field.handleChange(currentValues);
  } else {
    field.handleChange(undefined);
  }
}

function getFileName(file: any) {
  if (file instanceof File) return file.name;
  if (typeof file === "string") {
    // Extract filename from URL/Path
    try {
      const url = new URL(file, window.location.origin);
      return url.pathname.split("/").pop() || file;
    } catch {
      return file.split("/").pop() || file;
    }
  }
  return "Unknown File";
}
</script>

<template>
  <InputParent :name="name" :validation="validation" :on_change="on_change">
    <template #default="{ field }">
      <InputLayout
        :label="label"
        :size="size"
        :parent_class_name="parent_class_name"
        :error="
          field.state.meta.errors.length ? field.state.meta.errors[0] : undefined
        "
        :validations="validation"
        :description="description"
        input_style="border-none bg-transparent p-0 h-auto"
      >
        <div
          class="w-full h-full min-h-[140px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all cursor-pointer group relative"
          :class="[
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50/50',
          ]"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop($event, field)"
          @click="triggerFileInput"
        >
          <input
            type="file"
            class="hidden"
            ref="fileInput"
            :multiple="multiple"
            :accept="accept"
            @change="handleFileChange($event, field)"
          />

          <!-- Empty State -->
          <div
            v-if="
              !field.state.value ||
              (Array.isArray(field.state.value) && field.state.value.length === 0)
            "
            class="flex flex-col items-center gap-2"
          >
            <div
              class="size-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"
            >
              <i
                class="mdi mdi-cloud-upload-outline text-2xl text-gray-400 group-hover:text-primary"
              ></i>
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-600">
                <span class="font-bold text-primary">Click to upload</span> or
                drag and drop
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ multiple ? "You can upload multiple files" : "Single file only" }}
                <span v-if="accept !== '*/*'">({{ accept }})</span>
              </p>
            </div>
          </div>

          <!-- Files List -->
          <div v-else class="w-full space-y-2" @click.stop>
            <div
              v-for="(file, index) in Array.isArray(field.state.value)
                ? field.state.value
                : [field.state.value]"
              :key="index"
              class="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:border-primary/30 transition-colors"
            >
              <div class="flex items-center gap-3 overflow-hidden">
                <div
                  class="size-10 rounded-lg bg-gray-50 flex items-center justify-center shrink-0"
                >
                  <i class="mdi mdi-file-document-outline text-xl text-gray-400"></i>
                </div>
                <div class="flex flex-col overflow-hidden">
                  <span class="text-sm font-bold text-gray-900 truncate">{{
                    getFileName(file)
                  }}</span>
                  <span v-if="typeof file === 'string'" class="text-[10px] text-primary uppercase font-bold tracking-wider">Existing File</span>
                  <span v-else class="text-[10px] text-gray-400 uppercase font-bold tracking-wider">New Upload</span>
                </div>
              </div>
              <button
                @click.prevent="removeFile(index, field)"
                class="size-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove file"
              >
                <i class="mdi mdi-close"></i>
              </button>
            </div>

            <button
              v-if="multiple"
              @click="triggerFileInput"
              type="button"
              class="mt-4 w-full py-2 flex items-center justify-center gap-2 text-xs font-black text-primary uppercase tracking-widest border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
            >
              <i class="mdi mdi-plus-circle-outline text-lg"></i>
              Add more files
            </button>
          </div>
        </div>
      </InputLayout>
    </template>
  </InputParent>
</template>
