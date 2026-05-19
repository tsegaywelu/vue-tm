<template>
  <Dropdown
    contentParent="shadow-none! ring-0! ring-offset-0! p-0! bg-tras border-none! bg-none!"
    ref="dropdownRef"
  >
    <template #trigger>
      <slot name="trigger">
        <div class="relative inline-flex">
          <Button
            variant="secondary"
            :class="[
              'rounded-2xl h-[46px] px-4 gap-2 border transition-colors',
              hasValue
                ? 'border-primary/50 bg-primary/5 pr-8'
                : 'border-gray-100',
            ]"
          >
            <i
              :class="[
                'mdi mdi-calendar-range text-lg',
                hasValue ? 'text-primary' : 'text-gray-500',
              ]"
            ></i>
            <span
              :class="[
                'text-sm font-bold',
                hasValue ? 'text-primary' : 'text-gray-700',
              ]"
            >
              <template v-if="hasValue">
                {{ modelValue.start }} — {{ modelValue.end || "…" }}
              </template>
              <template v-else>Date Range</template>
            </span>
          </Button>

          <!-- Active indicator dot -->
          <span
            v-if="hasValue"
            class="absolute -top-1 -right-1 size-2.5 rounded-full bg-primary border-2 border-white"
          />

          <!-- Clear button -->
          <button
            v-if="hasValue"
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-primary/60 hover:text-red-500 transition-colors"
            @click.stop="clear"
          >
            <i v-html="icons.close"></i>
          </button>
        </div>
      </slot>
    </template>
    <template #default="{ close }">
      <DatePicker
        is-range
        :value="modelValue"
        @select="onSelect($event, close)"
      />
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import Dropdown from "@/components/common/Dropdown.vue";
import DatePicker from "@/components/DatePicker.vue";
import Button from "@/components/common/Button.vue";
import { useTableLastParams } from "@/composables/usePagination";
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

const lastParams = useTableLastParams(props.paginationId);

const hasValue = computed(() => !!modelValue.value.start);

function clear() {
  modelValue.value = { start: "", end: "" };
}

onMounted(() => {
  if (!props.paginationId) return;
  const saved = lastParams.value;
  const start = saved[props.startKey] ?? "";
  const end = saved[props.endKey] ?? "";
  if (start) modelValue.value = { start, end };
});

function onSelect(val: any, close: () => void) {
  if (val && typeof val === "object" && val.start) {
    modelValue.value = { start: val.start || "", end: val.end || "" };
    if (val.end) close();
  }
}
</script>
