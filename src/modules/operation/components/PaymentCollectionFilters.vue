<template>
  <Form
    id="payment-collection-filter"
    @change="handleChange"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
  >
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Shipper"
      parent_class_name=""
      size="xs"
      name="shipper"
      value_key="_id"
      label_key="name"
      :url="`/shipper`"
      :attributes="{ placeholder: 'Select Shipper' }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Status"
      name="status"
      size="xs"
      :options="[
        { label: 'All', value: '' },
        { label: 'Approved', value: 'payment_approved' },
        { label: 'Collected', value: 'paid' },
        { label: 'Rejected', value: 'rejected' }
      ]"
      :attributes="{ placeholder: 'Select Status' }"
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
