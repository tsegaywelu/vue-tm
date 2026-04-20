<template>
  <div
    class="flex flex-wrap items-end gap-4 p-6 rounded-[2rem] shadow-sm border border-gray-100"
  >
    <!-- Faceted Search -->
    <div class="flex-1 min-w-[300px]">
      <SearchInput
        v-model="searchQuery"
        v-model:typeValue="searchType"
        :options="searchOptions"
        placeholder="Enter your query..."
        size="md"
        @input="handleInput"
      />
    </div>

    <!-- Route Filters (Origin & Destination) -->
    <div class="flex gap-4 min-w-[400px]">
      <div class="flex-1">
        <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1"
          >Origin</label
        >
        <SelectInput
          v-model="filters.routeOrigin"
          :options="routeOptions"
          placeholder="Select Origin"
          is-multi
          size="md"
          @change="handleFilterChange"
        />
      </div>
      <div class="flex-1">
        <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1"
          >Destination</label
        >
        <SelectInput
          v-model="filters.routeDestination"
          :options="routeOptions"
          placeholder="Select Destination"
          is-multi
          size="md"
          @change="handleFilterChange"
        />
      </div>
    </div>

    <!-- Date Range Picker -->
    <div class="relative min-w-[200px]">
      <label class="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1"
        >Date Range</label
      >
      <button
        type="button"
        @click="showDatePicker = !showDatePicker"
        class="h-12 w-full px-4 flex items-center justify-between gap-2 bg-gray-50 border border-transparent rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all input-focus"
      >
        <div class="flex items-center gap-2 truncate">
          <div class="size-5 opacity-40" v-html="all_icons.calendar"></div>
          <span>{{ dateLabel }}</span>
        </div>
        <div
          class="size-4 opacity-40 transition-transform"
          :class="{ 'rotate-180': showDatePicker }"
          v-html="all_icons.leftAngle"
          style="transform: rotate(-90deg)"
        ></div>
      </button>

      <!-- DatePicker Dropdown -->
      <div
        v-if="showDatePicker"
        class="absolute top-full right-0 mt-3 p-4 bg-white rounded-[2.5rem] shadow-2xl z-[150] border border-gray-100 flex gap-6"
      >
        <!-- Quick Select Shortcuts -->
        <div class="flex flex-col gap-2 min-w-[140px] pt-2">
          <button
            v-for="shortcut in dateShortcuts"
            :key="shortcut.label"
            @click="applyDateShortcut(shortcut)"
            class="px-4 py-2 text-left text-sm rounded-xl font-medium transition-all"
            :class="
              isShortcutActive(shortcut)
                ? 'bg-primary text-white shadow-md'
                : 'hover:bg-gray-50 text-gray-500'
            "
          >
            {{ shortcut.label }}
          </button>
        </div>

        <div class="h-auto w-px bg-gray-100"></div>

        <!-- The actual Picker -->
        <DatePicker
          is-range
          :calendar-type="calendarType"
          :output-calendar-type="outputCalendarType"
          :value="dateRange"
          @select="handleDateSelect"
        />
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-2">
      <Button
        variant="secondary"
        size="md"
        @click="resetFilters"
        class="rounded-2xl"
      >
        Reset
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import SearchInput from "@/components/form/SearchInput.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import DatePicker from "@/components/DatePicker.vue";
import Button from "@/components/Button.vue";
import { fetch_routes } from "../api/route.api";
import type { ApprovalFilterParams } from "../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";
import { useTablePagination } from "@/composables/usePagination";

const all_icons = { ...icons, ...raaz_icons };

const props = defineProps<{
  calendarType?: "english" | "ethiopian";
  outputCalendarType?: "english" | "ethiopian";
}>();

const emit = defineEmits(["change"]);

// --- Pagination Store Sync ---
const { setSearch, state } = useTablePagination("approval-requests");

// --- Data Fetching ---
const { data: routes } = useQuery({
  queryKey: ["routes"],
  queryFn: async () => {
    const res = await fetch_routes();
    return res.data || [];
  },
});

