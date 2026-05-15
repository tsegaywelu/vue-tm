<template>
  <Form
    id="invoice-report-filter"
    @change="handleChange"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
  >
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Shipper"
      name="shipper"
      size="xs"
      value_key="_id"
      label_key="name"
      url="/shipper"
      :attributes="{ placeholder: 'Filter by Shipper' }"
    />
  </Form>
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";

const emit = defineEmits(["change"]);

const handleChange = (values: any) => {
  emit("change", { shipper: values.shipper || undefined });
};
</script>
