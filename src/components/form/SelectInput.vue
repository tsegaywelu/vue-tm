<template>
  <InputParent
    :name="name"
    :validation="validation"
    :match="match"
    :on_change="on_change"
  >
    <template #default="{ field }">
      <InputLayout
        :name="name"
        :show_validation_status="show_validation_status"
        :parent_class_name="parent_class_name"
        :size="size"
        :label="label"
        :error="
          field.state.meta.errors.length
            ? field.state.meta.errors[0]
            : undefined
        "
        :validations="validation"
        :left_component="left_component"
        :description="computedDescription"
        :error_type="error_type"
      >
        <div
          ref="containerRef"
          class="focus:shadow-none focus:outline-0 active:shadow-none! outline-0 relative cursor-pointer custom-input flex-1 min-w-0 flex items-center h-full w-full"
          :class="{
            'pointer-events-none cursor-not-allowed': attributes?.disabled,
          }"
          :tabindex="attributes?.disabled ? -1 : searchable ? -1 : 0"
          :data-name="name"
          @click="toggleDropdown"
          @keydown="handleKeydown($event, field)"
        >
          <div
            class="flex justify-between items-center gap-1 flex-1 min-w-0 w-full h-full overflow-hidden"
          >
            <div class="flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
              <div
                v-if="multiple && isValidSelection(field.state.value)"
                class="flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 max-w-[50%]"
              >
                <span
                  v-for="val in field.state.value"
                  :key="val"
                  class="inline-flex items-center gap-0.5 bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 whitespace-nowrap shrink-0"
                  :class="dropdownTextClass"
                >
                  {{ getLabelForValue(val) }}
                  <button
                    tabindex="-1"
                    @click.stop="removeOne(val, field)"
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
                  class="min-w-0 w-0 flex-1 focus:outline-none outline-none focus:shadow-none px-0 bg-transparent"
                  v-model="searchResult"
                  :disabled="attributes?.disabled"
                  :placeholder="
                    multiple && isValidSelection(field.state.value)
                      ? ''
                      : attributes.placeholder || 'Select'
                  "
                  @input="handleInputSearch"
                  @keydown="handleKeydown($event, field)"
                />
              </template>
              <template v-else>
                <span
                  v-if="!multiple && isValidSelection(field.state.value)"
                  class="truncate"
                >
                  {{ getDisplayLabel(field.state.value) }}
                </span>
                <span
                  v-else-if="!isValidSelection(field.state.value)"
                  class="pointer-events-none text-gray-400"
                >
                  {{ attributes.placeholder || "Select" }}
                </span>
              </template>
            </div>

            <div
              v-if="!hide_icon"
              class="w-auto h-5 flex shrink-0 text-gray-500"
            >
              <i v-if="isPending" class="*:size-5" v-html="icons.spinner"></i>
              <template v-else>
                <button
                  tabindex="-1"
                  v-if="isValidSelection(field.state.value)"
                  @click.stop.prevent="clearSelection(field)"
                  class="text-xs whitespace-nowrap text-dark"
                >
                  <i class="*:size-5" v-html="icons.close"></i>
                </button>
                <i v-else class="*:size-5" v-html="icons.downIcon"></i>
              </template>
            </div>
          </div>

          <Teleport to="body">
            <div
              v-if="open"
              ref="dropdownRef"
              class="fixed z-9999 bg-white border border-gray-100 shadow-lg max-h-64 overflow-y-auto flex flex-col gap-1 py-2 px-2"
              :class="dropdownRoundedClass"
              :style="dropdownStyle"
            >
              <div
                v-if="finalOptions.length === 0"
                class="text-gray-400 p-2"
                :class="dropdownTextClass"
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
                @click.stop="selectOption(option, field)"
                @mouseenter="highlightedIndex = idx"
                class="flex items-center justify-between cursor-pointer rounded-md hover:bg-gray-50 p-2"
                :class="{
                  'bg-gray-100': isSelected(option, field.state.value),
                  'bg-primary/10':
                    highlightedIndex === idx &&
                    !isSelected(option, field.state.value),
                  'bg-primary/15':
                    highlightedIndex === idx &&
                    isSelected(option, field.state.value),
                }"
              >
                <slot
                  name="item"
                  :option="option"
                  :label="getOptionLabel(option)"
                  :value="getOptionValue(option)"
                  :item="option.item"
                  :selected="isSelected(option, field.state.value)"
                >
                  <span class="font-medium" :class="dropdownTextClass">{{
                    getOptionLabel(option)
                  }}</span>
                </slot>

                <div
                  v-if="multiple"
                  :class="[
                    isSelected(option, field.state.value)
                      ? 'border-transparent'
                      : 'border-gray-300',
                  ]"
                  class="size-4 grid place-items-center border rounded"
                >
                  <i
                    v-if="isSelected(option, field.state.value)"
                    v-html="icons.check"
                    class="*:size-4"
                  ></i>
                </div>
              </div>
            </div>
          </Teleport>
        </div>
      </InputLayout>
    </template>
  </InputParent>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
  inject,
  type SelectHTMLAttributes,
} from "vue";
import InputParent from "./InputParent.vue";
import InputLayout from "./InputLayout.vue";
import { type InputProps } from "./Input.vue";
import { usePagination } from "@/composables/usePagination";
import ApiService from "@/api/ApiService";
import { icons } from "@/utils/icons";
import { getValueByPath } from "@/utils/utils";

