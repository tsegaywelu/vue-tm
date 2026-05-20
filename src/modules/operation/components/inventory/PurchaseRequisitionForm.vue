<template>
  <div class="flex flex-col gap-8">
    <!-- Purchase Requisition Header -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SelectInput
        name="srv"
        label="Store Requisition (SRV)"
        url="/store-requisition-vouchers"
        label_key="referenceNumber"
        value_key="_id"
        searchable
        :params="
          (state) => {
            return {
              referenceNumber: {
                regexAny: state.search,
              },
              q: undefined,
            };
          }
        "
        :validation="{ required }"
        @select="handleSRVSelect"
      />
      <DateInput
        name="date"
        label="Date"
        :attributes="{ placeholder: 'Enter date' }"
        :validation="{ required }"
      />
      <component
        v-if="formContext?.form"
        :is="formContext.form.Subscribe"
        :selector="(state: any) => [state.values.approvedSTRDate]"
      >
        <template #default="[approvedSTRDate]">
          <div class="flex flex-col gap-1.5 justify-end">
            <label class="text-sm font-medium text-gray-700"
              >Approved STR Date</label
            >
            <div
              class="h-12 px-4 flex items-center bg-gray-50 rounded-xl border border-gray-100 text-gray-500 font-medium"
            >
              {{
                approvedSTRDate
                  ? new Date(approvedSTRDate).toLocaleDateString()
                  : "-"
              }}
            </div>
          </div>
        </template>
      </component>
    </div>

    <div class="space-y-4">
      <component
        v-if="formContext?.form"
        :is="formContext.form.Subscribe"
        :selector="(state: any) => [state.values.srv]"
      >
        <template #default="[srv]">
          <div
            v-if="!srv"
            class="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400"
          >
            Select a Store Requisition to see items
          </div>
          <div v-else class="space-y-6">
            <PurchaseItemsInput
              name="items"
              :srv-ref="formContext.form.state.values.srvRef"
            />
          </div>
        </template>
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import PurchaseItemsInput from "../inputs/PurchaseItemsInput.vue";
import { required } from "@/utils/validations";
import DateInput from "@/components/form/DateInput.vue";

const formContext: any = inject("formContext");

const handleSRVSelect = (opt: any) => {
  const srvData = opt.item;
  if (srvData && formContext?.form) {
    formContext.form.setFieldValue(
      "approvedSTRDate",
      srvData.approvedAt || srvData.date,
    );
    formContext.form.setFieldValue("srvRef", srvData.referenceNumber);
    const items =
      srvData.items?.map((i: any) => ({
        item: i.inventoryItem?._id || i.item?._id || i.item || "",
        itemName: i.inventoryItem?.name || i.item?.name || "",
        quantity: i.approvedQuantity || i.quantity || 0,
        remainingQuantity: i.approvedQuantity || i.quantity || 0,
        leadTime: "",
        remark: i.remark || "",
      })) || [];
    formContext.form.setFieldValue("items", items);
  }
};
</script>
