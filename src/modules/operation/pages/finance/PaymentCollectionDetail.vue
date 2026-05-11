<template>
  <div class="h-full flex flex-col gap-4">
    <!-- Tab container must be always present for Teleport to work reliably -->
    <div id="payment-collection-details-tabs" class="w-full"></div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <template v-else-if="invoice">
      <!-- Header Section -->
      <div
        class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-4">
            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="mdi mdi-cash-register text-2xl"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl leading-tight text-gray-900">
                Collection #{{ invoice.reference || invoice.shipments?.[0]?.paymentDetail?.reference || '-------' }}
              </h1>
              <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span class="text-sm text-gray-600">
                  Requested By:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ invoice.paymentRequestedBy?.username || invoice.shipments?.[0]?.paymentDetail?.paymentRequestedBy?.username || '-' }}
                  </span>
                </span>
                <span class="text-sm text-gray-600">
                  Approved By:
                  <span class="font-bold text-black text-sm ml-1">
                    {{ invoice.paymentApprovedBy?.username || '-' }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4">
          <div class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2">
            <Status :variant="invoice.status || invoice.shipments?.[0]?.paymentDetail?.paymentStatus || 'pending'" type="wrapped">
              {{ (invoice.status || invoice.shipments?.[0]?.paymentDetail?.paymentStatus || 'PENDING').replace(/_/g, " ") }}
            </Status>
          </div>
          <div class="flex gap-2">
            <Button
              v-if="invoice.status === 'payment_approved'"
              variant="primary"
              size="md"
              @click="showCollectModal = true"
            >
              Collect
            </Button>
            <Button
              variant="outline"
              size="md"
              @click="handleExport"
            >
              <template #leading>
                <i class="mdi mdi-microsoft-excel text-lg text-green-600"></i>
              </template>
              Export
            </Button>
            <Button
              variant="outline"
              size="md"
              @click="handlePrint"
            >
              <template #leading>
                <i class="mdi mdi-printer text-lg"></i>
              </template>
              Print
            </Button>
          </div>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <component
          :is="activeTabComponent"
          :key="activeTab"
          :invoice="invoice"
        />
      </div>

      <!-- Collect Modal -->
      <ModalWrapper v-if="showCollectModal" @close="showCollectModal = false" class="flex items-center justify-center p-4">
        <div class="bg-white rounded-[30px] shadow-2xl w-full max-w-[500px] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">Collect Payment</h2>
            <button @click="showCollectModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <i class="mdi mdi-close text-2xl"></i>
            </button>
          </div>
          
          <div class="p-6 flex flex-col gap-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">CRV</label>
                <input v-model="collectForm.crv" type="text" placeholder="Enter CRV" class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all" />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">CSI</label>
                <input v-model="collectForm.csi" type="text" placeholder="Enter CSI" class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all" />
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Payment Date <span class="text-red-500">*</span></label>
              <input v-model="collectForm.paymentCollectedDate" type="date" class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all" />
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Remark</label>
              <textarea v-model="collectForm.remarkCarrier" placeholder="Optional remarks..." class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm h-24 resize-none transition-all"></textarea>
            </div>
          </div>

          <div class="p-6 bg-gray-50 flex justify-end gap-3">
            <Button variant="outline" size="md" @click="showCollectModal = false" class="!rounded-2xl">Cancel</Button>
            <Button variant="primary" size="md" :isLoading="collectMutation.isPending" @click="handleCollect" class="!rounded-2xl shadow-lg shadow-primary/20">Confirm Collection</Button>
          </div>
        </div>
      </ModalWrapper>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { fetch_invoice_details, collect_invoice } from "../../api/invoice.api";
import Status from "@/components/common/Status.vue";
import Button from "@/components/Button.vue";
import ModalWrapper from "@/components/modals/ModalWrapper.vue";
import { dateFormatter } from "@/utils/utils";
import { exportToExcel, mapShipmentsForExcel } from "@/utils/excel";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";

// Tabs
import PaymentCollectionOverviewTab from "../../components/finance/PaymentCollectionOverviewTab.vue";

const route = useRoute();
const queryClient = useQueryClient();
const toast = useToastStore();
const auth = useAuthStore();
const invoiceId = route.params.id as string;

const showCollectModal = ref(false);
const collectForm = reactive({
  crv: "",
  csi: "",
  paymentCollectedDate: new Date().toISOString().split("T")[0],
  remarkCarrier: "",
});

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "overview",
);

const { data: response, isLoading } = useQuery({
  queryKey: ["payment-collection", invoiceId],
  queryFn: () => fetch_invoice_details(invoiceId),
  enabled: !!invoiceId,
});

const invoice = computed(() => response.value?.data);

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return PaymentCollectionOverviewTab;
    default:
      return PaymentCollectionOverviewTab;
  }
});

const collectMutation = useMutation({
  mutationFn: (data: any) => collect_invoice(invoiceId, data),
  onSuccess: () => {
    toast.success("Payment collected successfully");
    showCollectModal.value = false;
    queryClient.invalidateQueries({ queryKey: ["payment-collection", invoiceId] });
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "Failed to collect payment");
  },
});

const handleCollect = () => {
  if (!collectForm.paymentCollectedDate) {
    toast.error("Payment date is required");
    return;
  }
  collectMutation.mutate({
    ...collectForm,
    paymentCollectedBy: auth.user?._id,
  });
};

const handlePrint = () => {
  window.print();
};

const handleExport = () => {
  if (!invoice.value?.shipments) return;
  const data = mapShipmentsForExcel(invoice.value.shipments);
  exportToExcel(data, `Collection_${invoice.value.reference || 'Details'}`, "Shipments");
};
</script>
