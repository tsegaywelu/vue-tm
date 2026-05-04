<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Requisition Header"
        description="General information about the requisition voucher."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Input
            name="date"
            label="Date"
            :attributes="{ type: 'date' }"
            :validation="{ required }"
          />
          <Input
            name="requiredDate"
            label="Required Date"
            :attributes="{ type: 'date' }"
            :validation="{ required }"
          />
          <Select
            name="department"
            label="Department"
            :options="departmentOptions"
            :validation="{ required }"
          />
          <Input
            name="classification"
            label="Classification"
            :attributes="{ placeholder: 'Enter classification' }"
          />
          <Input
            name="costCenter"
            label="Cost Center"
            :attributes="{ placeholder: 'Enter cost center' }"
          />
          <Input
            name="siv"
            label="SIV"
            :attributes="{ placeholder: 'Enter SIV' }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Requested Items"
        description="List of items and quantities requested."
        class="mt-6"
      >
        <div class="space-y-6">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SelectInput
                :name="`items[${index}].item`"
                label="Select Item"
                url="/inventory-items"
                label_key="name"
                value_key="_id"
                searchable
                :validation="{ required }"
                @select="(opt) => handleItemSelect(index, opt)"
              />
              <Input
                :name="`items[${index}].quantity`"
                label="Quantity"
                type="number"
                :attributes="{ placeholder: '0.00', step: '0.01' }"
                :validation="{ required }"
              />
              <Input
                :name="`items[${index}].remark`"
                label="Remark"
                :attributes="{ placeholder: 'Enter remark' }"
              />
            </div>
            
            <!-- Remove Button -->
            <button
              v-if="items.length > 1"
              type="button"
              @click="removeItem(index)"
              class="absolute -top-3 -right-3 size-8 bg-white border border-gray-100 text-error-600 rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-50"
            >
              <i v-html="icons.delete" class="size-4" />
            </button>
          </div>

          <button
            type="button"
            @click="addItem"
            class="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 font-medium hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
          >
            <i v-html="icons.plus" class="size-5" />
            Add Another Item
          </button>
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
import { ref, watch } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/SelectInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const items = ref<any[]>(props.initialValues.items || [{ item: "", quantity: 1, remark: "" }]);

// Sync items if initialValues change
watch(() => props.initialValues, (newVals) => {
  if (newVals.items) {
    items.value = [...newVals.items];
  }
}, { deep: true });

const addItem = () => {
  items.value.push({ item: "", quantity: 1, remark: "" });
};

const removeItem = (index: number) => {
  items.value.splice(index, 1);
};

const handleItemSelect = (index: number, opt: any) => {
  // Can be used to auto-populate other fields if needed
};

const departmentOptions = [
  { label: "Operation", value: "Operation" },
  { label: "Finance", value: "Finance" },
  { label: "Maintenance", value: "Maintenance" },
  { label: "Management", value: "Management" },
  { label: "Human Resource", value: "Human Resource" },
  { label: "IT", value: "IT" },
];

const handleSubmit = async (values: any) => {
  // The values.items will already be populated correctly by the indexed input names
  await props.onSubmit(values);
};
</script>
