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
            :value="formattedTime(field.state.value)"
            @click="togglePicker"
            autocomplete="off"
            placeholder="00:00"
            v-bind="attributes"
          />

          <template #right_component>
            <div
              class="grid place-items-center cursor-pointer"
              @click="togglePicker"
            >
              <slot name="right_component">
                <i v-html="icons.clock" />
              </slot>
            </div>
          </template>
        </InputLayout>

        <!-- Desktop: positioned picker -->
        <Teleport v-if="!isMobile" to="body">
          <div
            v-if="isOpen"
            ref="dropdownRef"
            class="fixed z-9999"
            :style="dropdownStyle"
          >
            <TimePicker
              :value="field.state.value"
              :is-range="is_range"
              :is24-hour="is_24_hour"
              :use-object-value="use_object_value"
              @change="onSelect($event, field)"
            />
          </div>
        </Teleport>

        <!-- Mobile: bottom sheet -->
        <BottomSheet v-if="isMobile" v-model="isOpen" :title="label || 'Select Time'">
          <div class="px-4 py-4 w-full">
            <TimePicker
              class="w-full"
              :value="field.state.value"
              :is-range="is_range"
              :is24-hour="is_24_hour"
              :use-object-value="use_object_value"
              @change="onSelect($event, field)"
            />
          </div>
        </BottomSheet>
      </div>
    </template>
  </InputParent>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import InputParent from "./InputParent.vue";
import InputLayout from "./InputLayout.vue";
import { type InputProps } from "./Input.vue";
import TimePicker from "@/components/TimePicker.vue";
import { icons } from "@/utils/icons";
import { useIsMobile } from "@/composables/useIsMobile";
import BottomSheet from "@/components/BottomSheet.vue";

const { isMobile } = useIsMobile();

export interface TimeInputProps extends InputProps {
  is_range?: boolean;
  is_24_hour?: boolean;
  use_object_value?: boolean;
}

const props = withDefaults(defineProps<TimeInputProps>(), {
  match: "",
  on_change: undefined,
  validation: () => ({}),
  attributes: () => ({}),
  is_range: false,
  is_24_hour: false,
  use_object_value: false,

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

const containerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({});

function formatSingle(raw: string): string {
  if (!raw) return "";
  const [h, m] = raw.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return raw;
  if (props.is_24_hour)
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  const p = h >= 12 ? "PM" : "AM";
  const dh = h % 12 || 12;
  return `${dh.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${p}`;
}

function formattedTime(val: any): string {
  if (!val) return "";
  if (props.is_range) {
    if (typeof val === "string" && val.includes("-")) {
      const [s, e] = val.split("-");
      return `${formatSingle(s)} - ${formatSingle(e)}`;
    }
    if (typeof val === "object" && val !== null) {
      return `${formatSingle(val.startTime || "")} - ${formatSingle(val.endTime || "")}`;
    }
  }
  return formatSingle(typeof val === "string" ? val : "");
}

function togglePicker() {
  isOpen.value = !isOpen.value;
}

function updatePosition() {
  if (containerRef.value && dropdownRef.value && isOpen.value) {
    const rect = containerRef.value.getBoundingClientRect();
    const dropdownHeight = 250;
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
}
</script>
