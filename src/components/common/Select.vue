<template>
  <div class="relative w-full">
    <div
      ref="containerRef"
      class="focus:shadow-none focus:outline-0 active:shadow-none! outline-0 relative cursor-pointer custom-input flex-1 min-w-0 flex items-center w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
      :class="{
        'pointer-events-none cursor-not-allowed bg-gray-50': disabled,
      }"
      :tabindex="disabled ? -1 : searchable ? -1 : 0"
      @click="toggleDropdown"
      @keydown="handleKeydown($event)"
    >
      <div
        class="flex justify-between items-center gap-1 flex-1 min-w-0 w-full overflow-hidden"
      >
        <div class="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
          <div
            v-if="multiple && isValidSelection(modelValue)"
            class="flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 max-w-[50%]"
          >
            <span
              v-for="val in modelValue"
              :key="val"
              class="inline-flex items-center gap-0.5 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 whitespace-nowrap shrink-0 text-sm"
            >
              {{ getLabelForValue(val) }}
              <button
                tabindex="-1"
                @click.stop="removeOne(val)"
                class="ml-0.5 hover:text-red-500 transition-colors leading-none"
              >
                <i class="*:size-3" v-html="icons.close"></i>
              </button>
            </span>
          </div>

          <!-- Search input -->
          <template v-if="searchable">
            <input
              ref="searchInput"
              type="text"
              class="min-w-0 w-0 flex-1 focus:outline-none outline-none focus:shadow-none px-0 bg-transparent text-sm text-gray-900"
              v-model="searchResult"
              :disabled="disabled"
              :placeholder="
                multiple && isValidSelection(modelValue)
                  ? ''
                  : placeholder || 'Select'
              "
              @input="handleInputSearch"
              @keydown="handleKeydown($event)"
            />
          </template>
          <template v-else>
            <span
              v-if="!multiple && isValidSelection(modelValue)"
              class="truncate text-sm text-gray-900"
            >
              {{ getDisplayLabel(modelValue) }}
            </span>
            <span
              v-else-if="!isValidSelection(modelValue)"
              class="pointer-events-none text-gray-400 text-sm"
            >
              {{ placeholder || "Select" }}
            </span>
          </template>
        </div>

        <div class="w-auto h-5 flex shrink-0 text-gray-500 items-center">
          <i v-if="pending" class="*:size-5" v-html="icons.spinner"></i>
          <template v-else>
            <button
              tabindex="-1"
              v-if="isValidSelection(modelValue) && clearable"
              @click.stop.prevent="clearSelection()"
              class="text-xs whitespace-nowrap text-dark flex items-center justify-center"
            >
              <i class="*:size-4" v-html="icons.close"></i>
            </button>
            <i v-else class="*:size-4" v-html="icons.downIcon"></i>
          </template>
        </div>
      </div>

      <Teleport to="body">
        <div
          v-if="open"
          ref="dropdownRef"
          class="fixed z-9999 bg-white border border-gray-100 shadow-lg max-h-64 overflow-y-auto flex flex-col gap-1 py-2 px-2 rounded-xl"
          :style="dropdownStyle"
        >
          <div
            v-if="finalOptions.length === 0"
            class="text-gray-400 p-2 text-sm"
          >
            No options found
          </div>

          <div
            v-for="(option, idx) in finalOptions"
            :key="getOptionValue(option) + '-' + idx"
            :ref="
              (el) => {
                if (el) optionRefs[idx] = el as HTMLElement;
              }
            "
            @click.stop="selectOption(option)"
            @mouseenter="highlightedIndex = idx"
            class="flex items-center justify-between cursor-pointer rounded-md hover:bg-gray-50 p-2"
            :class="{
              'bg-gray-100': isSelected(option, modelValue),
              'bg-primary/10':
                highlightedIndex === idx && !isSelected(option, modelValue),
              'bg-primary/15':
                highlightedIndex === idx && isSelected(option, modelValue),
            }"
          >
            <slot
              name="item"
              :option="option"
              :label="getOptionLabel(option)"
              :value="getOptionValue(option)"
              :item="option.item"
              :selected="isSelected(option, modelValue)"
            >
              <span class="font-medium text-sm text-gray-700">{{
                getOptionLabel(option)
              }}</span>
            </slot>

            <div
              v-if="multiple"
              :class="[
                isSelected(option, modelValue)
                  ? 'border-transparent'
                  : 'border-gray-300',
              ]"
              class="size-4 grid place-items-center border rounded"
            >
              <i
                v-if="isSelected(option, modelValue)"
                v-html="icons.check"
                class="*:size-4 text-primary"
              ></i>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { icons } from "@/utils/icons";
