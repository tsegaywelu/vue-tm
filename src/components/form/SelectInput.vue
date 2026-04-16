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
          class="focus:shadow-none focus:outline-0 relative cursor-pointer custom-input flex items-center h-full w-full"
          :tabindex="searchable ? -1 : 0"
          :data-name="name"
          @click="toggleDropdown"
          @keydown="handleKeydown($event, field)"
        >
          <div class="flex justify-between items-center w-full h-full">
            <template v-if="searchable">
              <input
                ref="searchInput"
                type="text"
                class="max-w-full w-0 flex-1 focus:outline-0 focus:shadow-none px-0 bg-transparent"
                v-model="searchResult"
                :placeholder="attributes.placeholder || 'Select'"
                @input="handleInputSearch"
              />
            </template>
            <template v-else>
              <span v-if="isValidSelection(field.state.value)" class="truncate">
                {{ getDisplayLabel(field.state.value) }}
              </span>
              <span v-else class="pointer-events-none text-gray-400">
                {{ attributes.placeholder || "Select" }}
              </span>
            </template>

            <div class="w-auto h-5 flex text-gray-500">
              <span
                v-if="isPending"
                class="mdi mdi-loading mdi-spin text-lg"
              ></span>
              <template v-else>
                <button
                  v-if="isValidSelection(field.state.value)"
                  @click.stop="clearSelection(field)"
                  class="text-xs whitespace-nowrap text-dark"
                >
                  <i class="mdi mdi-close"></i>
                </button>
                <i v-else class="mdi mdi-chevron-down text-lg"></i>
              </template>
            </div>
          </div>

          <Teleport to="body">
            <div
              v-if="open"
              ref="dropdownRef"
              class="fixed z-[9999] bg-white border border-gray-100 shadow-lg max-h-64 overflow-y-auto flex flex-col gap-1 py-2 px-2 rounded-md"
              :style="dropdownStyle"
            >
              <div
                v-if="finalOptions.length === 0"
                class="text-xs text-gray-400 p-2"
              >
                No options found
              </div>

              <div
                v-for="(option, idx) in finalOptions"
                :key="getOptionValue(option) + '-' + idx"
                @click.stop="selectOption(option, field)"
                class="flex items-center justify-between cursor-pointer rounded-md hover:bg-gray-50 p-2"
                :class="{
                  'bg-gray-100': isSelected(option, field.state.value),
                }"
              >
                <slot name="item" :option="option">
                  <span class="text-sm font-medium">{{
                    getOptionLabel(option)
                  }}</span>
                </slot>

                <div
                  v-if="multiple"
                  class="size-4 grid place-items-center border border-gray-300 rounded"
                >
                  <i
                    v-if="isSelected(option, field.state.value)"
                    class="mdi mdi-check text-xs text-primary"
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
  type SelectHTMLAttributes,
} from "vue";
import InputParent from "./InputParent.vue";
import InputLayout from "./InputLayout.vue";
import { type InputProps } from "./Input.vue";
import { usePagination } from "@/composables/usePagination";

export interface SelectInputProps extends InputProps {
  attributes?: SelectHTMLAttributes;

  options?: any[];
  pending?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  url?: string;
  label_key?: string | ((item: any) => string);
  value_key?: string | ((item: any) => any);
  display_label_fn?: (item: any) => string;
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
  label_key: "label",
  value_key: "value",
  display_label_fn: undefined,

  show_validation_status: true,
  parent_class_name: "",
  size: "sm",
  label: "",
  left_component: null as any,
  description: "",
  error_type: "text",
});

const emit = defineEmits(["search", "input-change", "select"]);

const open = ref(false);
const searchResult = ref("");
const searchInput = ref<HTMLInputElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({});

const isRemote = computed(() => !!props.url);

const {
  response: remoteData,
  state: remoteState,
  setSearch: setRemoteSearch,
} = usePagination({
  url: props.url,
  autofetch: isRemote.value,
});
const isPending = computed(() =>
  isRemote.value ? remoteState.pending : props.pending,
);

const finalOptions = computed(() => {
  let list = isRemote.value
    ? Array.isArray(remoteData.value)
      ? remoteData.value
      : []
    : props.options;

  let mapped = list.map((item: any) => {
    if (typeof item === "string") return { label: item, value: item, item };
    return {
      label:
        typeof props.label_key === "function"
          ? props.label_key(item)
          : item[props.label_key as string] || "",
      value:
        typeof props.value_key === "function"
          ? props.value_key(item)
          : item[props.value_key as string] || "",
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
  if (props.multiple) return ` - ${(value as any[]).length} selected`;
  const opt = finalOptions.value.find((o: any) => getOptionValue(o) == value);
  if (opt) return opt.displayLabel || getOptionLabel(opt);
  return value;
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

  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (isRemote.value) setRemoteSearch(val);
    else emit("search", val);
  }, 500);
}

function toggleDropdown() {
  open.value = !open.value;
  if (open.value && props.searchable) {
    nextTick(() => {
      searchInput.value?.focus();
    });
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
  if (e.key === "Enter") toggleDropdown();
}
</script>
