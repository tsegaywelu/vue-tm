<template>
  <Form
    id="receivable-settlement-filter"
    @change="handleChange"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
  >
    <SelectInput
      :show_validation_status="false"
      label="Status"
      name="payableType"
      size="xs"
      :options="payableTypeOptions"
      :attributes="{ placeholder: 'Select Status' }"
    />
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
      label_key="origin"
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
      label_key="destination"
      :url="`/route`"
      :attributes="{ placeholder: 'Select Destination' }"
    />
  </Form>
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";

const emit = defineEmits(["change"]);

const payableTypeOptions = [
  { label: 'All', value: '' },
  { label: 'Driver Advance', value: 'advancePayment' },
  { label: 'Transporter Advance', value: 'prePayments' },
  { label: 'Settlement', value: 'settlement' }
];

const routeParams = (values: any) => ({ 
  sort: 'shipmentCount', 
  q: undefined, 
  ...(values.search ? { routeName: { regexAny: values.search } } : {}) 
});

const handleChange = (values: any) => {
  emit('change', {
    ...values,
    payableType: values.payableType || undefined,
    routeOrigin: values.routeOrigin?.length ? values.routeOrigin.join(',') : undefined,
    routeDestination: values.routeDestination?.length ? values.routeDestination.join(',') : undefined,
  });
};
</script>
