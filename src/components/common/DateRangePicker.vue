<template>
  <Dropdown
    contentParent="shadow-none! ring-0! ring-offset-0! p-0! bg-tras border-none! bg-none!"
    ref="dropdownRef"
  >
    <template #trigger>
      <slot name="trigger">
        <div class="inline-flex items-center gap-0.5 sm:relative sm:gap-0">
          <Button
            variant="secondary"
            :class="[
              'transition-colors sm:rounded-2xl sm:h-11.5 sm:px-4 sm:gap-2 sm:border p-0 border-0 bg-transparent',
              hasValue
                ? 'sm:border-primary/50 sm:bg-primary/5 sm:pr-8'
                : 'sm:border-gray-100',
            ]"
          >
            <i
              v-html="icons.calender"
              :class="['text-lg', hasValue ? 'text-primary' : 'text-gray-500']"
            />
            <span
              :class="[
                'hidden sm:inline text-sm font-bold',
                hasValue ? 'text-primary' : 'text-gray-700',
              ]"
            >
              <template v-if="hasValue">
                {{ modelValue.start }} — {{ modelValue.end || "…" }}
              </template>
              <template v-else>Date Range</template>
            </span>
          </Button>

<!-- Clear button (sm+ only — mobile lives inside the sheet) -->
          <button
            v-if="hasValue"
            type="button"
            class="hidden sm:flex items-center text-primary/60 hover:text-red-500 transition-colors sm:absolute sm:right-1.5 sm:top-1/2 sm:-translate-y-1/2"
            @click.stop="clear"
          >
            <i v-html="icons.close"></i>
          </button>
        </div>
      </slot>
    </template>
    <template #default="{ close }">
      <div v-if="hasValue" class="flex justify-end px-3 pt-2 sm:hidden">
        <button
          type="button"
          class="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 transition-colors"
          @click.stop="clear"
        >
          <i v-html="icons.close" />
          Clear
        </button>
      </div>
      <DatePicker
        is-range
        :value="modelValue"
        @select="onSelect($event, close)"
      />
    </template>
  </Dropdown>
</template>

<script lang="ts">
// Module-level singleton — shared across all DateRangePicker instances.
// Tracks how many instances on each route use route-path-based persistence
// (i.e. have no explicit paginationId) so we can warn on collisions.
const routeKeyRegistry = new Map<string, number>();
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import Dropdown from "@/components/common/Dropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import Button from "@/components/common/Button.vue";
import { useTablePaginationStore } from "@/store/tablePaginationStore";
import { icons } from "@/utils/icons";

const props = withDefaults(
  defineProps<{
    paginationId?: string;
    startKey?: string;
    endKey?: string;
  }>(),
  {
    paginationId: "",
    startKey: "startDate",
    endKey: "endDate",
  },
);

const modelValue = defineModel<{ start: string; end: string }>({
  default: () => ({ start: "", end: "" }),
});

const route = useRoute();
const store = useTablePaginationStore();

// If paginationId is given use it; otherwise fall back to the current route path.
const effectiveKey = computed(() => props.paginationId || route.path);

const hasValue = computed(() => !!modelValue.value.start);

// Persist whenever modelValue changes.
watch(
  modelValue,
  (val) => {
    store.setParams(effectiveKey.value, {
      [props.startKey]: val.start,
      [props.endKey]: val.end,
    });
  },
  { deep: true },
);

function clear() {
  modelValue.value = { start: "", end: "" };
}

onMounted(() => {
  // Register this instance and warn if two route-key instances share the same route.
  // Uses nextTick so that route-transition teardown of the outgoing component runs first,
  // preventing false-positive duplicate warnings during page navigation.
  if (!props.paginationId) {
    nextTick(() => {
      const count = (routeKeyRegistry.get(route.path) ?? 0) + 1;
      routeKeyRegistry.set(route.path, count);
      if (count > 1) {
        console.error(
          `[DateRangePicker] Two or more instances on route "${route.path}" are using ` +
          `route-based persistence without a unique paginationId. ` +
          `Pass a unique "pagination-id" prop to each DateRangePicker so their state doesn't collide.`,
        );
      }
    });
  }

  // Restore saved value — works for both paginationId and route-key cases.
  const saved = store.tableParams[effectiveKey.value] ?? {};
  const start = saved[props.startKey] ?? "";
  const end   = saved[props.endKey]   ?? "";
  if (start) modelValue.value = { start, end };
});

onUnmounted(() => {
  if (!props.paginationId) {
    const count = routeKeyRegistry.get(route.path) ?? 1;
    if (count <= 1) routeKeyRegistry.delete(route.path);
    else routeKeyRegistry.set(route.path, count - 1);
  }
});

function onSelect(val: any, close: () => void) {
  if (val && typeof val === "object" && val.start) {
    modelValue.value = { start: val.start || "", end: val.end || "" };
    if (val.end) close();
  }
}
</script>
