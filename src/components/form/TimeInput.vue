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
          :error="field.state.meta.errors.length ? field.state.meta.errors : undefined"
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
            <div class="grid place-items-center cursor-pointer" @click="togglePicker">
              <slot name="right_component">
                <i class="mdi mdi-clock-outline text-gray-600 text-xl"></i>
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
            <TimePicker
              :value="field.state.value"
              :is-range="is_range"
              :is24-hour="is_24_hour"
              :use-object-value="use_object_value"
              @change="onSelect($event, field)"
            />
          </div>
        </Teleport>
      </div>
    </template>
  </InputParent>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick, type InputHTMLAttributes } from 'vue';
import { type InputProps } from "./Input.vue";
import TimePicker from "@/components/TimePicker.vue";

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

function formattedTime(val: any) {
  if (!val) return "";
  if (props.is_range && props.use_object_value && typeof val === 'object') {
    return `${val.startTime || '00:00'} - ${val.endTime || '00:00'}`;
  }
  return String(val);
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
      transform: openUp ? 'translateY(-100%) translateY(-8px)' : 'translateY(8px)'
    };
  }
}

watch(isOpen, (open) => {
  if (open) {
    nextTick(updatePosition);
    window.addEventListener('scroll', updatePosition, { capture: true });
    window.addEventListener('resize', updatePosition);
  } else {
    window.removeEventListener('scroll', updatePosition, { capture: true });
    window.removeEventListener('resize', updatePosition);
  }
});

function handleOutsideClick(e: MouseEvent) {
  if (!containerRef.value?.contains(e.target as Node) && !dropdownRef.value?.contains(e.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => { window.addEventListener('mousedown', handleOutsideClick); });
onBeforeUnmount(() => { window.removeEventListener('mousedown', handleOutsideClick); });

function onSelect(val: any, field: any) {
  field.handleChange(val);
  if (props.on_change) {
    props.on_change(val, null);
  }
}
</script>
