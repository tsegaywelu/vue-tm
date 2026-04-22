<template>
  <div class="fixed inset-0 h-full w-full bg-black/40 backdrop-blur-[2px] grid place-items-center px-4 z-[200]">
    <div 
      class="bg-white p-8 rounded-[32px] shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100"
      style="box-shadow: 0 20px 50px rgba(0,0,0,0.15);"
    >
      <div class="flex flex-col items-center text-center">
        <!-- Icon/Visual Area -->
        <div 
          class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          :class="isNegativeAction ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'"
        >
          <i v-if="isNegativeAction" class="mdi mdi-alert-circle-outline text-3xl"></i>
          <i v-else class="mdi mdi-help-circle-outline text-3xl"></i>
        </div>

        <h2 class="text-xl font-bold mb-2 text-gray-900 leading-tight">
          {{ data.title || 'Are you sure?' }}
        </h2>

        <p class="mb-8 text-sm text-gray-500 leading-relaxed px-2">
          {{ data.message || defaultMessage }}
        </p>

        <!-- Optional Amount Input -->
        <div
          v-if="data.action === 'approve' && data.showAmountInput"
          class="mb-6 w-full text-left"
        >
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1"
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

        <div class="flex flex-col w-full gap-3">
          <button
            @click="confirm"
            class="w-full py-4 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/20"
            :style="{
              background: isNegativeAction 
                ? 'linear-gradient(180deg, #FF5F5F 0%, #D93A3A 100%)' 
                : 'linear-gradient(180deg, #4A4AFF 0%, #2222FF 100%)'
            }"
          >
            {{ data.confirmText || 'Yes, Proceed' }}
          </button>
          
          <button
            @click="cancel"
            class="w-full py-4 rounded-2xl text-sm font-bold bg-gray-50 text-gray-500 hover:bg-gray-100 transition-all"
          >
            {{ data.cancelText || 'Cancel' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { closeModal } from "@customizer/modal-x";

export type ReturnType = boolean | { confirmed: boolean; approvedAmount: number };

export type Props = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  initialAmount?: number;
  action?: string;
  subject?: string;
  showAmountInput?: boolean;
};

const props = defineProps<{ data: Props; close: (res: ReturnType) => void }>();

const approvedAmount = ref(props.data?.initialAmount ?? "");

const isNegativeAction = computed(() => 
  ["reject", "cancel", "delete", "terminate"].includes(props.data?.action?.toLowerCase() || "") ||
  props.data?.title?.toLowerCase().includes("discard") ||
  props.data?.message?.toLowerCase().includes("unsaved")
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
