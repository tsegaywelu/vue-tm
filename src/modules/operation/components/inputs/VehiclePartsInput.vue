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
    parts.value = [newEmptyPart()];
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
  const err = validateArrayItems(parts.value, errors, partRules);
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
        const err = validateArrayItems(values, errors, partRules);
        return err ? [false, err] : [true, ''];
      },
    }"
    :name="props.name"
  >
    <div tabindex="0" :data-name="props.name" class="space-y-4 rounded">
      <div
        v-for="(part, i) in parts"
        :key="part.fakeId"
        class="flex flex-col md:flex-row items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100"
      >
        <div class="flex-1 w-full">
          <Input
            label="Vehicle Part"
            v-model="part.vehiclePart"
            :error="errors['vehiclePart_' + i]"
            @update:model-value="errors['vehiclePart_' + i] = ''"
          />
        </div>
        
        <div class="flex-1 w-full">
          <Input
            label="Price"
            type="number"
            v-model="part.price"
            :error="errors['price_' + i]"
            @update:model-value="errors['price_' + i] = ''"
          />
        </div>

        <div class="flex items-center gap-2 mt-4 md:mt-0">
          <input
            type="checkbox"
            :id="'isRepair_' + part.fakeId"
            v-model="part.isRepair"
            class="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
          />
          <label :for="'isRepair_' + part.fakeId" class="text-sm font-medium text-gray-700 cursor-pointer">
            Is Repair
          </label>
        </div>

        <div class="flex items-center gap-2 mt-4 md:mt-0">
          <button
            type="button"
            v-if="i == parts.length - 1"
            @click="add"
            class="h-11 px-4 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <i class="mdi mdi-plus text-xl"></i>
            <span class="ml-1 text-sm font-bold">Add</span>
          </button>
          
          <button
            type="button"
            v-if="parts.length > 1"
            @click="remove(part.fakeId)"
            class="h-11 w-11 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
          >
            <i class="mdi mdi-delete text-xl"></i>
          </button>
        </div>
      </div>
    </div>
  </InputParent>
</template>
