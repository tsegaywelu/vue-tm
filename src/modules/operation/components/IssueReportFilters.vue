<template>
  <Form
    id="issue-report-filter"
    @change="(values) => emit('change', values)"
    class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto items-center"
  >
    <SelectInput
      label="Status"
      name="status"
      :options="statusOptions"
      placeholder="Status"
      size="xs"
      :show_validation_status="false"
    />
    <SelectInput
      label="Severity"
      name="severity"
      :options="severityOptions"
      placeholder="Severity"
      size="xs"
      :show_validation_status="false"
    />
  </Form>
</template>

<script setup lang="ts">
import Form from "@/components/form/Form.vue";
import SelectInput from "@/components/form/SelectInput.vue";

const emit = defineEmits(["change"]);

const statusOptions = [
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

const severityOptions = [
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Critical", value: "CRITICAL" },
];
</script>
