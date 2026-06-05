<template>
  <div
    class="fixed inset-0 z-100 overflow-hidden bg-black/40 backdrop-blur-[2px] flex justify-end md:p-4 modal-overlay"
    :class="[modalStyle === 'full' ? '' : 'items-end', wrapperClass]"
    @click.self="handleClose"
  >
    <Transition
      appear
      enter-active-class="panel-enter-active"
      enter-from-class="panel-enter-from"
      enter-to-class="panel-enter-to"
    >
      <div
        class="bg-surface flex flex-col overflow-auto border-t border-transparent dark:border-white/10 dark:shadow-[0_-8px_30px_rgba(255,255,255,0.05)]"
        :class="[
          modalStyle === 'full'
            ? 'max-h-[90dvh] sm:max-h-none sm:h-full sm:border-t-0 sm:border-l sm:border-line sm:dark:border-white/10 sm:dark:shadow-[-10px_0_50px_rgba(255,255,255,0.04)] shadow-2xl mt-auto'
            : 'max-h-[90dvh] sm:max-h-full h-auto sm:border sm:border-line sm:dark:border-white/10 sm:dark:shadow-[0_0_50px_rgba(255,255,255,0.05)] shadow-2xl',
          'w-full max-w-full sm:max-w-161.5',
          'rounded-t-3xl sm:rounded-[40px]',
          containerClass,
        ]"
      >
        <!-- Mobile drag handle -->
        <div class="sm:hidden flex justify-center pt-3 pb-1 shrink-0">
          <div class="w-12 h-1.5 bg-grey-300 rounded-full" />
        </div>

        <!-- Header -->
        <div
          class="border-b border-line p-6 flex justify-between items-start gap-1 shrink-0"
        >
          <div class="flex items-start flex-col gap-1 text-left">
            <h1 class="text-xl font-bold text-base-text leading-tight">
              {{ title }}
            </h1>
            <span v-if="subtitle" class="text-sm text-dim-text text-left">{{
              subtitle
            }}</span>
          </div>
          <button
            type="button"
            @click="handleClose"
            class="rounded-full w-11 h-11 grid place-items-center shrink-0 hover:bg-surface-hover active:shadow-none transition-colors"
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
          :on-submit="formSubmitHandler"
          v-bind="formProps"
          class="flex-1 flex flex-col overflow-hidden"
          #default="{ form }"
        >
          <!-- Body -->
          <div class="p-6 flex-1 flex flex-col gap-4 overflow-auto">
            <slot :form="form" name="center" />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.bottom"
            class="p-6 border-t border-line shrink-0 modal-footer"
            :class="bottomClass"
          >
            <slot :form="form" name="bottom" />
          </div>
        </Form>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, type PropType } from "vue";
import Form from "@/components/form/Form.vue";
import { icons } from "@/utils/icons";
import { openModal, closeModal } from "@customizer/modal-x";

// Set at setup time — runs synchronously before first render, no layout shift
document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "";
});

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
  /** Async submit handler — pass as prop (not event) so TanStack can track isSubmitting */
  submitHandler: {
    type: Function as PropType<
      (value: any, resetCb: () => void) => void | Promise<void>
    >,
    default: null,
  },
});

const emit = defineEmits(["close", "submit"]);

const formRef = ref<InstanceType<typeof Form> | null>(null);

const formSubmitHandler = computed(() => {
  if (props.submitHandler) return props.submitHandler;
  return (values: any, resetCb: () => void) => {
    emit("submit", values, resetCb);
  };
});

const formProps = computed(() => {
  if (!props.form) return {};
  return {
    instance: props.form,
    id: props.formId,
    enableUnsavedGuard: false,
  };
});

async function handleClose() {
  const isDirty = formRef.value?.is_dirty;

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
  } else {
    closeModal();
  }
}
</script>

<style scoped>
/* Panel: slide up from bottom on mobile, slide in from right on desktop */
.panel-enter-active {
  transition: transform 350ms cubic-bezier(0.32, 0.72, 0, 1);
}
.panel-enter-from {
  transform: translateY(100%);
}
.panel-enter-to {
  transform: translateY(0);
}
@media (min-width: 640px) {
  .panel-enter-from {
    transform: translateX(100%);
  }
  .panel-enter-to {
    transform: translateX(0);
  }
}

@media (max-width: 639px) {
  .modal-footer :deep(> div) {
    flex-direction: column;
    width: 100%;
  }
  .modal-footer :deep(button) {
    width: 100% !important;
    min-height: 3.25rem;
    font-size: 1rem;
    border-radius: 1rem;
  }
}
</style>
