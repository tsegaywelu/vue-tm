<script setup lang="ts">
import { inject, onMounted, ref, computed, watch } from "vue";
import { genId, currencyFormatter } from "@/utils/utils";
import InputParent from "@/components/form/InputParent.vue";
import ModalWrapper from "@/components/modals/ModalWrapper.vue";
import Button from "@/components/Button.vue";
import { useQuery } from "@tanstack/vue-query";
import { fetch_receivable_shipments } from "../../api/invoice.api";

type ShipmentItem = {
  fakeId: string;
  _id: string;
  shipmentCode: string;
  totalPrice: number;
  vehicle?: any;
  route?: any;
};

const props = defineProps<{ name: string }>();

const formContext = inject<any>("formContext");
const form = formContext?.form;

const shipments = ref<ShipmentItem[]>([]);
const showSelector = ref(false);
const search = ref("");
const selectedIds = ref<string[]>([]);

const { data: receivableData, isLoading: receivableLoading } = useQuery({
  queryKey: ["receivable-shipments-edit"],
  queryFn: () => fetch_receivable_shipments(),
});

const receivableShipments = computed<any[]>(
  () => receivableData.value?.data?.results || receivableData.value?.data || [],
);

const filteredReceivable = computed(() => {
  const currentIds = shipments.value.map((s) => s._id);
  const q = search.value.toLowerCase();
  return receivableShipments.value.filter(
    (s: any) => !currentIds.includes(s._id) && (s.shipmentCode || "").toLowerCase().includes(q),
  );
});

const total = computed(() => shipments.value.reduce((sum, s) => sum + (s.totalPrice || 0), 0));

onMounted(() => {
  const existing: any[] = form?.getFieldValue(props.name) || [];
  if (existing.length) {
    shipments.value = existing.map((s: any) => ({
      ...s,
      fakeId: genId.next().value as string,
    }));
  }
});

watch(shipments, () => form?.setFieldValue(props.name, shipments.value), { deep: true });

const toggleSelect = (id: string) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((sid) => sid !== id);
  } else {
    selectedIds.value.push(id);
  }
};

const addSelected = () => {
  const toAdd = receivableShipments.value
    .filter((s: any) => selectedIds.value.includes(s._id))
    .map((s: any) => ({ ...s, fakeId: genId.next().value as string }));
  shipments.value = [...shipments.value, ...toAdd];
  selectedIds.value = [];
  search.value = "";
  showSelector.value = false;
};

const remove = (fakeId: string) => {
  shipments.value = shipments.value.filter((s) => s.fakeId !== fakeId);
};
</script>

<template>
  <InputParent
    :name="props.name"
    :validation="{
      atLeastOne(values: any[]) {
        return values && values.length > 0
          ? [true, '']
          : [false, 'At least one shipment is required'];
      },
    }"
  >
    <div tabindex="0" :data-name="props.name" class="space-y-3">
      <div
        v-if="!shipments.length"
        class="text-center py-8 text-gray-400 text-sm italic border border-dashed border-gray-200 rounded-2xl"
      >
        No shipments added yet.
      </div>

      <div
        v-for="s in shipments"
        :key="s.fakeId"
        class="flex items-center gap-4 bg-gray-50/50 px-5 py-4 rounded-2xl border border-gray-100 relative"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between gap-4">
            <span class="font-bold text-primary text-sm">{{ s.shipmentCode }}</span>
            <span class="font-extrabold text-gray-900 text-sm">{{ currencyFormatter(s.totalPrice || 0) }}</span>
          </div>
          <div class="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <span class="flex items-center gap-1">
              <i class="mdi mdi-truck-outline text-sm"></i>
              {{ s.vehicle?.plateNumber || "-" }}
            </span>
            <span class="flex items-center gap-1">
              <i class="mdi mdi-map-marker-outline text-sm"></i>
              {{ s.route?.origin }} → {{ s.route?.destination }}
            </span>
          </div>
        </div>
        <button
          type="button"
          class="size-6 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          @click="remove(s.fakeId)"
        >
          <i class="mdi mdi-close"></i>
        </button>
      </div>

      <div v-if="shipments.length" class="flex justify-end px-1 pt-2">
        <div class="bg-primary/5 rounded-2xl px-5 py-3 flex items-center gap-4">
          <span class="text-sm font-medium text-gray-600">Total:</span>
          <span class="text-lg font-bold text-primary">{{ currencyFormatter(total) }}</span>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs hover:opacity-80 transition-opacity"
      @click="showSelector = true"
    >
      <i class="mdi mdi-plus-circle-outline text-lg"></i>
      Add Shipments
    </button>

    <ModalWrapper v-if="showSelector" @close="showSelector = false" class="flex items-center justify-center p-4">
      <div class="bg-white rounded-[30px] shadow-2xl w-full max-w-[700px] max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Select Shipments</h2>
            <p class="text-xs text-gray-500">{{ selectedIds.length }} selected</p>
          </div>
          <button type="button" @click="showSelector = false" class="text-gray-400 hover:text-gray-600">
            <i class="mdi mdi-close text-2xl"></i>
          </button>
        </div>

        <div class="p-4 bg-gray-50 border-b border-gray-100">
          <div class="relative">
            <i class="mdi mdi-magnify absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
            <input
              v-model="search"
              type="text"
              placeholder="Search by shipment code..."
              class="w-full bg-white border-none rounded-2xl pl-12 pr-4 py-3 outline-none text-sm shadow-sm"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          <div v-if="receivableLoading" class="flex justify-center py-10">
            <i class="mdi mdi-loading mdi-spin text-2xl text-primary"></i>
          </div>
          <template v-else>
            <div
              v-if="!filteredReceivable.length"
              class="text-center py-10 text-gray-400 italic text-sm"
            >
              No receivable shipments found.
            </div>
            <div
              v-for="s in filteredReceivable"
              :key="s._id"
              class="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-100"
              @click="toggleSelect(s._id)"
            >
              <input
                type="checkbox"
                :checked="selectedIds.includes(s._id)"
                @click.stop="toggleSelect(s._id)"
                class="size-5 rounded border-2 border-gray-200 text-primary cursor-pointer"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-gray-900 truncate">{{ s.shipmentCode }}</span>
                  <span class="font-extrabold text-primary">{{ currencyFormatter(s.totalPrice) }}</span>
                </div>
                <div class="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <i class="mdi mdi-truck-outline"></i>
                    {{ s.vehicle?.plateNumber || "-" }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="mdi mdi-map-marker-outline"></i>
                    {{ s.route?.origin }} → {{ s.route?.destination }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <Button type="button" variant="outline" size="md" @click="showSelector = false">Cancel</Button>
          <Button type="button" variant="primary" size="md" @click="addSelected">
            Add Selected ({{ selectedIds.length }})
          </Button>
        </div>
      </div>
    </ModalWrapper>
  </InputParent>
</template>
