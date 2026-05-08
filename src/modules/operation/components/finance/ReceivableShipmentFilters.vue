<template>
  <Form
    id="receivable-shipment-filter"
    @change="handleChange"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex flex-wrap max-h-32 min-h-16 px-2 gap-2 overflow-auto"
  >
    <template #default="{ form }">
      <SelectInput
        :show_validation_status="false"
        label="Filter By"
        name="activeFilters"
        multiple
        size="xs"
        :options="[
          { label: 'Issue Voucher', value: 'shipperIssueVoucher' },
          { label: 'Shipper Receive Voucher', value: 'agentReceiveVoucher' },
          { label: 'Plate Number', value: 'vehiclePlateNumber' },
          { label: 'Shipment Code', value: 'shipmentCode' },
          { label: 'First Name', value: 'driverFirstName' },
          { label: 'Middle Name', value: 'driverMiddleName' },
        ]"
        :attributes="{ placeholder: 'Choose Filters' }"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('tripType')"
        :show_validation_status="false"
        label="Trip Type"
        name="tripType"
        size="xs"
        :options="[
          { label: 'All', value: '' },
          { label: 'Single Trip', value: 'single_trip' },
          { label: 'Round Trip', value: 'round_trip' }
        ]"
        :attributes="{ placeholder: 'Select Trip Type' }"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('productType')"
        :show_validation_status="false"
        label="Product Type"
        name="productType"
        size="xs"
        :options="[
          { label: 'All', value: '' },
          { label: 'Inbound', value: 'IN_BOUND' },
          { label: 'Outbound', value: 'OUT_BOUND' },
          { label: 'Site Transfer', value: 'SITE_TRANSFER' }
        ]"
        :attributes="{ placeholder: 'Select Product Type' }"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('shipper')"
        searchable
        :show_validation_status="false"
        label="Shipper"
        name="shipper"
        size="xs"
        label_key="name"
        value_key="_id"
        url="/shipper"
        :attributes="{ placeholder: 'Choose Shipper' }"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('origin')"
        searchable
        :show_validation_status="false"
        label="Origin"
        name="routeOrigin"
        size="xs"
        :params="{ q: undefined }"
        value_key="origin"
        label_key="origin"
        url="/route"
        :attributes="{ placeholder: 'Select Origin' }"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('destination')"
        searchable
        :show_validation_status="false"
        label="Destination"
        name="routeDestination"
        size="xs"
        :params="{ q: undefined }"
        value_key="destination"
        label_key="destination"
        url="/route"
        :attributes="{ placeholder: 'Select Destination' }"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('vehicleOwnership')"
        :show_validation_status="false"
        label="Vehicle Ownership"
        name="vehicleOwnership"
        size="xs"
        :options="[
          { label: 'All', value: '' },
          { label: 'Owned', value: 'Owned' },
          { label: 'LTSC', value: 'LTSC' },
          { label: 'STSC', value: 'STSC' }
        ]"
        :attributes="{ placeholder: 'Select Ownership' }"
      />

      <SelectInput
        v-if="form.state.values.activeFilters?.includes('documentUploaded')"
        :show_validation_status="false"
        label="Documents"
        name="documentUploaded"
        size="xs"
        :options="[
          { label: 'All', value: '' },
          { label: 'Uploaded', value: 'true' },
          { label: 'Not Uploaded', value: 'false' }
        ]"
        :attributes="{ placeholder: 'Select Uploaded' }"
      />
    </template>
  </Form>
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";

const emit = defineEmits(["change"]);

const handleChange = (values: any) => {
  const filters: any = { ...values };
  
  // Clean up values that are not in the active filters list
  const active = values.activeFilters || [];
  if (!active.includes('tripType')) delete filters.tripType;
  if (!active.includes('productType')) delete filters.productType;
  if (!active.includes('shipper')) delete filters.shipper;
  if (!active.includes('origin')) delete filters.routeOrigin;
  if (!active.includes('destination')) delete filters.routeDestination;
  if (!active.includes('vehicleOwnership')) delete filters.vehicleOwnership;
  if (!active.includes('documentUploaded')) delete filters.documentUploaded;
  
  delete filters.activeFilters;
  
  emit('change', filters);
};
</script>
