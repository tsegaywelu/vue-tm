<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Purchase Requisition Header"
        description="General information linked to a store requisition."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectInput
            name="srv"
            label="Store Requisition (SRV)"
            url="/store-requisition-vouchers"
            :params="{ status: 'APPROVED' }"
            label_key="referenceNumber"
            value_key="_id"
            searchable
            :validation="{ required }"
            @select="(opt) => handleSRVSelect(opt, form)"
          />
          <Input
            name="date"
            label="Date"
            :attributes="{ type: 'date' }"
            :validation="{ required }"
          />
          <div class="flex flex-col gap-1.5 justify-end">
            <label class="text-sm font-medium text-gray-700">Approved STR Date</label>
            <div class="h-12 px-4 flex items-center bg-gray-50 rounded-xl border border-gray-100 text-gray-500 font-medium">
              {{ form.state.values.approvedSTRDate ? new Date(form.state.values.approvedSTRDate).toLocaleDateString() : '-' }}
            </div>
          </div>
        </div>
      </Colapsable>

      <Colapsable
        title="Items to Purchase"
        description="List of items and quantities from the selected store requisition."
        class="mt-6"
      >
        <div class="space-y-6">
          <div
            v-for="(item, index) in form.state.values.items"
            :key="index"
            class="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-gray-700">Item Name</label>
                <div class="h-12 px-4 flex items-center bg-white rounded-xl border border-gray-200 text-gray-700 font-medium">
                  {{ getItemName(item.item) }}
                </div>
              </div>
              <Input
                :name="`items[${index}].quantity`"
                label="Quantity"
                type="number"
                :attributes="{ placeholder: '0.00', step: '0.01' }"
                :validation="{ required }"
              />
              <Input
                :name="`items[${index}].leadTime`"
                label="Lead Time"
                :attributes="{ placeholder: 'e.g. 2 weeks' }"
              />
              <div class="col-span-full">
                <Input
                  :name="`items[${index}].remark`"
                  label="Remark"
                  :attributes="{ placeholder: 'Enter remark' }"
                />
              </div>
            </div>
            
            <!-- Remove Button -->
            <button
              v-if="form.state.values.items.length > 1"
              type="button"
              @click="removeItem(index, form)"
              class="absolute -top-3 -right-3 size-8 bg-white border border-gray-100 text-error-600 rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-50"
            >
              <i v-html="icons.delete" class="size-4" />
            </button>
          </div>

          <div v-if="!form.state.values.srv" class="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
            Select a Store Requisition to see items
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
import { ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";
import { fetch_inventory_items } from "../../api/inventory.api";

defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

// Fetch all items for name lookup
const { data: itemsResponse } = useQuery({
  queryKey: ["inventory-items-all"],
  queryFn: () => fetch_inventory_items({ limit: 1000 }),
});

const getItemName = (id: string) => {
  const item = itemsResponse.value?.data?.results?.find((i: any) => i._id === id);
  return item?.name || "Loading...";
};

const handleSRVSelect = (opt: any, form: any) => {
  const srvData = opt.item;
  if (srvData) {
    form.setFieldValue("approvedSTRDate", srvData.approvedAt || srvData.date);
    const items = srvData.items?.map((i: any) => ({
      item: i.inventoryItem?._id || i.item?._id || i.item || "",
      quantity: i.approvedQuantity || i.quantity || 0,
      remainingQuantity: i.approvedQuantity || i.quantity || 0,
      leadTime: "",
      remark: i.remark || "",
    })) || [];
    form.setFieldValue("items", items);
  }
};

const removeItem = (index: number, form: any) => {
  const currentItems = [...form.state.values.items];
  currentItems.splice(index, 1);
  form.setFieldValue("items", currentItems);
};

const handleSubmit = async (values: any) => {
  await props.onSubmit(values);
};
</script>