import { getValueByPath } from "@/utils/utils";

export interface SelectProps {
  modelValue?: any;
  options?: any[];
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  pending?: boolean;
  placeholder?: string;
  label_key?: string | ((item: any) => string);
  value_key?: string | ((item: any) => any);
  display_label_fn?: (item: any) => string;
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: undefined,
  options: () => [],
  searchable: false,
  multiple: false,
  disabled: false,
  clearable: true,
  pending: false,
  placeholder: "Select",
  label_key: "label",
  value_key: "value",
  display_label_fn: undefined,
});

const emit = defineEmits([
  "update:modelValue",
  "search",
  "input-change",
  "select",
]);

const open = ref(false);
const searchResult = ref("");
const searchInput = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({});
const highlightedIndex = ref(-1);
const optionRefs = ref<Record<number, HTMLElement>>({});

// Sync searchResult when modelValue is set externally
watch(
  () => props.modelValue,
  (newVal) => {
    if (!props.searchable) return;
    if (!props.multiple && newVal) {
      const opt = finalOptions.value.find(
        (o: any) => getOptionValue(o) == newVal,
      );
      if (opt) {
        searchResult.value = opt.displayLabel || getOptionLabel(opt);
      }
    } else if (!newVal) {
      searchResult.value = "";
    }
  },
  { immediate: true },
);

const finalOptions = computed(() => {
  let list = props.options || [];

  const seen = new Set();
  list = list.filter((item: any) => {
    const val =
      typeof props.value_key === "function"
        ? props.value_key(item)
        : getValueByPath(item, props.value_key as string);
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });

  let mapped = list.map((item: any) => {
    if (typeof item === "string") return { label: item, value: item, item };
    return {
      label:
        typeof props.label_key === "function"
          ? props.label_key(item)
          : (getValueByPath(item, props.label_key as string) ?? ""),
      value:
        typeof props.value_key === "function"
          ? props.value_key(item)
          : (getValueByPath(item, props.value_key as string) ?? ""),
      displayLabel:
        typeof props.display_label_fn === "function"
          ? props.display_label_fn(item)
          : undefined,
      item,
    };
  });

  if (props.searchable && searchResult.value) {
    const lowerSearch = searchResult.value.toLowerCase();
    // Only filter if the search string is NOT exactly matching the currently selected option's label
    const selectedOpt = mapped.find(
      (o) => getOptionValue(o) == props.modelValue,
    );
    const selectedLabel = selectedOpt
      ? selectedOpt.displayLabel || selectedOpt.label
      : "";

    if (searchResult.value !== selectedLabel) {
      mapped = mapped.filter((opt: any) => {
        const lbl = opt.displayLabel || opt.label;
        return String(lbl).toLowerCase().includes(lowerSearch);
      });
    }
  }

  return mapped;
});

function getOptionLabel(opt: any) {
  return typeof opt === "string" ? opt : opt.label;
}

function getOptionValue(opt: any) {
  return typeof opt === "string" ? opt : opt.value;
}

function isValidSelection(value: any) {
  if (props.multiple) return Array.isArray(value) && value.length > 0;
  return value !== undefined && value !== null && value !== "";
}

function getDisplayLabel(value: any) {
  if (props.multiple) return `${(value as any[]).length} selected`;
  const opt = finalOptions.value.find((o: any) => getOptionValue(o) == value);
  if (opt) return opt.displayLabel || getOptionLabel(opt);
  return value;
}