export interface SelectInputProps extends InputProps {
  attributes?: SelectHTMLAttributes;

  options?: any[];
  pending?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  url?: string;
  base_url?: string;
  params?:
    | Record<string, any>
    | ((data: {
        value: any;
        search: string;
        form: any;
      }) => Record<string, any>);
  label_key?: string | ((item: any) => string);
  value_key?: string | ((item: any) => any);
  display_label_fn?: (item: any) => string;
  hide_icon?: boolean;
  display_value?: string;
  initial_labels?: Record<string, string>;
}

const props = withDefaults(defineProps<SelectInputProps>(), {
  match: "",
  on_change: undefined,
  validation: () => ({}),
  attributes: () => ({}),
  capitalize: false,
  options: () => [],
  pending: false,
  searchable: false,
  multiple: false,
  url: "",
  base_url: undefined,
  params: () => ({}),
  label_key: "label",
  value_key: "value",
  display_label_fn: undefined,
  hide_icon: false,

  show_validation_status: true,
  parent_class_name: "",
  size: "sm",
  label: "",
  left_component: null as any,
  description: "",
  error_type: "text",
  display_value: "",
  initial_labels: () => ({}),
});

const emit = defineEmits(["search", "input-change", "select"]);

const open = ref(false);
const searchResult = ref("");
const searchInput = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({});
const highlightedIndex = ref(-1);
const optionRefs = ref<Record<number, HTMLElement>>({});

const isRemote = computed(() => !!props.url);

const customApi = props.base_url ? new ApiService(props.base_url) : undefined;

const formContext = inject("formContext") as any;
const form = formContext?.form;
const currentSelectedValue = ref(
  form ? form.getFieldValue(props.name) : undefined,
);

let unsubscribe: any = null;
onMounted(() => {
  if (form) {
    currentSelectedValue.value = form.getFieldValue(props.name);
    unsubscribe = form.store.subscribe(() => {
      currentSelectedValue.value = form.getFieldValue(props.name);
    });
  }
  if (props.display_value && props.searchable) {
    searchResult.value = props.display_value;
  }
});

onBeforeUnmount(() => {
  if (typeof unsubscribe === "function") {
    unsubscribe();
  }
});

