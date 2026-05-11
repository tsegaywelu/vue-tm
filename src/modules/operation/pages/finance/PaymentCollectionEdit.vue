<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <template v-else-if="formData">
      <!-- Header Section -->
      <div
        class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-4">
            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="mdi mdi-cash-edit text-2xl"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl leading-tight text-gray-900">
                Edit Collection #{{ originalInvoice?.reference || '-------' }}
              </h1>
              <p class="text-sm text-gray-500">Modify collection details and associated shipments.</p>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <Button
            variant="outline"
            size="md"
            @click="router.back()"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            :isLoading="updateMutation.isPending"
            @click="handleSubmit"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto pb-20">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Basic Information -->
          <div class="lg:col-span-1 flex flex-col gap-6">
            <div class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
              <h3 class="text-lg font-bold text-gray-900 border-b border-gray-50 pb-3">Collection Details</h3>
              
              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Reference</label>
                <input v-model="formData.reference" type="text" placeholder="Enter reference" class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all" />
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Status</label>
                <select v-model="formData.status" class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all appearance-none cursor-pointer">
                  <option value="PAYMENT_APPROVED">Approved</option>
                  <option value="PAID">Paid / Collected</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">CRV</label>
                  <input v-model="formData.crv" type="text" placeholder="CRV" class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all" />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">CSI</label>
                  <input v-model="formData.csi" type="text" placeholder="CSI" class="bg-gray-50 border-none rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all" />
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">Total Amount</label>
                <div class="bg-primary/5 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-600">Total:</span>
                  <span class="text-lg font-bold text-primary">{{ currencyFormatter(formData.totalAmount) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Associated Shipments -->
          <div class="lg:col-span-2 flex flex-col gap-6">
            <div class="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
              <div class="flex justify-between items-center border-b border-gray-50 pb-3 text-gray-500">
                <h3 class="text-lg font-bold text-gray-900">Associated Shipments</h3>
                <Button variant="primary" size="sm" @click="showShipmentSelector = true">
                  <template #leading><i class="mdi mdi-plus"></i></template>
                  Add Shipments
                </Button>
              </div>

              <div class="overflow-x-auto rounded-xl border border-gray-100">
                <table class="min-w-full divide-y divide-gray-100">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Code</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Vehicle</th>
                      <th class="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                      <th class="px-4 py-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-50 text-gray-500">
                    <tr v-if="!shipments.length">
                      <td colspan="4" class="px-4 py-10 text-center text-sm text-gray-400 italic">No shipments added yet.</td>
                    </tr>
                    <tr v-for="shipment in shipments" :key="shipment._id" class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-primary">{{ shipment.shipmentCode }}</td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">{{ shipment.vehicle?.plateNumber || '-' }}</td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{{ currencyFormatter(shipment.totalPrice || 0) }}</td>
                      <td class="px-4 py-4 whitespace-nowrap text-center">
                        <button @click="removeShipment(shipment._id)" class="text-red-400 hover:text-red-600 transition-colors">
                          <i class="mdi mdi-delete-outline text-xl"></i>
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

      <!-- Shipment Selector Modal -->
      <ModalWrapper v-if="showShipmentSelector" @close="showShipmentSelector = false" class="flex items-center justify-center p-4">
        <div class="bg-white rounded-[30px] shadow-2xl w-full max-w-[700px] max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
          <div class="p-6 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Select Shipments</h2>
              <p class="text-xs text-gray-500">{{ selectedShipmentIds.length }} shipments selected</p>
            </div>
            <button @click="showShipmentSelector = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <i class="mdi mdi-close text-2xl"></i>
            </button>
          </div>

          <div class="p-4 bg-gray-50 border-b border-gray-100">
            <div class="relative">
              <i class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
              <input v-model="shipmentSearch" type="text" placeholder="Search by shipment code..." class="w-full bg-white border-none rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all shadow-sm" />
            </div>
          </div>
          
          <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            <div v-if="receivableLoading" class="flex justify-center py-10">
              <i class="mdi mdi-loading mdi-spin text-2xl text-primary"></i>
            </div>
            <template v-else>
              <div v-if="!filteredReceivableShipments.length" class="text-center py-10 text-gray-400 italic text-sm">No receivable shipments found.</div>
              <div 
                v-for="shipment in filteredReceivableShipments" 
                :key="shipment._id"
                class="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100 text-gray-500"
                @click="toggleShipmentSelection(shipment._id)"
              >
                <div class="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    :checked="selectedShipmentIds.includes(shipment._id)"
                    @click.stop="toggleShipmentSelection(shipment._id)"
                    class="size-5 rounded-lg border-2 border-gray-200 text-primary focus:ring-primary/20 transition-all cursor-pointer"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-gray-900 truncate">{{ shipment.shipmentCode }}</span>
                    <span class="font-extrabold text-primary">{{ currencyFormatter(shipment.totalPrice) }}</span>
                  </div>
                  <div class="flex items-center gap-3 mt-0.5">
                    <span class="text-xs text-gray-500 flex items-center gap-1">
                      <i class="mdi mdi-truck-outline text-sm"></i>
                      {{ shipment.vehicle?.plateNumber || '-' }}
                    </span>
                    <span class="text-xs text-gray-500 flex items-center gap-1">
                      <i class="mdi mdi-map-marker-outline text-sm"></i>
                      {{ shipment.route?.origin }} → {{ shipment.route?.destination }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <div class="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <Button variant="outline" size="md" @click="showShipmentSelector = false" class="!rounded-2xl">Cancel</Button>
            <Button variant="primary" size="md" @click="addSelectedShipments" class="!rounded-2xl shadow-lg shadow-primary/20">Add Selected ({{ selectedShipmentIds.length }})</Button>
          </div>
        </div>
      </ModalWrapper>
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
  fetch_receivable_shipments 
} from "../../api/invoice.api";
import Button from "@/components/Button.vue";
import Status from "@/components/common/Status.vue";
import ModalWrapper from "@/components/modals/ModalWrapper.vue";
import { dateFormatter, currencyFormatter } from "@/utils/utils";
import { useToastStore } from "@/store/toastStore";

const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();
const toast = useToastStore();
const invoiceId = route.params.id as string;

const showShipmentSelector = ref(false);
const shipmentSearch = ref("");
const selectedShipmentIds = ref<string[]>([]);
const newlyAddedShipments = ref<any[]>([]);

const formData = reactive({
  reference: "",
  status: "",
  totalAmount: 0,
  crv: "",
  csi: "",
  shipments: [] as string[],
});

// Fetch Collection Details
const { data: response, isLoading } = useQuery({
  queryKey: ["payment-collection", invoiceId],
  queryFn: () => fetch_invoice_details(invoiceId),
  enabled: !!invoiceId,
});

const originalInvoice = computed(() => response.value?.data);

// Fetch Receivable Shipments for selection
const { data: receivableResponse, isLoading: receivableLoading } = useQuery({
  queryKey: ["receivable-shipments"],
  queryFn: () => fetch_receivable_shipments(),
});

const receivableShipments = computed(() => receivableResponse.value?.data?.results || receivableResponse.value?.data || []);

const filteredReceivableShipments = computed(() => {
  const all = receivableShipments.value || [];
  const search = shipmentSearch.value.toLowerCase();
  return all.filter((s: any) => 
    !formData.shipments.includes(s._id) && 
    (s.shipmentCode || '').toLowerCase().includes(search)
  );
});

const shipments = computed(() => {
  const existing = originalInvoice.value?.shipments || [];
  const filteredExisting = existing.filter((s: any) => formData.shipments.includes(s._id));
  return [...filteredExisting, ...newlyAddedShipments.value];
});

// Initialize form data
watch(originalInvoice, (newVal) => {
  if (newVal) {
    formData.reference = newVal.reference || "";
    formData.status = newVal.status || "PAYMENT_APPROVED";
    formData.totalAmount = newVal.totalAmount || 0;
    formData.crv = newVal.crv || "";
    formData.csi = newVal.csi || "";
    formData.shipments = newVal.shipments?.map((s: any) => s._id) || [];
  }
}, { immediate: true });

// Recalculate total amount
watch(shipments, (newShipments) => {
  formData.totalAmount = newShipments.reduce((acc, s) => acc + (s.totalPrice || 0), 0);
}, { deep: true });

const toggleShipmentSelection = (id: string) => {
  if (selectedShipmentIds.value.includes(id)) {
    selectedShipmentIds.value = selectedShipmentIds.value.filter(sid => sid !== id);
  } else {
    selectedShipmentIds.value.push(id);
  }
};

const addSelectedShipments = () => {
  const selectedDetails = receivableShipments.value.filter((s: any) => selectedShipmentIds.value.includes(s._id));
  newlyAddedShipments.value = [...newlyAddedShipments.value, ...selectedDetails];
  formData.shipments = [...formData.shipments, ...selectedShipmentIds.value];
  
  selectedShipmentIds.value = [];
  shipmentSearch.value = "";
  showShipmentSelector.value = false;
};

const removeShipment = (id: string) => {
  formData.shipments = formData.shipments.filter(sid => sid !== id);
  newlyAddedShipments.value = newlyAddedShipments.value.filter(s => s._id !== id);
};

const updateMutation = useMutation({
  mutationFn: (data: any) => update_payment_request(invoiceId, data),
  onSuccess: () => {
    toast.success("Collection updated successfully");
    queryClient.invalidateQueries({ queryKey: ["payment-collection", invoiceId] });
    router.back();
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "Failed to update collection");
  },
});

const handleSubmit = () => {
  updateMutation.mutate({
    reference: formData.reference,
    status: formData.status,
    totalAmount: formData.totalAmount,
    crv: formData.crv,
    csi: formData.csi,
    shipments: formData.shipments,
  });
};
</script>
