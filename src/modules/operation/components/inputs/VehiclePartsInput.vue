<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch } from "vue";
import { genId } from "@/utils/utils";
import InputParent from "@/components/form/InputParent.vue";
import Input from "@/components/common/Input.vue";
import {
  required,
  number,
  price,
  validateArrayItems,
} from "@/utils/validations";
import { icons } from "@/utils/icons";

type VehiclePart = {
  fakeId: string;
  vehiclePart: string;
  price: number | string;
  isRepair: boolean;
};

function newEmptyPart(): VehiclePart {
  return {
    fakeId: genId.next().value as string,
    vehiclePart: "",
    price: "",
    isRepair: false,
  };
}

const props = defineProps<{
  name: string;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const parts = ref<VehiclePart[]>([]);

const errors = reactive<Record<string, string>>({});

const partRules = {
  vehiclePart: { required },
  price: { required, price },
};

onMounted(() => {
  const values: VehiclePart[] = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    parts.value = values.map((el) => {
      return {
        ...el,
        fakeId: genId.next().value as string,
      };
    });
  } else {
    parts.value = [];
  }
});

watch(
  parts,
  () => {
    form.setFieldValue(props.name, parts.value);
  },
  { deep: true },
);

function add() {
  const err = validateArrayItems(
    parts.value,
    errors,
    partRules,
    "fakeId",
    true,
  );
  if (err) return;
  parts.value.push(newEmptyPart());
}

function remove(id: string) {
  const idx = parts.value.findIndex((el) => el.fakeId == id);
  if (idx == -1) return;
  parts.value.splice(idx, 1);
}
</script>

<template>
  <InputParent
    :validation="{
      allValuesExist(values: VehiclePart[]) {
        const err = validateArrayItems(
          values,
          errors,
          partRules,
          'fakeId',
          true,
        );
        return err ? [false, err] : [true, ''];
      },
    }"
    :name="props.name"
  >
    <div tabindex="0" :data-name="props.name" class="space-y-4 rounded">
      <div
        v-for="(part, i) in parts"
        :key="part.fakeId"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 relative"
      >
        <div class="lg:col-span-2">
          <Input
            label="Vehicle Part"
            v-model="part.vehiclePart"
            :error="errors['vehiclePart_' + part.fakeId]"
            @update:model-value="errors['vehiclePart_' + part.fakeId] = ''"
            :attributes="{ placeholder: 'e.g. Front Bumper, Engine Oil' }"
          />
        </div>

        <div class="lg:col-span-2">
          <Input
            label="Price"
            type="number"
            v-model="part.price"
            :error="errors['price_' + part.fakeId]"
            @update:model-value="errors['price_' + part.fakeId] = ''"
            :attributes="{ placeholder: 'Enter price' }"
          />
        </div>

        <div class="flex items-center gap-2 mt-4 lg:mt-6">
          <input
            type="checkbox"
            :id="'isRepair_' + part.fakeId"
            v-model="part.isRepair"
            class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
          />
          <label
            :for="'isRepair_' + part.fakeId"
            class="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Is Repair
          </label>
        </div>

        <button
          v-if="parts.length > 1"
          type="button"
          class="absolute size-6 top-2 right-2 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          @click="remove(part.fakeId)"
        >
          <i v-html="icons.close"></i>
        </button>
      </div>
    </div>

    <button
      type="button"
      class="mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs hover:opacity-80 transition-opacity"
      @click="add()"
    >
      <i class="mdi mdi-plus-circle-outline text-lg"></i>
      Add Part
    </button>
  </InputParent>
</template>
