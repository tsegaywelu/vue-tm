<template>
  <InputParent
    :name="name"
    :validation="validation"
    :match="match"
    :on_change="on_change"
  >
    <template #default="{ field }">
      <div
        class="cursor-pointer flex items-center gap-3 w-fit"
        :class="parent_class_name"
        tabindex="0"
        :data-name="name"
        @click="toggle(field)"
        @keydown.enter.prevent="toggle(field)"
        @keydown.space.prevent="toggle(field)"
      >
        <div
          class="relative transition-all duration-100 p-[1.33px] rounded-full h-4 w-7.5"
          :class="
            isToggledOn(field.state.value)
              ? 'primary-gradient bg-blue-600'
              : 'bg-[#F5F7F1]'
          "
        >
          <div
            class="absolute rounded-full transition-all duration-100 h-[13.3px] w-[13.3px] bg-white"
            :class="isToggledOn(field.state.value) ? 'left-[15px]' : 'left-px'"
            style="
              box-shadow:
                0px 1.33px 2.67px -1.33px #0a0d120f,
                0px 2.67px 4px -0.67px #0a0d121a;
            "
          ></div>
        </div>
        <span v-if="label" class="text-base text-gray-600 select-none">{{
          label
        }}</span>
      </div>
    </template>
  </InputParent>
</template>

<script setup lang="ts">
import InputParent from "./InputParent.vue";
import { type InputProps } from "./Input.vue";

export interface ToggleInputProps extends InputProps {
  on?: boolean;
}

const props = withDefaults(defineProps<ToggleInputProps>(), {
  label: "",
  parent_class_name: "",
  on: undefined,
  validation: () => ({}),
  attributes: () => ({}),
  on_change: undefined,
  match: "",
});

function isToggledOn(fieldValue: any) {
  const onValue = props.attributes.value;
  if (props.on !== undefined) return props.on;
  if (onValue !== undefined) return fieldValue === onValue;
  return !!fieldValue;
}

function toggle(field: any) {
  const currentState = isToggledOn(field.state.value);
  const nextOn = !currentState;

  const onValue = props.attributes.value;
  let nextValue;

  if (nextOn) {
    if (typeof onValue === "boolean") nextValue = true;
    else nextValue = onValue ?? true;
  } else {
    nextValue = false;
  }

  field.handleChange(nextValue);
}
</script>
