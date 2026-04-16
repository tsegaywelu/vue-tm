<template>
  <InputParent
    :name="name"
    :validation="validation"
    :match="match"
    :on_change="on_change"
  >
    <template #default="{ field }">
      <div ref="containerRef" class="relative w-full">
        <InputLayout
          :name="name"
          :show_validation_status="show_validation_status"
          :parent_class_name="parent_class_name"
          :size="size"
          :label="label"
          :error="
            field.state.meta.errors.length ? field.state.meta.errors : undefined
          "
          :validations="validation"
          :left_component="left_component"
          :input_style="input_style"
          :description="description"
          :error_type="error_type"
          @blur="field.handleBlur"
        >
          <input
            :id="field.name"
            :name="field.name"
            :data-name="name"
            readonly
            class="cursor-pointer focus:shadow-none w-full bg-transparent outline-none flex-1"
            :value="formattedDate(field.state.value)"
            @click="togglePicker"
            autocomplete="off"
            v-bind="attributes"
          />

          <template #right_component>
            <div
              class="grid place-items-center cursor-pointer"
              @click="togglePicker"
            >
              <slot name="right_component">
                <i class="mdi mdi-calendar-blank text-gray-600 text-xl"></i>
              </slot>
            </div>
          </template>
        </InputLayout>

        <Teleport to="body">
          <div
            v-if="isOpen"
            ref="dropdownRef"
            class="fixed z-[9999]"
            :style="dropdownStyle"
          >
            <DatePicker
              :calendar-type="internalCalendarType"
              :value="field.state.value"
              :is-range="is_range"
              :output-calendar-type="output_calendar_type"
              :show-calender-type="show_calendar_type"
              @calendar-type-change="internalCalendarType = $event"
              @select="onSelect($event, field)"
            />
          </div>
        </Teleport>
      </div>
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
  type InputHTMLAttributes,
} from "vue";
import InputParent from "./InputParent.vue";
import InputLayout from "./InputLayout.vue";
import { type InputProps } from "./Input.vue";
import DatePicker from "@/components/DatePicker.vue";

export interface DateInputProps extends InputProps {
  is_range?: boolean;
  calendar_type?: "english" | "ethiopian";
  output_calendar_type?: "english" | "ethiopian";
  show_calendar_type?: boolean;
}

const props = withDefaults(defineProps<DateInputProps>(), {
  match: "",
  on_change: undefined,
  validation: () => ({}),
  attributes: () => ({}),
  is_range: false,
  calendar_type: "english",
  output_calendar_type: "english",
  show_calendar_type: false,

  show_validation_status: true,
  parent_class_name: "",
  size: "sm",
  label: "",
  left_component: null as any,
  right_component: null as any,
  input_style: "",
  description: "",
  error_type: "text",
});

const isOpen = ref(false);
const internalCalendarType = ref<"english" | "ethiopian">(props.calendar_type);

const containerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({});

function formattedDate(val: any) {
  if (!val) return "";
  if (props.is_range) {
    if (typeof val === "string" && val.includes("-")) {
      const [start, end] = val.split("-");
      return `${formatDateDisplay(start)} - ${formatDateDisplay(end)}`;
    } else if (typeof val === "object" && val !== null) {
      return `${formatDateDisplay(val.start)} - ${formatDateDisplay(val.end)}`;
    }
  }
  return formatDateDisplay(val);
}

function formatDateDisplay(val: any) {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return val;
  // Use pure JS fallback if formatDateForDisplay utility relies on internal mapping
  return d.toISOString().split("T")[0]; // Just basic formatting for the input display placeholder
}

function togglePicker() {
  isOpen.value = !isOpen.value;
}

function updatePosition() {
  if (containerRef.value && dropdownRef.value && isOpen.value) {
    const rect = containerRef.value.getBoundingClientRect();
    const dropdownHeight = 350;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < dropdownHeight && rect.top > spaceBelow;

    dropdownStyle.value = {
      top: `${(openUp ? rect.top : rect.bottom) + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`,
      transform: openUp
        ? "translateY(-100%) translateY(-8px)"
        : "translateY(8px)",
    };
  }
}

watch(isOpen, (open) => {
  if (open) {
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
    isOpen.value = false;
  }
}

onMounted(() => {
  window.addEventListener("mousedown", handleOutsideClick);
});
onBeforeUnmount(() => {
  window.removeEventListener("mousedown", handleOutsideClick);
});

function onSelect(val: any, field: any) {
  field.handleChange(val);
  if (props.on_change) {
    props.on_change(val, null);
  }
  if (!props.is_range || (typeof val === "object" && val.end)) {
    isOpen.value = false;
  }
}
</script>
