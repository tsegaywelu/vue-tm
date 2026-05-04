<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Item Information"
        description="General details about the inventory item."
      >
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
            :options="itemGroupOptions"
            :validation="{ required }"
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
      </Colapsable>

      <!-- Serialized Items Section -->
      <Colapsable
        v-if="form.state.values.inventoryType === 'SERIALIZED'"
        title="Serialized Item Details"
        description="Manage serial numbers and pricing for each unit."
        class="mt-6"
      >
        <div class="flex items-center gap-3 mb-6">
          <Checkbox
            name="isTyre"
            label="Mark as Tyre Item"
          />
          <span class="text-gray-400 text-xs">(Enables tyre handoff tracking)</span>
        </div>

        <div class="space-y-4">
          <div
            v-for="(serial, index) in serialNumbers"
            :key="index"
            class="flex items-end gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100"
          >
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-gray-700">Serial Number {{ index + 1 }} <span class="text-error-500">*</span></label>
                <input
                  v-model="serialNumbers[index].serialNumber"
                  type="text"
                  placeholder="Enter serial number"
                  class="h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-gray-700">Price <span class="text-error-500">*</span></label>
                <input
                  v-model="serialNumbers[index].price"
                  type="number"
                  placeholder="0.00"
                  class="h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  required
                />
              </div>
            </div>
            <div class="flex gap-2">
              <button
                type="button"
                @click="addSerial"
                class="size-12 flex items-center justify-center bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
              >
                <i v-html="icons.plus" class="size-6" />
              </button>
              <button
                v-if="serialNumbers.length > 1"
                type="button"
                @click="removeSerial(index)"
                class="size-12 flex items-center justify-center bg-error-50 text-error-600 rounded-xl hover:bg-error-100 transition-colors"
              >
                <i v-html="icons.delete" class="size-6" />
              </button>
            </div>
          </div>
        </div>
      </Colapsable>

      <!-- Consumable Items Section -->
      <Colapsable
        v-if="form.state.values.inventoryType === 'CONSUMABLE'"
        title="Consumable Item Details"
        description="Set quantity and pricing for consumable inventory."
        class="mt-6"
      >
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
            <label class="text-sm font-medium text-gray-700">Total Price</label>
            <div class="h-12 px-4 flex items-center bg-gray-50 rounded-xl border border-gray-100 text-gray-500 font-bold">
              {{ formatCurrency((form.state.values.price || 0) * (form.state.values.quantity || 0)) }}
            </div>
          </div>
        </div>
      </Colapsable>

      <!-- Action Footer -->
      <div class="pt-10 flex justify-end gap-4">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/SelectInput.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";
import { fetch_item_groups } from "../../api/inventory.api";
import { icons } from "@/utils/icons";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const serialNumbers = ref<any[]>(props.initialValues.serialPrices || [{ serialNumber: "", price: "" }]);

// Watch for initialValues changes (e.g. when data is loaded in Edit page)
watch(() => props.initialValues, (newVals) => {
  if (newVals.serialPrices) {
    serialNumbers.value = [...newVals.serialPrices];
  }
}, { deep: true });

const addSerial = () => {
  serialNumbers.value.push({ serialNumber: "", price: "" });
};

const removeSerial = (index: number) => {
  serialNumbers.value.splice(index, 1);
};

// Fetch item groups
const { data: itemGroupsResponse } = useQuery({
  queryKey: ["item-groups-all"],
  queryFn: () => fetch_item_groups({ limit: 100 }),
});

const itemGroupOptions = computed(() => {
  const groups = itemGroupsResponse.value?.data?.results || [];
  return groups.map((g: any) => ({
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
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
};

const handleSubmit = async (values: any) => {
  const finalValues = { ...values };
  if (values.inventoryType === 'SERIALIZED') {
    finalValues.serialPrices = serialNumbers.value;
    finalValues.reorderLevel = 1;
  } else {
    finalValues.totalPrice = (values.price || 0) * (values.quantity || 0);
  }
  await props.onSubmit(finalValues);
};
</script>
