<template>
   <Teleport to="#page-actions" defer>
      <div class="items-center gap-4 inline-flex border-l border-grey-100 overflow-x-auto px-3">
        <Dropdown
          contentParent="shadow-none! ring-0! ring-offset-0! p-0! bg-tras border-none! bg-none!"
        >
          <template #trigger>
            <Button
              variant="secondary"
              class="rounded-2xl h-[46px] px-4 gap-2 border border-gray-100"
            >
              <i class="mdi mdi-calendar-range text-lg text-primary"></i>
              <span class="text-sm font-bold text-gray-700">
                {{ dateRange.start || 'Start' }} - to - {{ dateRange.end || "End" }}
              </span>
            </Button>
          </template>
          <template #default>
            <DatePicker
              is-range
              :value="dateRange"
              @select="handleDateSelect"
            />
          </template>
        </Dropdown>
        <!-- <ExpenseFilters @change="handleFilterChange" /> -->
      </div>
    </Teleport>
  <ExpenseTable 
    :filters="{ startDate: dateRange.start, endDate: dateRange.end }" 
    @action="handleExpenseAction" 
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/Button.vue";
import DatePicker from "@/components/DatePicker.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import ExpenseTable from "../../components/ExpenseTable.vue";

const dateRange = ref({
  start: "",
  end: "",
});

const handleDateSelect = (val: any) => {
  if (typeof val === "object" && val.start && val.end) {
    dateRange.value = val;
  }
};

const handleExpenseAction = ({ row, action }: any) => {
  if (action === 'view') {
    console.log(`View expense details for:`, row);
  } else {
    console.log(`Action: ${action} on Expense:`, row);
  }
};
</script>
