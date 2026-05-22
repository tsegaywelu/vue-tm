<template>
  <div class="flex flex-col gap-6">
    <!-- Item Information Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Input
        name="name"
        label="Name"
        :attributes="{ placeholder: 'Enter item name' }"
        :validation="{ required }"
      />
      <Input
        name="codeNumber"
        label="Code Number"
        :attributes="{ placeholder: 'Enter code number' }"
      />
      <Input
        name="partNumber"
        label="Part Number"
        :attributes="{ placeholder: 'Enter part number' }"
      />
      <Select
        name="itemGroup"
        label="Item Group"
        url="/item-groups"
        :validation="{ required }"
        searchable
        label_key="name"
        value_key="_id"
        :params="
          (params) => {
            return {
              q: undefined,
              'name[regex]': params.search,
            };
          }
        "
      />
      <Select
        name="inventoryType"
        label="Inventory Type"
        :options="inventoryTypeOptions"
        :validation="{ required }"
      />
      <Select
        name="uom"
        label="Unit of Measurement (UoM)"
        :options="uomOptions"
        :validation="{ required }"
      />
    </div>

    <component
      v-if="formContext?.form"
      :is="formContext.form.Subscribe"
      :selector="(state: any) => [state.values.inventoryType]"
    >
      <template #default="[inventoryType]">
        <div v-if="inventoryType === 'SERIALIZED'" class="flex flex-col gap-4">
          <div class="flex items-center gap-3 px-2">
            <Checkbox name="isTyre" label="Mark as Tyre Item" />
            <span class="text-gray-400 text-xs"
              >(Enables tyre handoff tracking)</span
            >
          </div>
          <SerialNumbersInput v-if="!isEdit" name="serialPrices" />
        </div>
      </template>
    </component>
    <!-- Serialized Items Section -->

    <!-- Consumable Items Section (add only) -->
    <component
      v-if="formContext?.form && !isEdit"
      :is="formContext.form.Subscribe"
      :selector="(state: any) => [state.values.inventoryType, state.values.price, state.values.quantity]"
    >
      <template #default="[inventoryType, price, quantity]">
        <div
          v-if="inventoryType === 'CONSUMABLE'"
          class="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100"
        >
          <div>
            <h3 class="text-sm font-bold text-gray-900">
              Consumable Item Details
            </h3>
            <p class="text-xs text-gray-500 mb-4">
              Set quantity and pricing for consumable inventory.
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="quantity"
              label="Initial Quantity"
              type="number"
              :attributes="{ placeholder: '0.00', step: '0.01' }"
              :validation="{ required }"
            />
            <Input
              name="reorderLevel"
              label="Reorder Level"
              type="number"
              :attributes="{ placeholder: '0' }"
            />
            <Input
              name="price"
              label="Unit Price"
              type="number"
              :attributes="{ placeholder: '0.00', step: '0.01' }"
              :validation="{ required }"
            />
            <div class="flex flex-col gap-1.5 justify-end">
              <label class="text-sm font-medium text-gray-700"
                >Total Price</label
              >
              <div
                class="h-12 px-4 flex items-center bg-white rounded-xl border border-gray-100 text-gray-500 font-bold"
              >
                {{ formatCurrency((Number(price) || 0) * (Number(quantity) || 0)) }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </component>

    <!-- Reorder Level (edit only, consumable) -->
    <component
      v-if="formContext?.form && isEdit"
      :is="formContext.form.Subscribe"
      :selector="(state: any) => [state.values.inventoryType]"
    >
      <template #default="[inventoryType]">
        <div
          v-if="inventoryType === 'CONSUMABLE'"
          class="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100"
        >
          <h3 class="text-sm font-bold text-gray-900 mb-4">Consumable Item Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              name="reorderLevel"
              label="Reorder Level"
              type="number"
              :attributes="{ placeholder: '0' }"
            />
          </div>
        </div>
      </template>
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { useQuery } from "@tanstack/vue-query";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/SelectInput.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import SerialNumbersInput from "../inputs/SerialNumbersInput.vue";
import { required } from "@/utils/validations";
import { fetch_item_groups } from "../../api/inventory.api";

const props = defineProps<{
  values: Record<string, any>;
  isEdit?: boolean;
}>();

// Fetch item groups
const { data: itemGroupsResponse } = useQuery({
  queryKey: ["item-groups-all"],
  queryFn: () => fetch_item_groups({ limit: 100 }),
});

const formContext: any = inject("formContext") as any;

const itemGroupOptions = computed(() => {
  const groups =
    itemGroupsResponse.value?.data?.results ||
    itemGroupsResponse.value?.data?.result ||
    itemGroupsResponse.value?.data ||
    [];
  return (Array.isArray(groups) ? groups : []).map((g: any) => ({
    label: g.name,
    value: g._id,
  }));
});

const inventoryTypeOptions = [
  { label: "Consumable", value: "CONSUMABLE" },
  { label: "Serialized", value: "SERIALIZED" },
];

const uomOptions = [
  { label: "Liters", value: "liters" },
  { label: "Kilogram", value: "kilogram" },
  { label: "Pieces", value: "pieces" },
  { label: "Meters", value: "meters" },
  { label: "Ream", value: "ream" },
  { label: "Packet", value: "packet" },
  { label: "Set", value: "set" },
];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ETB",
  }).format(val);
};
</script>
