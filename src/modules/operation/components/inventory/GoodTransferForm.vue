<template>
  <div class="flex flex-col gap-8">
    <!-- Transfer Voucher Header -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SelectInput
        name="srv"
        label="Store Requisition (SRV)"
        url="/store-requisition-vouchers"
        label_key="referenceNumber"
        value_key="_id"
        searchable
        :validation="{ required }"
        @select="handleSRVSelect"
      />
      <SelectInput
        name="type"
        label="Type"
        :options="[
          { label: 'Issue', value: 'ISSUE' },
          { label: 'Receive', value: 'RECEIVE' },
        ]"
        :validation="{ required }"
      />
      <SelectInput
        name="issuedToBody"
        label="Issued To Body"
        :options="[
          { label: 'Contact', value: 'CONTACT' },
          { label: 'Vehicle', value: 'VEHICLE' },
          { label: 'Store', value: 'STORE' },
        ]"
        :validation="{ required }"
      />

      <component
        v-if="formContext?.form"
        :is="formContext.form.Subscribe"
        :selector="(state: any) => [state.values.issuedToBody]"
      >
        <template #default="[issuedToBody]">
          <SelectInput
            v-if="issuedToBody === 'VEHICLE'"
            name="issuedToVehicle"
            label="Issued Vehicle"
            url="/vehicle"
            label_key="plateNumber"
            value_key="_id"
            searchable
            :validation="{ required }"
          />
          <ContactInput
            v-if="issuedToBody === 'CONTACT'"
            name="issuedToContact"
            label="Issued To Contact"
            :validation="{ required }"
          />
        </template>
      </component>

      <SelectInput
        name="supplier"
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

    <!-- Items Section -->
    <div class="space-y-4">
      <component
        v-if="formContext?.form"
        :is="formContext.form.Subscribe"
        :selector="(state: any) => [state.values.srv, state.values.type]"
      >
        <template #default="[srv, type]">
          <div class="space-y-6">
            <TransferItemsInput name="items" :type="type || 'ISSUE'" />
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
import ContactInput from "@/components/common/inputs/ContactInput.vue";
import TransferItemsInput from "../inputs/TransferItemsInput.vue";
import { required } from "@/utils/validations";

const formContext: any = inject("formContext");

const handleSRVSelect = (opt: any) => {
  const srvData = opt.item;
  if (srvData && formContext?.form) {
    const items =
      srvData.items?.map((i: any) => {
        const iType = i.inventoryItem?.inventoryType || "CONSUMABLE";
        const hasSerials = iType === "SERIALIZED";
        return {
          item: i.inventoryItem?._id || i.item?._id || i.item || "",
          itemName: i.inventoryItem?.name || i.item?.name || "Unknown Item",
          inventoryType: iType,
          hasSerials,
          price: 0,
          quantity: hasSerials ? 0 : i.approvedQuantity || i.quantity || 0,
          serials: hasSerials ? [""] : [],
          remark: i.remark || "",
        };
      }) || [];
    formContext.form.setFieldValue("items", items);
  }
};
</script>
