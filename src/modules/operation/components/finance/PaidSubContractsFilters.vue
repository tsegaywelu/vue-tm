<template>
  <Form
    id="paid-sub-contracts-filter"
    @change="handleChange"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[200px] *:shrink-0 px-2 gap-2 overflow-auto items-center"
  >
    <SelectInput
      :show_validation_status="false"
      label="Transporter"
      name="transporterType"
      size="xs"
      :options="[
        { label: 'All', value: '' },
        { label: 'LTSC', value: 'LTSC' },
        { label: 'STSC', value: 'STSC' }
      ]"
      :attributes="{ placeholder: 'Select Transporter' }"
    />

    <SelectInput
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
      :show_validation_status="false"
      label="Document Uploaded"
      name="areDocumentsUploaded"
      size="xs"
      :options="[
        { label: 'All', value: '' },
        { label: 'Uploaded', value: 'true' },
        { label: 'Not Uploaded', value: 'false' }
      ]"
      :attributes="{ placeholder: 'Select Status' }"
    />

    <SelectInput
      searchable
      :show_validation_status="false"
      label="Shipper"
      name="shipperName"
      size="xs"
      label_key="name"
      value_key="_id"
      url="/shipper"
      :attributes="{ placeholder: 'Select Shipper' }"
    />
  </Form>
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";

const emit = defineEmits(["change"]);

const handleChange = (values: any) => {
  emit('change', values);
};
</script>
