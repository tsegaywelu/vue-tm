<template>
  <Teleport to="#page-actions" defer>
    <DateRangePicker
      v-model="dateRange"
      pagination-id="expense-list"
      start-key="startDate"
      end-key="endDate"
    />
  </Teleport>
  <ExpenseTable
    :filters="{ startDate: dateRange.start, endDate: dateRange.end }"
    @action="handleExpenseAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import DateRangePicker from "@/components/common/DateRangePicker.vue";
import ExpenseTable from "../../components/ExpenseTable.vue";

const now = new Date();
const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
const toISO = (d: Date) => d.toISOString().split("T")[0];

const dateRange = ref({
  start: toISO(firstOfMonth),
  end: toISO(lastOfMonth),
});

const handleExpenseAction = ({ row, action }: any) => {
  if (action === "view") {
    console.log(`View expense details for:`, row);
  } else {
    console.log(`Action: ${action} on Expense:`, row);
  }
};
</script>
