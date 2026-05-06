<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch } from "vue";
import { genId } from "@/utils/utils";
import Select from "@/components/common/Select.vue";
import Input from "@/components/common/Input.vue";
import InputParent from "@/components/form/InputParent.vue";
import {
  required,
  number,
  validateArrayItems,
} from "@/utils/validations";

type Item = {
  fakeId: string;
  type: string;
  amount: number | string;
};

function newEmptyItem(): Item {
  return {
    fakeId: genId.next().value as string,
    type: "",
    amount: "",
  };
}

const props = defineProps<{
  name: string;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const items = ref<Item[]>([]);

// Reactive error map
const errors = reactive<Record<string, string>>({});

// Declarative validation rules per field
const itemRules = {
  type: { required },
  amount: { required, number },
};

onMounted(() => {
  const values: Item[] = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    items.value = values.map((el) => {
      return {
        ...el,
        fakeId: genId.next().value as string,
      };
    });
  } else {
    items.value = [newEmptyItem()];
  }
});

watch(
  items,
  () => {
    form.setFieldValue(props.name, items.value);
  },
  { deep: true },
);

function add() {
  const err = validateArrayItems(items.value, errors, itemRules);
  if (err) return;
  items.value.push(newEmptyItem());
}

function remove(id: string) {
  const idx = items.value.findIndex((el) => el.fakeId == id);
  if (idx == -1) return;
  items.value.splice(idx, 1);
}

const categoryOptions = [
  { label: 'Cover Damage', value: 'cover_damage' },
  { label: 'Motor BSG', value: 'motor_bsg' },
  { label: 'Carrier Liability', value: 'carrier_liability' },
  { label: 'Third Party', value: 'third_party' },
  { label: 'W_MEN', value: 'w_men' },
];
</script>

<template>
  <InputParent
    :validation="{
      allValuesExist(values: Item[]) {
        const err = validateArrayItems(values, errors, itemRules);
        return err ? [false, err] : [true, ''];
      },
    }"
    :name="props.name"
  >
    <div class="mt-6">
      <h3 class="text-sm font-semibold text-gray-700 mb-4">Insurance Categories</h3>
      <div tabindex="0" :data-name="props.name" class="space-y-4 rounded">
        <div
          v-for="(item, index) in items"
          :key="item.fakeId"
          class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50/50 border border-gray-100 p-4 rounded-xl relative"
        >
          <Select
            v-model="item.type"
            label="Category"
            :error="errors[`type_${item.fakeId}`]"
            :options="categoryOptions"
          />
          <Input
            v-model="item.amount"
            label="Amount"
            :error="errors[`amount_${item.fakeId}`]"
            type="number"
            :attributes="{
              placeholder: 'Enter Amount',
              step: '0.01'
            }"
          />
          <button
            v-if="items.length > 1"
            type="button"
            class="absolute size-5 top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
            @click="remove(item.fakeId)"
          >
            ✕
          </button>
        </div>
      </div>

      <button
        type="button"
        class="mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-[10px]"
        @click="add()"
      >
        <i class="mdi mdi-plus-circle-outline text-base"></i>
        Add Category
      </button>
    </div>
  </InputParent>
</template>
