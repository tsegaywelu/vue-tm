<template>
  <div class="flex flex-col gap-8">
    <!-- Purchase Order Header -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SelectInput
        name="pr"
        label="Purchase Requisition (PR)"
        url="/purchase-requisitions"
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
        @select="handlePRSelect"
      />
      <SelectInput
        name="to"
        label="Supplier"
        url="/suppliers"
        label_key="name"
        value_key="_id"
        searchable
        :params="
          (state) => {
            return {
              name: {
                regex: state.search,
              },
              limit: undefined,
              page: undefined,
              q: undefined,
            };
          }
        "
        :validation="{ required }"
      />
      <Input
        name="date"
        label="Date"
        :attributes="{ type: 'date' }"
        :validation="{ required }"
      />
    </div>

    <!-- Items Section -->
    <div class="space-y-4">
      <component
        v-if="formContext?.form"
        :is="formContext.form.Subscribe"
        :selector="(state: any) => [state.values.pr]"
      >
        <template #default="[pr]">
          <div
            v-if="!pr"
            class="py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl text-gray-400"
          >
            Select a Purchase Requisition to see items
          </div>
          <div v-else class="space-y-8">
            <OrderItemsInput
              name="items"
              :pr-ref="formContext?.form?.state?.values?.prRef"
            />

            <!-- Summary & Taxes Section -->
            <div
              class="bg-gray-50/50 rounded-2xl p-8 border border-gray-100 shadow-sm mt-8"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <h4
                    class="text-sm font-bold text-gray-400 uppercase tracking-wider"
                  >
                    Taxation Settings
                  </h4>
                  <div
                    class="flex flex-col gap-6 p-6 bg-white rounded-2xl border border-gray-100"
                  >
                    <Checkbox
                      name="includeVAT"
                      label="Include Value Added Tax (VAT)"
                    />
                    <component
                      v-if="formContext?.form"
                      :is="formContext.form.Subscribe"
                      :selector="(state: any) => [state.values.includeVAT]"
                    >
                      <template #default="[includeVAT]">
                        <Input
                          v-if="includeVAT"
                          name="vatRate"
                          label="VAT Rate (%)"
                          type="number"
                          placeholder="15"
                        />
                      </template>
                    </component>
                  </div>
                </div>

                <div class="space-y-2">
                  <h4
                    class="text-sm font-bold text-gray-400 uppercase tracking-wider text-right"
                  >
                    Order Summary
                  </h4>
                  <div
                    class="bg-white rounded-2xl p-6 space-y-4 border border-gray-100 shadow-sm"
                  >
                    <component
                      v-if="formContext?.form"
                      :is="formContext.form.Subscribe"
                      :selector="
                        (state: any) => [
                          state.values.items,
                          state.values.includeVAT,
                          state.values.vatRate,
                        ]
                      "
                    >
                      <template #default="[items, includeVAT, vatRate]">
                        <div class="flex justify-between items-center text-sm">
                          <span class="text-gray-500 font-medium"
                            >Subtotal</span
                          >
                          <span class="font-bold text-gray-900">{{
                            currencyFormatter(calculateSubtotal(items))
                          }}</span>
                        </div>
                        <div
                          v-if="includeVAT"
                          class="flex justify-between items-center text-sm"
                        >
                          <span class="text-gray-500 font-medium"
                            >VAT ({{ vatRate }}%)</span
                          >
                          <span class="font-bold text-gray-900">{{
                            currencyFormatter(calculateVAT(items, vatRate))
                          }}</span>
                        </div>
                        <div
                          class="pt-4 border-t border-gray-100 flex justify-between items-center"
                        >
                          <span
                            class="font-bold text-gray-900 uppercase text-xs tracking-widest"
                            >Grand Total</span
                          >
                          <span class="text-2xl font-black text-primary">{{
                            currencyFormatter(
                              calculateGrandTotal(items, includeVAT, vatRate),
                            )
                          }}</span>
                        </div>
                      </template>
                    </component>
                  </div>
                </div>
              </div>
            </div>
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
import Checkbox from "@/components/form/Checkbox.vue";
import OrderItemsInput from "../inputs/OrderItemsInput.vue";
import { required } from "@/utils/validations";
import { currencyFormatter } from "@/utils/utils";

const formContext: any = inject("formContext");

const calculateSubtotal = (items: any[]) => {
  return (items || []).reduce((sum: number, item: any) => {
    return sum + (Number(item.quantity) * Number(item.price) || 0);
  }, 0);
};

const calculateVAT = (items: any[], vatRate: number) => {
  return calculateSubtotal(items) * (Number(vatRate || 0) / 100);
};

const calculateGrandTotal = (
  items: any[],
  includeVAT: boolean,
  vatRate: number,
) => {
  const subtotal = calculateSubtotal(items);
  const vat = includeVAT ? calculateVAT(items, vatRate) : 0;
  return subtotal + vat;
};

const handlePRSelect = (opt: any) => {
  const prData = opt.item;
  if (prData && formContext?.form) {
    const items =
      prData.items?.map((i: any) => ({
        item: i.item?._id || i.item || "",
        itemName: i.item?.name || "",
        quantity: i.quantity || 0,
        price: 0,
        remark: i.remark || "",
      })) || [];
    formContext.form.setFieldValue("prRef", prData.referenceNumber);
    formContext.form.setFieldValue("items", items);
  }
};
</script>
