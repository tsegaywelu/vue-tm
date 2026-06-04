<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Tab container must be always present for Teleport to work reliably -->
    <div id="purchase-order-details-tabs" class="w-full mt-2"></div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <template v-else-if="purchaseOrder">
      <!-- Header Section -->
      <div
        class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-4">
            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="mdi mdi-cart-outline text-2xl"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl leading-tight text-gray-900 uppercase">
                PO #{{ purchaseOrder.referenceNumber || '-------' }}
              </h1>
              <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span class="text-sm text-gray-600">
                  Supplier:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ purchaseOrder.to?.name || '-' }}
                  </span>
                </span>
                <span class="text-sm text-gray-600">
                  Date:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ purchaseOrder.date ? dateFormatter(purchaseOrder.date) : '-' }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4">
          <div class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2">
            <Status :variant="purchaseOrder.status" type="wrapped">
              {{ purchaseOrder.status?.replace(/_/g, " ") }}
            </Status>
          </div>
          <div class="flex gap-2">
            <Button
              v-if="canVoid"
              v-permission="'PURCHASE_ORDER:change_status'"
              variant="outline"
              size="md"
              class="text-red-600 border-red-600 hover:bg-red-50"
              @click="showVoidModal = true"
            >
              Void
            </Button>
            <Button
              variant="outline"
              size="md"
              @click="handlePrint"
            >
              <i class="*:size-4 mr-1" v-html="icons.printer" />
              Print
            </Button>
          </div>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <component
          :is="activeTabComponent"
          :key="activeTab"
          :purchase-order="purchaseOrder"
        />
      </div>

      <!-- Void Modal -->
      <ModalWrapper v-if="showVoidModal" @close="showVoidModal = false" class="flex items-center justify-center p-4">
        <div class="bg-white rounded-[30px] shadow-2xl w-full max-w-[500px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">Void Purchase Order</h2>
            <button @click="showVoidModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <i class="mdi mdi-close text-2xl"></i>
            </button>
          </div>
          
          <div class="p-6 flex flex-col gap-5">
            <p class="text-sm text-gray-600">
              Are you sure you want to <span class="text-red-600 font-bold">Void</span> this purchase order? This action cannot be undone.
            </p>
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Void Reason <span class="text-red-500">*</span></label>
              <textarea v-model="voidReason" placeholder="Enter reason for voiding..." class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm h-24 resize-none transition-all"></textarea>
            </div>
          </div>

          <div class="p-6 bg-gray-50 flex justify-end gap-3">
            <Button variant="outline" size="md" @click="showVoidModal = false" class="!rounded-2xl">Cancel</Button>
            <Button variant="primary" size="md" :isLoading="voidMutation.isPending" @click="handleVoid" class="!rounded-2xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200">Confirm Void</Button>
          </div>
        </div>
      </ModalWrapper>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { fetch_purchase_order_details, update_purchase_order_status } from "../../api/inventory.api";
import Status from "@/components/common/Status.vue";
import Button from "@/components/Button.vue";
import ModalWrapper from "@/components/modals/ModalWrapper.vue";
import { dateFormatter } from "@/utils/utils";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import { printPurchaseOrder } from "../../utils/printPurchaseOrder";
import { icons } from "@/utils/icons";

// Tabs
import PurchaseOrderOverviewTab from "../../components/inventory/PurchaseOrderOverviewTab.vue";

const route = useRoute();
const queryClient = useQueryClient();
const toast = useToastStore();
const auth = useAuthStore();
const poId = route.params.id as string;

const showVoidModal = ref(false);
const voidReason = ref("");

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "overview",
);

const { data: response, isLoading } = useQuery({
  queryKey: ["purchase-order", poId],
  queryFn: () => fetch_purchase_order_details(poId),
  enabled: !!poId,
});

const purchaseOrder = computed(() => response.value?.data);

const canVoid = computed(() => {
  const po = purchaseOrder.value;
  if (!po) return false;
  
  const userId = auth.user?._id;
  const isAdmin = auth.user?.role?.type === "ADMIN";

  return (
    po.status === "AUTHORIZED" &&
    po.paymentStatus === "PENDING" &&
    (po.authorizedBy?._id === userId || isAdmin)
  );
});

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return PurchaseOrderOverviewTab;
    default:
      return PurchaseOrderOverviewTab;
  }
});

const voidMutation = useMutation({
  mutationFn: (data: any) => update_purchase_order_status(poId, "void", data),
  onSuccess: () => {
    toast.success("Purchase order voided successfully");
    showVoidModal.value = false;
    queryClient.invalidateQueries({ queryKey: ["purchase-order", poId] });
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "Failed to void purchase order");
  },
});

const handleVoid = () => {
  if (!voidReason.value.trim()) {
    toast.error("Void reason is required");
    return;
  }
  voidMutation.mutate({ reason: voidReason.value });
};

const handlePrint = () => {
  if (!purchaseOrder.value) return;
  printPurchaseOrder(purchaseOrder.value, auth.user);
};
</script>
