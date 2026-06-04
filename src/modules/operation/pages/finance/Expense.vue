<template>
  <Teleport to="#page-actions" defer>
    <div class="hidden sm:flex">
      <DateRangePicker
        v-model="dateRange"
        pagination-id="expense-list"
        start-key="startDate"
        end-key="endDate"
      />
    </div>
  </Teleport>

  <Teleport defer to="#page-title-actions">
    <button
      class="sm:hidden size-8 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
      @click="showFilterSheet = true"
    >
      <i v-html="icons.calender"></i>
    </button>
  </Teleport>

  <BottomSheet v-model="showFilterSheet" title="Date Range">
    <DatePicker
      is-range
      :value="dateRange"
      @select="(val) => { if (val?.start) { dateRange.start = toISOString(new Date(val.start)); dateRange.end = val.end ? toISOString(new Date(val.end)) : ''; if (val.end) showFilterSheet = false; } }"
    />
  </BottomSheet>
  <ExpenseTable
    :filters="{ startDate: dateRange.start, endDate: dateRange.end }"
    @action="handleExpenseAction"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import DateRangePicker from "@/components/common/DateRangePicker.vue";
import DatePicker from "@/components/DatePicker.vue";
import ExpenseTable from "../../components/ExpenseTable.vue";
import { icons } from "@/utils/icons";
import BottomSheet from "@/components/BottomSheet.vue";

const toISOString = (d: Date) => d.toISOString();
const now = new Date();
const oneMonthAgo = new Date(now);
oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

const showFilterSheet = ref(false);

const dateRange = ref({
  start: toISOString(oneMonthAgo),
  end: toISOString(now),
});

const handleExpenseAction = ({ row, action }: any) => {
  if (action === "view") {
    console.log(`View expense details for:`, row);
  } else {
    console.log(`Action: ${action} on Expense:`, row);
  }
};
</script>
