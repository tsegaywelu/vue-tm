<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <template v-else-if="originalInvoice">
      <!-- Header -->
      <div
        class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex items-center gap-4">
          <div
            class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"
          >
            <i class="mdi mdi-file-edit-outline text-2xl"></i>
          </div>
          <div>
            <h1 class="font-bold text-2xl leading-tight text-gray-900">
              Edit Invoice #{{ originalInvoice?.reference || "-------" }}
            </h1>
            <p class="text-sm text-gray-500">
              Modify payment request details and associated shipments.
            </p>
          </div>
        </div>

        <div class="flex gap-2">
          <Button variant="outline" size="md" @click="router.back()"
            >Cancel</Button
          >
          <Button
            variant="primary"
            size="md"
            :isLoading="updateMutation.isPending.value"
            @click="handleSubmit"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto pb-20">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Basic Information -->
          <div class="lg:col-span-1">
            <div
              class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col gap-5"
            >
              <h3
                class="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3"
              >
                Basic Information
              </h3>

              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1"
                  >Reference</label
                >
                <input
                  v-model="formData.reference"
                  type="text"
                  placeholder="Enter reference"
                  class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1"
                  >Status</label
                >
                <select
                  v-model="formData.status"
                  class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all appearance-none cursor-pointer"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAYMENT_REQUESTED">Payment Requested</option>
                  <option value="PAYMENT_APPROVED">Payment Approved</option>
                  <option value="PAYMENT_REJECTED">Payment Rejected</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>

              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1"
                  >CRV</label
                >
                <input
                  v-model="formData.crv"
                  type="text"
                  placeholder="Enter CRV"
                  class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                />
              </div>

              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1"
                  >Total Amount</label
                >
                <div
                  class="bg-primary/5 rounded-2xl px-4 py-3 flex items-center justify-between"
                >
                  <span class="text-sm font-medium text-gray-600"
                    >Calculated Sum:</span
                  >
                  <span class="text-lg font-bold text-primary">{{
                    currencyFormatter(formData.totalAmount)
                  }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Associated Shipments -->
          <div class="lg:col-span-2">
            <div
              class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col gap-5"
            >
              <h3
                class="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3"
              >
                Associated Shipments
              </h3>

              <!-- Multi-search select for adding shipments -->
              <div class="flex flex-col gap-1.5">
                <label
                  class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1"
                  >Add Shipments</label
                >
                <BaseSelect
                  v-model="selectedNewShipmentIds"
                  name="new-shipments"
                  multiple
                  searchable
                  url="/shipment/receivableShipment"
                  label_key="shipmentCode"
                  value_key="_id"
                  search_key="shipmentCode"
                  :attributes="{
                    placeholder: 'Search and select shipments to add...',
                  }"
                  @select="handleShipmentSelect"
                />
              </div>

              <!-- Shipments table -->
              <div class="overflow-x-auto rounded-xl border border-gray-100">
                <table class="min-w-full divide-y divide-gray-100">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                      >
                        Code
                      </th>
                      <th
                        class="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        class="px-4 py-3 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        class="px-4 py-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-50">
                    <tr v-if="!allShipments.length">
                      <td
                        colspan="4"
                        class="px-4 py-10 text-center text-sm text-gray-400 italic"
                      >
                        No shipments added yet.
                      </td>
                    </tr>
                    <tr
                      v-for="shipment in allShipments"
                      :key="shipment._id"
                      class="hover:bg-gray-50 transition-colors"
                    >
                      <td
                        class="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary"
                      >
                        {{ shipment.shipmentCode }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <Status
                          :variant="
                            shipment.paymentDetail?.paymentStatus || 'pending'
                          "
                          type="wrapped"
                          size="sm"
                        >
                          {{
                            shipment.paymentDetail?.paymentStatus || "Pending"
                          }}
                        </Status>
                      </td>
                      <td
                        class="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right"
                      >
                        {{ currencyFormatter(shipment.totalPrice || 0) }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          @click="removeShipment(shipment._id)"
                          class="text-red-400 hover:text-red-600 transition-colors"
                          title="Remove shipment"
                        >
                          <i v-html="icons.delete"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  fetch_invoice_details,
  update_payment_request,
} from "../../api/invoice.api";
import Button from "@/components/Button.vue";
import Status from "@/components/common/Status.vue";
import BaseSelect from "@/components/common/Select.vue";
import { currencyFormatter } from "@/utils/utils";
import { useToastStore } from "@/store/toastStore";
import { icons } from "@/utils/icons";
import { openModal } from "@customizer/modal-x";

const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();
const toast = useToastStore();
const invoiceId = route.params.id as string;

// Existing shipments from invoice (IDs, removable)
const existingShipmentIds = ref<string[]>([]);

// Newly added via multi-select
const selectedNewShipmentIds = ref<string[]>([]);

// Full shipment objects for newly selected (populated on @select)
const newShipmentDetailsMap = ref<Record<string, any>>({});

const formData = reactive({
  reference: "",
  status: "",
  totalAmount: 0,
  crv: "",
});

interface InvoiceShipment {
  _id: string;
  shipmentCode: string;
  totalPrice: number;
  paymentDetail?: { paymentStatus?: string };
}

interface Invoice {
  _id: string;
  reference: string;
  status: string;
  totalAmount: number;
  crv?: string;
  shipments: InvoiceShipment[];
}

const { data: response, isLoading } = useQuery({
  queryKey: ["invoice-report", invoiceId],
  queryFn: () => fetch_invoice_details(invoiceId),
  enabled: !!invoiceId,
});

const originalInvoice = computed(
  () => response.value?.data as Invoice | undefined,
);

watch(
  originalInvoice,
  (val) => {
    if (!val) return;
    formData.reference = val.reference || "";
    formData.status = val.status || "PENDING";
    formData.totalAmount = val.totalAmount || 0;
    formData.crv = val.crv || "";
    existingShipmentIds.value = val.shipments?.map((s: any) => s._id) || [];
  },
  { immediate: true },
);

const existingShipments = computed(() => {
  const all: any[] = originalInvoice.value?.shipments || [];
  return all.filter((s) => existingShipmentIds.value.includes(s._id));
});

const newShipments = computed(() =>
  selectedNewShipmentIds.value
    .map((id) => newShipmentDetailsMap.value[id])
    .filter(Boolean),
);

const allShipments = computed(() => [
  ...existingShipments.value,
  ...newShipments.value,
]);

// Recalculate total whenever shipment list changes
watch(
  allShipments,
  (ships) => {
    formData.totalAmount = ships.reduce(
      (sum, s) => sum + (s.totalPrice || 0),
      0,
    );
  },
  { deep: true },
);

// Capture full shipment object when selected from dropdown
const handleShipmentSelect = (option: any) => {
  const shipment = option?.item;
  if (shipment?._id) {
    newShipmentDetailsMap.value[shipment._id] = shipment;
  }
};

const removeShipment = async (id: string) => {
  const res = await openModal("ConfirmationModal", {
    title: "Remove Shipment",
    message: "Are you sure?",
  });

  if (!res) return;

  existingShipmentIds.value = existingShipmentIds.value.filter(
    (sid) => sid !== id,
  );
  selectedNewShipmentIds.value = selectedNewShipmentIds.value.filter(
    (sid) => sid !== id,
  );
};

const updateMutation = useMutation({
  mutationFn: (data: any) => update_payment_request(invoiceId, data),
  onSuccess: () => {
    toast.success("Invoice updated successfully");
    queryClient.invalidateQueries({ queryKey: ["invoice-report", invoiceId] });
    router.back();
  },
  onError: (error: any) => {
    toast.error(
      error.response?.data?.description || "Failed to update invoice",
    );
  },
});

const handleSubmit = () => {
  updateMutation.mutate({
    reference: formData.reference,
    status: formData.status,
    totalAmount: formData.totalAmount,
    crv: formData.crv,
    shipments: [...existingShipmentIds.value, ...selectedNewShipmentIds.value],
  });
};
</script>
