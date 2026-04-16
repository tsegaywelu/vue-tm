<template>
  <div
    class="flex items-center w-full bg-gray-50 rounded-2xl gap-0 input-focus overflow-visible"
    :class="[size_style, class_name]"
  >
    <!-- Category Dropdown -->
    <div v-if="options && options.length > 0" class="relative">
      <button
        type="button"
        @click="isOpen = !isOpen"
        class="h-full px-4 flex items-center gap-2 border-r border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors rounded-l-2xl whitespace-nowrap min-w-[120px] justify-between"
      >
        {{ selected_label }}
        <div class="size-4 opacity-60 ml-auto" v-html="icons.leftAngle" style="transform: rotate(-90deg);"></div>
      </button>

      <div
        v-if="isOpen"
        class="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-[100] py-2 overflow-hidden"
      >
        <div
          v-for="opt in options"
          :key="opt.value"
          @click="selectType(opt.value)"
          class="px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary cursor-pointer transition-colors"
          :class="{ 'bg-primary/10 text-primary font-semibold': type_value === opt.value }"
        >
          {{ opt.label }}
        </div>
      </div>
    </div>

    <!-- Search Icon -->
    <div class="pl-3 flex items-center pointer-events-none">
      <i v-if="pending" class="mdi mdi-loading mdi-spin text-gray-400" :class="icon_size"></i>
      <i v-else class="mdi mdi-magnify text-gray-400" :class="icon_size"></i>
    </div>

    <!-- Input Field -->
    <input
      ref="inputRef"
      type="text"
      name="search"
      autocomplete="off"
      class="focus:outline-none focus:shadow-none bg-transparent w-full min-w-0 h-full leading-6 px-3"
      :placeholder="placeholder || 'Search...'"
      :disabled="disabled"
      :value="model_value"
      @input="handleInput"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { icons } from '@/utils/icons'

export interface SearchOption {
  label: string;
  value: string;
}

export interface SearchInputProps {
  model_value?: string;
  type_value?: string;
  options?: SearchOption[];
  disabled?: boolean;
  capitalize?: boolean;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  class_name?: string;
  pending?: boolean;
}

const props = withDefaults(defineProps<SearchInputProps>(), {
  model_value: "",
  type_value: "",
  options: () => [],
  disabled: false,
  capitalize: false,
  placeholder: "",
  size: "sm",
  class_name: "",
  pending: false
});

const emit = defineEmits<{
  (e: 'update:model_value', val: string): void;
  (e: 'update:type_value', val: string): void;
  (e: 'change', ev: Event): void;
}>();

const isOpen = ref(false);

const selected_label = computed(() => {
  const opt = props.options.find(o => o.value === props.type_value);
  return opt ? opt.label : 'Select Type';
});

const size_style = computed(() => {
  const map: Record<string, string> = {
    sm: "h-10",
    md: "h-12",
    lg: "h-14"
  };
  return map[props.size] || map.md;
});

const icon_size = computed(() => {
  const map: Record<string, string> = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  };
  return map[props.size] || map.md;
});

function handleInput(ev: Event) {
  const target = ev.target as HTMLInputElement;
  let val = target.value;
  if (props.capitalize && val) {
    val = val.trim().charAt(0).toUpperCase() + val.slice(1);
    target.value = val;
  }
  emit('update:model_value', val);
  emit('change', ev);
}

function selectType(val: string) {
  emit('update:type_value', val);
  isOpen.value = false;
}

// Click outside to close
const handleClickOutside = (e: MouseEvent) => {
  if (isOpen.value && !(e.target as HTMLElement).closest('.relative')) {
    isOpen.value = false;
  }
};

onMounted(() => window.addEventListener('click', handleClickOutside));
onUnmounted(() => window.removeEventListener('click', handleClickOutside));
</script>
