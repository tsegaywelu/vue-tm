<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Transfer Voucher Header"
        description="General information linked to a store requisition and recipient."
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
          <SelectInput
            name="type"
            label="Type"
            :options="[
              { label: 'Issue', value: 'ISSUE' },
              { label: 'Receive', value: 'RECEIVE' }
            ]"
            :validation="{ required }"
          />
          <SelectInput
            name="issuedToBody"
            label="Issued To Body"
            :options="[
              { label: 'Contact', value: 'CONTACT' },
              { label: 'Vehicle', value: 'VEHICLE' },
              { label: 'Store', value: 'STORE' }
            ]"
            :validation="{ required }"
          />
          
          <template v-if="form.state.values.issuedToBody === 'VEHICLE'">
            <SelectInput
              name="issuedToVehicle"
              label="Issued Vehicle"
              url="/vehicles"
              label_key="plateNumber"
              value_key="_id"
              searchable
              :validation="{ required }"
            />
          </template>
          
          <template v-if="form.state.values.issuedToBody === 'CONTACT'">
            <SelectInput
              name="issuedToContact"
              label="Issued To Contact"
              url="/contacts"
              label_key="name"
              value_key="_id"
              searchable
              :validation="{ required }"
            />
          </template>

          <SelectInput
            name="supplierName"
            label="Supplier"
            url="/suppliers"
            label_key="name"
            value_key="_id"
            searchable
          />

          <Input name="classification" label="Classification" />
          <Input name="creditSalesInvoiceNumber" label="Credit Sales Invoice No" />
          <Input name="cashSalesInvoiceNumber" label="Cash Sales Invoice No" />
        </div>
      </Colapsable>

      <Colapsable
        title="Transfer Items"
        description="List of items, serial numbers, and pricing."
        class="mt-6"
      >
        <div class="space-y-6">
          <div
            v-for="(item, index) in form.state.values.items"
            :key="index"
            class="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="flex flex-col gap-1.5 lg:col-span-1">
                <label class="text-sm font-medium text-gray-700">Item Name</label>
                <div class="h-12 px-4 flex items-center bg-white rounded-xl border border-gray-200 text-gray-700 font-medium truncate">
                  {{ getItemName(item.item) }}
                </div>
              </div>
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
                  {{ currencyFormatter(calculateItemTotalPrice(item)) }}
                </div>
              </div>

              <!-- Serialized Items Handling -->
              <template v-if="getItemType(item.item) === 'SERIALIZED'">
                <div class="col-span-full">
                  <div class="flex justify-between items-center mb-3">
                    <label class="text-sm font-medium text-gray-700">Serial Numbers</label>
                    <button
                      type="button"
                      @click="addSerial(index, form)"
                      class="text-xs text-primary font-bold hover:underline"
                    >
                      + Add Serial
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div v-for="(serial, sIndex) in item.serials" :key="sIndex" class="flex gap-2">
                      <div class="flex-1">
                        <!-- RECEIVE: Manual Input -->
                        <Input
                          v-if="form.state.values.type === 'RECEIVE'"
                          :name="`items[${index}].serials[${sIndex}]`"
                          :attributes="{ placeholder: 'Serial #' }"
                          :validation="{ required }"
                        />
                        <!-- ISSUE: Select from available -->
                        <SelectInput
                          v-else
                          :name="`items[${index}].serials[${sIndex}]`"
                          :url="`/inventory-items/available-serials?itemId=${item.item}`"
                          label_key="serialNumber"
                          value_key="serialNumber"
                          :validation="{ required }"
                        />
                      </div>
                      <button
                        type="button"
                        @click="removeSerial(index, sIndex, form)"
                        class="size-10 flex items-center justify-center text-error-500 hover:bg-error-50 rounded-xl"
                      >
                        <i v-html="icons.delete" class="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </template>

              <!-- Consumable Items Handling -->
              <template v-else>
                <Input
                  :name="`items[${index}].quantity`"
                  label="Quantity"
                  type="number"
                  :attributes="{ placeholder: '0.00', step: '0.01' }"
                  :validation="{ required }"
                />
              </template>

              <div class="col-span-full">
                <Input
                  :name="`items[${index}].remark`"
                  label="Remark"
                  :attributes="{ placeholder: 'Enter remark' }"
                />
              </div>
            </div>
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
import { useQuery } from "@tanstack/vue-query";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
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

// Fetch all items for name and type lookup
const { data: itemsResponse } = useQuery({
  queryKey: ["inventory-items-all"],
  queryFn: () => fetch_inventory_items({ limit: 1000 }),
});

const getItemName = (id: string) => {
  const item = itemsResponse.value?.data?.results?.find((i: any) => i._id === id);
  return item?.name || "Loading...";
};

const getItemType = (id: string) => {
  const item = itemsResponse.value?.data?.results?.find((i: any) => i._id === id);
  return item?.inventoryType || "CONSUMABLE";
};

const handleSRVSelect = (opt: any, form: any) => {
  const srvData = opt.item;
  if (srvData) {
    const items = srvData.items?.map((i: any) => {
      const iType = i.inventoryItem?.inventoryType || "CONSUMABLE";
      return {
        item: i.inventoryItem?._id || i.item?._id || i.item || "",
        price: 0,
        quantity: iType === 'SERIALIZED' ? 0 : (i.approvedQuantity || i.quantity || 0),
        serials: iType === 'SERIALIZED' ? [""] : [],
        totalPrice: 0,
        remark: i.remark || "",
      };
    }) || [];
    form.setFieldValue("items", items);
  }
};

const addSerial = (itemIndex: number, form: any) => {
  const items = [...form.state.values.items];
  items[itemIndex].serials.push("");
  form.setFieldValue("items", items);
};

const removeSerial = (itemIndex: number, serialIndex: number, form: any) => {
  const items = [...form.state.values.items];
  items[itemIndex].serials.splice(serialIndex, 1);
  form.setFieldValue("items", items);
};

const calculateItemTotalPrice = (item: any) => {
  const iType = getItemType(item.item);
  if (iType === 'SERIALIZED') {
    return (item.serials?.length || 0) * (item.price || 0);
  }
  return (item.quantity || 0) * (item.price || 0);
};

const handleSubmit = async (values: any) => {
  const processedItems = values.items.map((item: any) => {
    const totalPrice = calculateItemTotalPrice(item);
    const iType = getItemType(item.item);
    return {
      ...item,
      quantity: iType === 'SERIALIZED' ? item.serials.length : item.quantity,
      totalPrice: totalPrice,
    };
  });
  
  await props.onSubmit({
    ...values,
    items: processedItems,
  });
};
</script>