const routeOptions = computed(() =>
  (routes.value || []).map((r) => ({ label: r.name, value: r._id })),
);

// --- Local State ---
const searchQuery = ref(state.value.search);
const searchType = ref("search");
const showDatePicker = ref(false);

const filters = reactive<ApprovalFilterParams>({
  routeOrigin: "",
  routeDestination: "",
  startDate: "",
  endDate: "",
  search: "",
});

const searchOptions = [
  { label: "General Search", value: "search" },
  { label: "Plate Number", value: "vehiclePlateNumber" },
  { label: "Advance No.", value: "advanceNumber" },
  { label: "Driver Name", value: "driverFirstName" },
];

const dateRange = computed(() => ({
  start: filters.startDate || "",
  end: filters.endDate || null,
}));

const dateLabel = computed(() => {
  if (filters.startDate && filters.endDate) {
    return `${filters.startDate} - ${filters.endDate}`;
  } else if (filters.startDate) {
    return `Starting ${filters.startDate}`;
  }
  return "Select Dates";
});

// --- Methods ---

const handleInput = () => {
  // If it's a general search, sync with the pagination store to trigger debounced query
  if (searchType.value === "search") {
    setSearch(searchQuery.value);
  }
  handleFilterChange();
};

const handleFilterChange = () => {
  // Clear other search fields in the composite filter object
  searchOptions.forEach((opt) => {
    if (opt.value !== "search") {
      (filters as any)[opt.value] = "";
    }
  });

  // Set current faceted search
  if (searchType.value !== "search") {
    (filters as any)[searchType.value] = searchQuery.value;
    filters.search = "";
    // Clear global search if using faceted search to avoid conflicts
    setSearch("");
  } else {
    filters.search = searchQuery.value;
  }

  emit("change", { ...filters });
};

const handleDateSelect = (
  val: string | { start: string; end: string | null },
) => {
  if (typeof val === "object") {
    filters.startDate = val.start;
    filters.endDate = val.end || "";
  } else {
    filters.startDate = val;
    filters.endDate = "";
  }
  handleFilterChange();
};

const resetFilters = () => {
  searchQuery.value = "";
  searchType.value = "search";
  filters.routeOrigin = "";
  filters.routeDestination = "";
  filters.startDate = "";
  filters.endDate = "";
  filters.search = "";
  setSearch("");
  handleFilterChange();
};

// Watch for store resets (e.g. from logout or global reset)
watch(
  () => state.value.search,
  (new_val) => {
    if (searchType.value === "search" && searchQuery.value !== new_val) {
      searchQuery.value = new_val;
    }
  },
);

// --- Date Shortcuts ---

const dateShortcuts = [
  {
    label: "Today",
    getValue: () => ({
      start: formatDate(new Date()),
      end: formatDate(new Date()),
    }),
  },
  {
    label: "Yesterday",
    getValue: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return { start: formatDate(d), end: formatDate(d) };
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return { start: formatDate(start), end: formatDate(end) };
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: formatDate(start), end: formatDate(now) };
    },
  },
  { label: "Clear", getValue: () => ({ start: "", end: "" }) },
];

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

const applyDateShortcut = (shortcut: any) => {
  const val = shortcut.getValue();
  filters.startDate = val.start;
  filters.endDate = val.end;
  handleFilterChange();
  if (shortcut.label !== "Clear") showDatePicker.value = false;
};

const isShortcutActive = (shortcut: any) => {
  const val = shortcut.getValue();
  return filters.startDate === val.start && filters.endDate === val.end;
};

// --- Outside interaction ---
const handleClickOutside = (e: MouseEvent) => {
  if (showDatePicker.value && !(e.target as HTMLElement).closest(".relative")) {
    showDatePicker.value = false;
  }
};

onMounted(() => window.addEventListener("click", handleClickOutside));
onUnmounted(() => window.removeEventListener("click", handleClickOutside));
</script>

<style scoped>
.input-focus:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(34, 34, 255, 0.1);
}
</style>
