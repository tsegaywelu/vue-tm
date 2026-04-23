<template>
  <ModalWrapper
    class="p-6"
    :wrapper-class="
      [
        'flex justify-end',
        modalStyle === 'full' ? '' : 'items-end',
        wrapperClass,
      ]
        .filter(Boolean)
        .join(' ')
    "
    @close="handleClose"
  >
    <div
      class="bg-white flex flex-col overflow-hidden"
      :class="[
        modalStyle === 'full'
          ? 'h-full border-l border-gray-100 shadow-2xl'
          : 'h-auto rounded-[40px] shadow-2xl',
        'w-full max-w-[646px]',
        containerClass,
      ]"
      :style="'border-radius: 40px'"
    >
      <!-- Header -->
      <div
        class="border-b border-gray-100 p-6 flex justify-between items-start gap-1 shrink-0"
      >
        <div class="flex items-start flex-col gap-1 text-left">
          <h1 class="text-xl font-bold text-gray-900 leading-tight">
            {{ title }}
          </h1>
          <span v-if="subtitle" class="text-sm text-gray-500 text-left">{{
            subtitle
          }}</span>
        </div>
        <button
          type="button"
          @click="handleClose"
          class="rounded-full w-11 h-11 grid place-items-center shrink-0 hover:bg-gray-100 active:shadow-none transition-colors"
          style="
            box-shadow:
              4px 4px 44px 0px #0000000d,
              -4px -4px 44px 0px #0000000d;
          "
        >
          <i v-html="icons.times"></i>
        </button>
      </div>

      <!-- Content wrapper -->
      <Form
        :values="values"
        ref="formRef"
        :id="formId"
        :enable_unsaved_guard="false"
        @submit="onFormSubmit"
        v-bind="formProps"
        class="flex-1 flex flex-col overflow-hidden"
      >
        <!-- Body -->
        <div class="p-6 flex-1 flex flex-col gap-4 overflow-auto">
          <slot name="center" />
        </div>

        <!-- Footer -->
        <div
          v-if="$slots.bottom"
          class="p-6 border-t border-[#DFE1E7] shrink-0"
          :class="bottomClass"
        >
          <slot name="bottom" />
        </div>
      </Form>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import ModalWrapper from "./ModalWrapper.vue";
import Form from "@/components/form/Form.vue";
import { icons } from "@/utils/icons";
import { openModal, closeModal } from "@customizer/modal-x";

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  /** 'full' = full height side panel, 'auto' = auto height bottom-aligned */
  modalStyle: { type: String, default: "full" },
  /** Additional classes for the outer wrapper */
  wrapperClass: { type: String, default: "" },
  /** Additional classes for the inner container */
  containerClass: { type: String, default: "" },
  /** Additional classes for the footer section */
  bottomClass: { type: String, default: "" },
  /** Optional TanStack Form instance to wrap the content with */
  form: { type: Object, default: null },
  /** HTML ID for the form */
  formId: { type: String, default: "" },
  values: { type: Object, default: null },
});

const emit = defineEmits(["close", "submit"]);

const formRef = ref<InstanceType<typeof Form> | null>(null);

function onFormSubmit(values: any, resetCb: () => void) {
  emit("submit", values, resetCb);
}

const formProps = computed(() => {
  if (!props.form) return {};
  return {
    instance: props.form,
    id: props.formId,
    enableUnsavedGuard: false,
  };
});

async function handleClose() {
  // Check if the form has unsaved changes
  const isDirty = formRef.value?.is_dirty;

  console.log(isDirty);
  if (isDirty) {
    const res = await openModal("ConfirmationModal", {
      title: "Alert",
      message:
        "You have unsaved changes. Are you sure you want to discard them?",
      confirmText: "Proceed",
      cancelText: "Cancel",
    });
    if (res) {
      closeModal();
    }
    // If user cancelled, do nothing — stay on the modal
  } else {
    closeModal();
  }
}
</script>
