<template>
  <Form
    id="receivable-shipment-filter"
    @change="handleChange"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
  >
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Origin"
      multiple
      parent_class_name=""
      size="xs"
      :params="(values) => ({ sort: 'shipmentCount', q: undefined, ...(values.search ? { routeName: { regexAny: values.search } } : {}) })"
      name="routeOrigin"
      value_key="origin"
      label_key="routeName"
      :url="`/route`"
      :attributes="{ placeholder: 'Select Origin' }"
    />
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Destination"
      multiple
      parent_class_name=""
      size="xs"
      :params="(values) => ({ sort: 'shipmentCount', q: undefined, ...(values.search ? { routeName: { regexAny: values.search } } : {}) })"
      name="routeDestination"
      value_key="destination"
      label_key="routeName"
      :url="`/route`"
      :attributes="{ placeholder: 'Select Destination' }"
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
  </Form>
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";

const emit = defineEmits(["change"]);

const handleChange = (values: any) => {
  emit('change', {
    ...values,
    routeOrigin: values.routeOrigin?.length ? values.routeOrigin.join(',') : undefined,
    routeDestination: values.routeDestination?.length ? values.routeDestination.join(',') : undefined,
  });
};
</script>
