<template>
  <div class="h-full flex flex-col gap-6">
    <!-- Header with Date Filter -->
    <Teleport to="#page-actions" defer>
      <div class="flex items-center gap-4">
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
                {{ dateRange.start }} - to - {{ dateRange.end || "---" }}
              </span>
            </Button>
          </template>
          <template #default>
            <DatePicker
              is-range
              :calendar-type="calendarType"
              :value="dateRange"
              @select="handleDateSelect"
            />
          </template>
        </Dropdown>
      </div>
    </Teleport>
    <div class="flex-1 transition-all duration-300">
      <Transition name="fade-slide" mode="out-in">
        <component
          :is="activeTabComponent"
          :dateRange="dateRange"
          :key="activeTab"
        />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import DatePicker from "@/components/DatePicker.vue";
import Dropdown from "@/components/common/Dropdown.vue";
import Button from "@/components/Button.vue";

// Tabs
import MetricsTab from "./vehicle-metrics/MetricsTab.vue";
import FinancialKpiTab from "./vehicle-metrics/FinancialKpiTab.vue";
import ProductivityKpiTab from "./vehicle-metrics/ProductivityKpiTab.vue";
import GoalAchievementTab from "./vehicle-metrics/GoalAchievementTab.vue";

const route = useRoute();

const calendarType = ref<"english" | "ethiopian">("english");
const dateRange = ref({
  start: new Date(new Date().setDate(new Date().getDate() - 30))
    .toISOString()
    .split("T")[0],
  end: new Date().toISOString().split("T")[0],
});

const activeTab = computed(() => (route.query.tab as string) || "metrics");

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "metrics":
      return MetricsTab;
    case "financial":
      return FinancialKpiTab;
    case "productivity":
      return ProductivityKpiTab;
    case "goal-achievement":
      return GoalAchievementTab;
    default:
      return MetricsTab;
  }
});

const handleDateSelect = (val: any) => {
  if (typeof val === "object" && val.start) {
    dateRange.value = val;
  }
};
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