// Sync searchResult when value is set programmatically (e.g. from a modal)
watch(
  () => currentSelectedValue.value,
  (newVal) => {
    if (!props.searchable) return;
    if (!props.multiple && newVal) {
      const opt = finalOptions.value.find(
        (o: any) => getOptionValue(o) == newVal,
      );
      if (opt) {
        searchResult.value = opt.displayLabel || getOptionLabel(opt);
      } else if (props.initial_labels?.[newVal]) {
        searchResult.value = props.initial_labels[newVal];
      }
    } else if (!newVal) {
      searchResult.value = "";
    }
  },
);

const syncedSearch = ref("");

const computedParams = computed(() => {
  if (typeof props.params === "function") {
    return props.params({
      value: currentSelectedValue.value,
      search: syncedSearch.value,
      form: form,
    });
  }
  return props.params;
});

const {
  response: remoteData,
  state: remoteState,
  setSearch: setRemoteSearch,
  debouncedSearch,
  isLoading: remoteLoading,
  isFetching: remoteFetching,
} = usePagination({
  queryKey: [props.name, props.size, props.base_url || ""],
  url: props.url,
  autofetch: isRemote.value,
  params: computedParams,
  ...(customApi ? { api: customApi } : {}),
});

watch(
  () => debouncedSearch?.value,
  (val) => {
    syncedSearch.value = val || "";
  },
  { immediate: true },
);
const isPending = computed(() =>
  isRemote.value ? remoteLoading.value || remoteFetching.value : props.pending,
);

const dropdownTextClass = computed(() => {
  const map: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
  };
  return map[props.size] || "text-sm";
});

const dropdownRoundedClass = computed(() =>
  props.size === "xs" ? "rounded-lg" : "rounded-xl",
);

const finalOptions = computed(() => {
  let list = isRemote.value
    ? [
        ...(Array.isArray(remoteData.value) ? remoteData.value : []),
        ...(props.options || []),
      ]
    : props.options;

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

  if (props.searchable && searchResult.value && !isRemote.value) {
    const lowerSearch = searchResult.value.toLowerCase();
    mapped = mapped.filter((opt: any) => {
      const lbl = opt.displayLabel || opt.label;
      return String(lbl).toLowerCase().includes(lowerSearch);
    });
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
  if (props.initial_labels?.[value]) return props.initial_labels[value];
  if (props.display_value) return props.display_value;
  return value;
}

function getLabelForValue(val: any) {
  const opt = finalOptions.value.find((o: any) => getOptionValue(o) == val);
  if (opt) return opt.displayLabel || getOptionLabel(opt);
  if (props.initial_labels?.[val]) return props.initial_labels[val];
  return val;
}

function removeOne(val: any, field: any) {
  const current = Array.isArray(field.state.value)
    ? field.state.value.filter((v: any) => v !== val)
    : [];
  field.handleChange(current);
}

const computedDescription = computed(() => {
  return props.description;
});

let searchTimeout: any;
function handleInputSearch(ev: Event) {
  const target = ev.target as HTMLInputElement;
  let val = target.value;
  if (props.capitalize && val) {
    val = val.trim().charAt(0).toUpperCase() + val.slice(1);
    searchResult.value = val;
  }
  emit("input-change", val);

  if (isRemote.value) {
    setRemoteSearch(val);
  } else {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      emit("search", val);
    }, 500);
  }
}

function toggleDropdown() {
  if (props.attributes?.disabled) return;
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

function selectOption(option: any, field: any) {
  const value = getOptionValue(option);
  if (props.multiple) {
    let current = Array.isArray(field.state.value)
      ? [...field.state.value]
      : [];
    if (current.includes(value)) current = current.filter((v) => v !== value);
    else current.push(value);
    field.handleChange(current);
  } else {
    field.handleChange(value);
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

function clearSelection(field: any) {
  field.handleChange(props.multiple ? [] : "");
  searchResult.value = "";
}

function handleKeydown(e: KeyboardEvent, field: any) {
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
        selectOption(opts[highlightedIndex.value], field);
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
