<template>
  <div
    class="w-full h-full overflow-hidden bg-black/40 backdrop-blur-[2px] flex flex-col justify-end sm:flex sm:items-center sm:justify-center sm:px-4 modal-overlay"
  >
    <div
      class="confirmation-card bg-white pt-2 rounded-t-3xl sm:rounded-4xl shadow-2xl w-full sm:max-w-sm flex flex-col max-h-[90dvh] sm:max-h-none"
      style="box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15)"
    >
      <!-- Mobile drag handle -->
      <div class="sm:hidden flex justify-center pb-4 shrink-0">
        <div class="w-12 h-1.5 bg-grey-300 rounded-full" />
      </div>

      <!-- Scrollable content -->
      <div
        class="flex flex-col items-center text-center overflow-y-auto px-8 sm:px-8 sm:pt-8 flex-1"
      >
        <!-- Icon/Visual Area -->
        <div
          class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shrink-0"
          :class="
            isNegativeAction
              ? 'bg-red-50 text-red-500'
              : 'bg-blue-50 text-blue-500'
          "
        >
          <i
            v-if="isNegativeAction"
            class="mdi mdi-alert-circle-outline text-3xl"
          ></i>
          <i v-else class="mdi mdi-help-circle-outline text-3xl"></i>
        </div>

        <h2 class="text-xl font-bold mb-2 text-gray-900 leading-tight">
          {{ data.title || "Are you sure?" }}
        </h2>

        <p class="mb-8 text-sm text-gray-500 leading-relaxed px-2">
          {{ data.message || defaultMessage }}
        </p>

        <!-- Optional Amount Input -->
        <div
          v-if="data.action === 'approve' && data.showAmountInput"
          class="mb-6 w-full text-left"
        >
          <label
            class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1"
            >Approved Amount</label
          >
          <input
            v-model.number="approvedAmount"
            type="number"
            min="0"
            step="0.01"
            class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="0.00"
          />
        </div>
      </div>

      <!-- Buttons — always pinned, never clipped -->
      <div
        class="flex flex-col w-full gap-3 px-8 sm:px-8 buttons-footer shrink-0"
      >
        <button
          @click="confirm"
          class="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
          :style="{
            background: isNegativeAction
              ? 'linear-gradient(180deg, #FF5F5F 0%, #D93A3A 100%)'
              : 'linear-gradient(180deg, #4A4AFF 0%, #2222FF 100%)',
          }"
        >
          {{ data.confirmText || "Yes, Proceed" }}
        </button>

        <button
          @click="cancel"
          class="w-full py-4 rounded-2xl text-sm font-bold mb-8 bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all"
        >
          {{ data.cancelText || "Cancel" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Safe area: buttons stay above home indicator */
@media (max-width: 639px) {
  .buttons-footer {
    padding-bottom: max(2.5rem, env(safe-area-inset-bottom, 0px));
    padding-top: 1rem;
  }

  /* Slide up — fill-mode: backwards applies from-state before animation starts, no flicker */
  .confirmation-card {
    animation: card-slide-up 350ms cubic-bezier(0.32, 0.72, 0, 1) backwards;
  }
  @keyframes card-slide-up {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}

/* Desktop: scale + fade in */
@media (min-width: 640px) {
  .confirmation-card {
    animation: card-scale-in 250ms ease-out backwards;
  }
  @keyframes card-scale-in {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
}
</style>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { closeModal } from "@customizer/modal-x";

// Set at setup time — runs synchronously before first render, no layout shift
document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "";
});

export type ReturnType =
  | boolean
  | { confirmed: boolean; approvedAmount: number };

export type Props = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  initialAmount?: number;
  action?: string;
  subject?: string;
  showAmountInput?: boolean;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  type?: "primary" | "danger";
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const approvedAmount = ref(props.data?.initialAmount ?? "");

const isNegativeAction = computed(
  () =>
    ["reject", "cancel", "delete", "terminate"].includes(
      props.data?.action?.toLowerCase() || "",
    ) ||
    props.data?.title?.toLowerCase().includes("discard") ||
    props.data?.message?.toLowerCase().includes("unsaved"),
);

const defaultMessage = computed(() => {
  if (props.data.subject && props.data.action) {
    return `You are about to ${props.data.action} this ${props.data.subject}. Do you want to proceed?`;
  }
  return "Please confirm if you would like to proceed with this action.";
});

function confirm() {
  if (props.data.action === "approve" && props.data.showAmountInput) {
    const amount = Number(approvedAmount.value);
    if (!Number.isFinite(amount) || amount <= 0) return;
    closeModal({ confirmed: true, approvedAmount: amount });
  } else {
    closeModal(true);
  }
}

function cancel() {
  closeModal(false);
}
</script>
