<script setup lang="ts">
import Input from "@/components/common/Input.vue";
import { inject, onMounted, ref, reactive, watch } from "vue";
import { genId } from "@/utils/utils";
import InputParent from "@/components/form/InputParent.vue";
import { required, number, validateArrayItems } from "@/utils/validations";
import Select from "@/components/common/Select.vue";

type Item = {
  fakeId: string;
  title: string;
  penaltyAmount: number | string;
  description?: string;
};

function newEmptyItem(): Item {
  return {
    fakeId: genId.next().value as string,
    title: "",
    penaltyAmount: "",
    description: "",
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
  title: { required },
  penaltyAmount: { required, number },
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
    <div class="mt-8">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Infraction Items</h3>
      <div tabindex="0" :data-name="props.name" class="space-y-4 rounded">
        <div
          v-for="(item, index) in items"
          :key="item.fakeId"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 border border-gray-100 p-4 rounded-2xl relative"
        >
          <div class="md:col-span-1">
            <Select
              url="/infraction-type"
              label_key="name"
              value_key="_id"
              v-model="item.title"
              label="Title / Offense Reason"
              :error="errors[`title_${item.fakeId}`]"
              :attributes="{
                placeholder: 'violation',
              }"
            />
          </div>
          <div class="md:col-span-1">
            <Input
              v-model="item.penaltyAmount"
              label="Fine / Penalty Amount"
              :error="errors[`penaltyAmount_${item.fakeId}`]"
              type="number"
              :attributes="{
                placeholder: 'Enter Amount',
              }"
            />
          </div>
          <div class="md:col-span-1">
            <Input
              v-model="item.description"
              label="Notes"
              :attributes="{
                placeholder: 'Optional comments',
              }"
            />
          </div>
          <button
            v-if="items.length > 1"
            type="button"
            class="absolute size-5 top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center font-bold"
            @click="remove(item.fakeId)"
          >
            ✕
          </button>
        </div>
      </div>

      <button
        type="button"
        class="mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs"
        @click="add()"
      >
        <i class="mdi mdi-plus-circle-outline text-lg"></i>
        Add Infraction Item
      </button>
    </div>
  </InputParent>
</template>
