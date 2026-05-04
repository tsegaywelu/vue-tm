<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Purchase Order Header"
        description="General information linked to a purchase requisition and supplier."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectInput
            name="pr"
            label="Purchase Requisition (PR)"
            url="/purchase-requisitions"
            :params="{ status: 'APPROVED' }"
            label_key="referenceNumber"
            value_key="_id"
            searchable
            :validation="{ required }"
            @select="(opt) => handlePRSelect(opt, form)"
          />
          <SelectInput
            name="to"
            label="Supplier"
            url="/suppliers"
            label_key="name"
            value_key="_id"
            searchable
            :validation="{ required }"
          />
          <Input
            name="date"
            label="Date"
            :attributes="{ type: 'date' }"
            :validation="{ required }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Ordered Items"
        description="List of items, quantities, and pricing."
        class="mt-6"
      >
        <div class="space-y-6">
          <div
            v-for="(item, index) in form.state.values.items"
            :key="index"
            class="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="flex flex-col gap-1.5 lg:col-span-1">
                <label class="text-sm font-medium text-gray-700">Item Name</label>
                <div class="h-12 px-4 flex items-center bg-white rounded-xl border border-gray-200 text-gray-700 font-medium truncate">
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
                :name="`items[${index}].price`"
                label="Unit Price"
                type="number"
                :attributes="{ placeholder: '0.00', step: '0.01' }"
                :validation="{ required }"
              />
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-medium text-gray-700">Total Price</label>
                <div class="h-12 px-4 flex items-center bg-gray-100 rounded-xl border border-gray-100 text-gray-500 font-bold">
                  {{ currencyFormatter((item.quantity || 0) * (item.price || 0)) }}
                </div>
              </div>
              <div class="col-span-full">
                <Input
                  :name="`items[${index}].remark`"
                  label="Remark"
                  :attributes="{ placeholder: 'Enter remark' }"
                />
              </div>
            </div>
            
            <button
              v-if="form.state.values.items.length > 1"
              type="button"
              @click="removeItem(index, form)"
              class="absolute -top-3 -right-3 size-8 bg-white border border-gray-100 text-error-600 rounded-full shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-50"
            >
              <i v-html="icons.delete" class="size-4" />
            </button>
          </div>

          <div v-if="!form.state.values.pr" class="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
            Select a Purchase Requisition to see items
          </div>
        </div>
      </Colapsable>

      <!-- Totals & VAT Section -->
      <Colapsable
        title="Summary & Taxes"
        description="Calculate subtotal, VAT, and grand total."
        class="mt-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div class="space-y-6">
            <div class="flex items-center gap-3">
              <Checkbox
                name="includeVAT"
                label="Include VAT"
                @change="(val) => handleVATToggle(val, form)"
              />
              <span class="text-gray-400 text-xs">(Apply {{ form.state.values.vatRate }}% VAT)</span>
            </div>
            <Input
              name="vatRate"
              label="VAT Rate (%)"
              type="number"
              :attributes="{ placeholder: '15' }"
              :disabled="!form.state.values.includeVAT"
            />
          </div>

          <div class="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
            <div class="flex justify-between items-center text-sm">
              <span class="text-gray-500">Subtotal</span>
              <span class="font-semibold text-gray-900">{{ currencyFormatter(calculateSubtotal(form)) }}</span>
            </div>
            <div v-if="form.state.values.includeVAT" class="flex justify-between items-center text-sm">
              <span class="text-gray-500">VAT ({{ form.state.values.vatRate }}%)</span>
              <span class="font-semibold text-gray-900">{{ currencyFormatter(calculateVAT(form)) }}</span>
            </div>
            <div class="pt-4 border-t border-gray-200 flex justify-between items-center">
              <span class="font-bold text-gray-900">Grand Total</span>
              <span class="text-xl font-bold text-primary">{{ currencyFormatter(calculateGrandTotal(form)) }}</span>
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
import { ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";
import { fetch_inventory_items } from "../../api/inventory.api";
import { currencyFormatter } from "@/utils/utils";


const props = defineProps<{
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

const handlePRSelect = (opt: any, form: any) => {
  const prData = opt.item;
  if (prData) {
    const items = prData.items?.map((i: any) => ({
      item: i.item?._id || i.item || "",
      quantity: i.quantity || 0,
      price: 0,
      totalPrice: 0,
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

const handleVATToggle = (val: boolean, form: any) => {
  form.setFieldValue("includeVAT", val);
};

const calculateSubtotal = (form: any) => {
  return (form.state.values.items || []).reduce((sum: number, item: any) => {
    return sum + (item.quantity * item.price || 0);
  }, 0);
};

const calculateVAT = (form: any) => {
  if (!form.state.values.includeVAT) return 0;
  return calculateSubtotal(form) * (form.state.values.vatRate / 100);
};

const calculateGrandTotal = (form: any) => {
  return calculateSubtotal(form) + calculateVAT(form);
};

const handleSubmit = async (values: any) => {
  const subtotal = calculateSubtotal({ state: { values } });
  const vat = calculateVAT({ state: { values } });
  const finalValues = {
    ...values,
    items: values.items.map((i: any) => ({
      ...i,
      totalPrice: i.quantity * i.price,
    })),
    total: subtotal,
    vat: vat,
    grandTotal: subtotal + vat,
  };
  await props.onSubmit(finalValues);
};
</script>