function getLabelForValue(val: any) {
  const opt = finalOptions.value.find((o: any) => getOptionValue(o) == val);
  if (opt) return opt.displayLabel || getOptionLabel(opt);
  return val;
}

function removeOne(val: any) {
  const current = Array.isArray(props.modelValue)
    ? props.modelValue.filter((v: any) => v !== val)
    : [];
  emit("update:modelValue", current);
}

let searchTimeout: any;
function handleInputSearch(ev: Event) {
  const target = ev.target as HTMLInputElement;
  const val = target.value;
  searchResult.value = val;
  emit("input-change", val);

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    emit("search", val);
  }, 300);
}

function toggleDropdown() {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) {
    highlightedIndex.value = -1;
    if (props.searchable) {
      nextTick(() => {
        searchInput.value?.focus();
      });
    }
  }
}

function updatePosition() {
  if (containerRef.value && dropdownRef.value && open.value) {
    const rect = containerRef.value.getBoundingClientRect();
    const dropdownHeight = 300;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight && rect.top > spaceBelow;

    dropdownStyle.value = {
      top: `${(openUp ? rect.top : rect.bottom) + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
      width: `${rect.width}px`,
      transform: openUp
        ? "translateY(-100%) translateY(-8px)"
        : "translateY(8px)",
    };
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    nextTick(updatePosition);
    window.addEventListener("scroll", updatePosition, { capture: true });
    window.addEventListener("resize", updatePosition);
  } else {
    window.removeEventListener("scroll", updatePosition, { capture: true });
    window.removeEventListener("resize", updatePosition);
  }
});

function handleOutsideClick(e: MouseEvent) {
  if (
    !containerRef.value?.contains(e.target as Node) &&
    !dropdownRef.value?.contains(e.target as Node)
  ) {
    open.value = false;
  }
}

onMounted(() => {
  window.addEventListener("mousedown", handleOutsideClick);
});
onBeforeUnmount(() => {
  window.removeEventListener("mousedown", handleOutsideClick);
});

function selectOption(option: any) {
  const value = getOptionValue(option);
  if (props.multiple) {
    let current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    if (current.includes(value)) current = current.filter((v) => v !== value);
    else current.push(value);
    emit("update:modelValue", current);
  } else {
    emit("update:modelValue", value);
    searchResult.value = option.displayLabel || getOptionLabel(option);
    open.value = false;
  }
  emit("select", option);
}

function isSelected(option: any, selectedValue: any) {
  const value = getOptionValue(option);
  if (props.multiple)
    return Array.isArray(selectedValue) && selectedValue.includes(value);
  return selectedValue === value;
}

function clearSelection() {
  emit("update:modelValue", props.multiple ? [] : "");
  searchResult.value = "";
}

function handleKeydown(e: KeyboardEvent) {
  const opts = finalOptions.value;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      if (!open.value) {
        open.value = true;
        highlightedIndex.value = 0;
      } else {
        highlightedIndex.value =
          highlightedIndex.value < opts.length - 1
            ? highlightedIndex.value + 1
            : 0;
      }
      scrollToHighlighted();
      break;

    case "ArrowUp":
      e.preventDefault();
      if (!open.value) {
        open.value = true;
        highlightedIndex.value = opts.length - 1;
      } else {
        highlightedIndex.value =
          highlightedIndex.value > 0
            ? highlightedIndex.value - 1
            : opts.length - 1;
      }
      scrollToHighlighted();
      break;

    case "Enter":
      e.preventDefault();
      if (
        open.value &&
        highlightedIndex.value >= 0 &&
        highlightedIndex.value < opts.length
      ) {
        selectOption(opts[highlightedIndex.value]);
      } else if (!open.value) {
        toggleDropdown();
      }
      break;

    case "Escape":
      e.preventDefault();
      open.value = false;
      highlightedIndex.value = -1;
      break;

    case "Tab":
      open.value = false;
      highlightedIndex.value = -1;
      break;
  }
}

function scrollToHighlighted() {
  nextTick(() => {
    const el = optionRefs.value[highlightedIndex.value];
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  });
}
</script>
