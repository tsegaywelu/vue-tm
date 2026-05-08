<template>
  <Form
    id="expense-filter"
    @change="handleChange"
    :initial-values="initialValues"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 px-2 gap-2 overflow-auto items-center"
  >
    <DateInput
      :show_validation_status="false"
      label="Start Date"
      name="startDate"
      size="xs"
      :attributes="{ placeholder: 'Start Date' }"
    />
    <DateInput
      :show_validation_status="false"
      label="End Date"
      name="endDate"
      size="xs"
      :attributes="{ placeholder: 'End Date' }"
    />
  </Form>
</template>

<script setup lang="ts">
import DateInput from "@/components/form/DateInput.vue";
import Form from "@/components/form/Form.vue";

const emit = defineEmits(["change"]);

const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);

const initialValues = {
  startDate: oneMonthAgo.toISOString().split('T')[0],
  endDate: today.toISOString().split('T')[0],
};

const handleChange = (values: any) => {
  emit('change', {
    startDate: values.startDate ? new Date(values.startDate).toISOString() : undefined,
    endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
  });
};
</script>
