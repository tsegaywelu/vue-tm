<script setup lang="ts">
import { inject, onMounted, ref, computed, watch } from "vue";
import { currencyFormatter } from "@/utils/utils";
import InputParent from "@/components/form/InputParent.vue";
import BaseSelect from "@/components/common/Select.vue";

const props = defineProps<{ name: string }>();

const formContext = inject<any>("formContext");
const form = formContext?.form;

const knownItems = new Map<string, any>();
const selectedIds = ref<string[]>([]);
const initialOptions = ref<any[]>([]);

const shipments = computed(() =>
  selectedIds.value.map((id) => knownItems.get(id)).filter(Boolean),
);

const total = computed(() =>
  shipments.value.reduce((sum, s: any) => sum + (s?.totalPrice || 0), 0),
);

onMounted(() => {
  const existing: any[] = form?.getFieldValue(props.name) || [];
  if (existing.length) {
    existing.forEach((s: any) => knownItems.set(s._id, s));
    selectedIds.value = existing.map((s: any) => s._id);
    initialOptions.value = existing;
  }
});

watch(shipments, () => form?.setFieldValue(props.name, shipments.value), {
  deep: true,
});

const onSelect = (option: any) => {
  if (option?.item?._id) knownItems.set(option.item._id, option.item);
};

const remove = (id: string) => {
  selectedIds.value = selectedIds.value.filter((sid) => sid !== id);
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
    <div :data-name="props.name" class="space-y-4">
      <BaseSelect
        multiple
        searchable
        v-model="selectedIds"
        url="/shipment/receivableShipment"
        label_key="shipmentCode"
        value_key="_id"
        label="Shipments"
        size="sm"
        :options="initialOptions"
        @select="onSelect"
        :attributes="{ placeholder: 'Search and select shipments...' }"
      />

      <div v-if="shipments.length" class="space-y-2">
        <div
          v-for="s in shipments"
          :key="s._id"
          class="flex items-center gap-4 bg-gray-50/50 px-5 py-4 rounded-2xl border border-gray-100"
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
            @click="remove(s._id)"
          >
            <i class="mdi mdi-close"></i>
          </button>
        </div>

        <div class="flex justify-end px-1 pt-1">
          <div class="bg-primary/5 rounded-2xl px-5 py-3 flex items-center gap-4">
            <span class="text-sm font-medium text-gray-600">Total:</span>
            <span class="text-lg font-bold text-primary">{{ currencyFormatter(total) }}</span>
          </div>
        </div>
      </div>
    </div>
  </InputParent>
</template>
