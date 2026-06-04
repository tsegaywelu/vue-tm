<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch } from "vue";
import Input from "@/components/common/Input.vue";
import InputParent from "@/components/form/InputParent.vue";
import { genId } from "@/utils/utils";
import { icons } from "@/utils/icons";
import {
  required,
  number,
  price,
  validateArrayItems,
} from "@/utils/validations";

type SerialPrice = {
  fakeId: string;
  serialNumber: string;
  price: string | number;
};

function newEmptySerial(): SerialPrice {
  return {
    fakeId: genId.next().value as string,
    serialNumber: "",
    price: "",
  };
}

const props = defineProps<{
  name: string;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const serials = ref<SerialPrice[]>([]);

const errors = reactive<Record<string, string>>({});

const serialRules = {
  serialNumber: { required },
  price: { required, price },
};

onMounted(() => {
  const values: any[] = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    serials.value = values.map((el) => {
      return {
        ...el,
        fakeId: el.fakeId || genId.next().value as string,
      };
    });
  } else {
    serials.value = [newEmptySerial()];
  }
});

watch(
  serials,
  () => {
    form.setFieldValue(props.name, serials.value);
  },
  { deep: true },
);

function add() {
  const err = validateArrayItems(serials.value, errors, serialRules);
  if (err) return;
  serials.value.push(newEmptySerial());
}

function remove(id: string) {
  const idx = serials.value.findIndex((el) => el.fakeId == id);
  if (idx == -1) return;
  serials.value.splice(idx, 1);
}
</script>

<template>
  <InputParent
    :validation="{
      allValuesExist(values: SerialPrice[]) {
        const err = validateArrayItems(values, errors, serialRules);
        return err ? [false, err] : [true, ''];
      },
    }"
    :name="props.name"
  >
    <div class="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-bold text-gray-900">Serialized Item Details</h3>
          <p class="text-xs text-gray-500">Manage serial numbers and pricing for each unit.</p>
        </div>
      </div>

      <div tabindex="0" :data-name="props.name" class="space-y-4">
        <div
          v-for="(serial, index) in serials"
          :key="serial.fakeId"
          class="flex items-end gap-4 p-4 bg-surface rounded-xl border border-gray-100 relative"
        >
          <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="serial.serialNumber"
              :label="'Serial Number ' + (index + 1)"
              :error="errors[`serialNumber_${serial.fakeId}`]"
              placeholder="Enter serial number"
              required
            />
            <Input
              v-model="serial.price"
              label="Price"
              :error="errors[`price_${serial.fakeId}`]"
              type="number"
              placeholder="0.00"
              required
            />
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              @click="add"
              class="size-12 flex items-center justify-center bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
            >
              <i v-html="icons.plus" class="size-6" />
            </button>
            <button
              v-if="serials.length > 1"
              type="button"
              @click="remove(serial.fakeId)"
              class="size-12 flex items-center justify-center bg-error-50 text-error-600 rounded-xl hover:bg-error-100 transition-colors"
            >
              <i v-html="icons.delete" class="size-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </InputParent>
</template>
