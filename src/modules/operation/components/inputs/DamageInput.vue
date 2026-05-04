<script setup lang="ts">
import SelectInput from "@/components/common/Select.vue";
import Input from "@/components/common/Input.vue";
import { inject, onMounted, ref, reactive, watch } from "vue";
import { genId } from "@/utils/utils";
import Select from "@/components/common/Select.vue";
import InputParent from "@/components/form/InputParent.vue";
import {
  required,
  number,
  price,
  validateArrayItems,
} from "@/utils/validations";

type Item = {
  fakeId: string;
  item: string;
  uom: string;
  unitPrice: string;
  quantity: number | string;
};

function newEmptyItem(): Item {
  return {
    fakeId: genId.next().value as string,
    item: "",
    uom: "",
    unitPrice: "",
    quantity: "",
  };
}

const props = defineProps<{
  name: string;
  shipperId: string;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const items = ref<Item[]>([]);

// Reactive error map: keys like "item_0", "uom_1", "unitPrice_2", "quantity_0"
const errors = reactive<Record<string, string>>({});

// Declarative validation rules per field
const itemRules = {
  item: { required },
  uom: { required },
  unitPrice: { required, price },
  quantity: { required, number },
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
      <h3 class="text-lg font-bold text-gray-900 mb-4">Items Details</h3>
      <div tabindex="0" :data-name="props.name" class="space-y-4 rounded">
        <div
          v-for="(item, index) in items"
          :key="item.fakeId"
          class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 border border-gray-100 p-4 rounded-2xl relative"
        >
          <div class="md:col-span-4">
            <SelectInput
              v-model="item.item"
              label="Commodity"
              :error="errors[`item_${item.fakeId}`]"
              :params="{
                page: undefined,
                limit: undefined,
              }"
              :url="`/commodity/carrier/${props.shipperId}`"
              label_key="name"
              value_key="_id"
              searchable
            />
          </div>
          <Select
            v-model="item.uom"
            label="UOM"
            :error="errors[`uom_${item.fakeId}`]"
            :options="[
              { label: 'PCS', value: 'pcs' },
              { label: 'CTN', value: 'ctn' },
              { label: 'BOX', value: 'box' },
              { label: 'BAG', value: 'bag' },
              { label: 'SET', value: 'set' },
              { label: 'KG', value: 'kg' },
              { label: 'DOZ', value: 'doz' },
              { label: 'LTR', value: 'ltr' },
              { label: 'GAL', value: 'gal' },
              { label: 'BULK', value: 'bulk' },
            ]"
          />
          <Input
            v-model="item.unitPrice"
            label="Unit Price"
            :error="errors[`unitPrice_${item.fakeId}`]"
            type="number"
            :attributes="{
              placeholder: 'Enter Price',
            }"
          />
          <Input
            v-model="item.quantity"
            label="Quantity"
            :error="errors[`quantity_${item.fakeId}`]"
            type="number"
            :attributes="{
              placeholder: 'Enter Quantity',
            }"
          />
          <button
            v-if="items.length > 1"
            type="button"
            class="absolute size-5 top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
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
        Add Item
      </button>
    </div>
  </InputParent>
</template>
