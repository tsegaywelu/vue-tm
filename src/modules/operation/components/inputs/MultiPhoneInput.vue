<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch, nextTick } from "vue";
import { genId } from "@/utils/utils";
import InputParent from "@/components/form/InputParent.vue";
import BaseInput from "@/components/common/Input.vue";
import { required, phone, validateArrayItems } from "@/utils/validations";
import { icons } from "@/utils/icons";

type PhoneItem = {
  fakeId: string;
  number: string;
};

function newEmptyPhone(): PhoneItem {
  return {
    fakeId: genId.next().value as string,
    number: "",
  };
}

const props = defineProps<{
  name: string;
  label?: string;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const phoneNumbers = ref<PhoneItem[]>([]);

const errors = reactive<Record<string, string>>({});

const rules = {
  number: { required, phone },
};

onMounted(() => {
  const values: any[] = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    phoneNumbers.value = values.map((val) => {
      // Handle both string arrays and object arrays
      const num =
        typeof val === "string"
          ? val.replace(/^\+251/, "")
          : val.number?.replace(/^\+251/, "") || "";
      return {
        number: num,
        fakeId: genId.next().value as string,
      };
    });
  } else {
    phoneNumbers.value = [newEmptyPhone()];
  }
});

watch(
  phoneNumbers,
  () => {
    form.setFieldValue(
      props.name,
      phoneNumbers.value
        .filter((p) => p.number.trim() !== "")
        .map((p) =>
          p.number.startsWith("+251") ? p.number : `+251${p.number}`,
        ),
    );
  },
  { deep: true },
);

function add() {
  const err = validateArrayItems(
    phoneNumbers.value,
    errors,
    rules,
    "fakeId",
    true,
  );
  if (err) return;
  phoneNumbers.value.push(newEmptyPhone());
}

function handleNumberUpdate(id: string) {
  if (errors["number_" + id]) {
    errors["number_" + id] = "";
  }
  // Trigger validation on update to keep form state in sync
  validateArrayItems(phoneNumbers.value, errors, rules, "fakeId", true);
}

function remove(id: string) {
  const idx = phoneNumbers.value.findIndex((el) => el.fakeId == id);
  if (idx == -1) return;
  phoneNumbers.value.splice(idx, 1);

  if (phoneNumbers.value.length === 0) {
    phoneNumbers.value.push(newEmptyPhone());
  }
}
</script>

<template>
  <InputParent
    :validation="{
      allPhonesValid() {
        const err = validateArrayItems(
          phoneNumbers,
          errors,
          rules,
          'fakeId',
          true,
        );
        return err ? [false, err] : [true, ''];
      },
    }"
    :name="props.name"
  >
    <div class="mt-6">
      <div class="flex justify-between items-center mb-3">
        <label class="text-sm font-bold text-grey-700">{{
          label || "Phone Numbers"
        }}</label>
        <button
          type="button"
          class="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity"
          @click="add"
        >
          <i class="mdi mdi-plus-circle-outline text-base"></i>
          Add Phone
        </button>
      </div>

      <div
        tabindex="0"
        :data-name="props.name"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div
          v-for="(phoneItem, i) in phoneNumbers"
          :key="phoneItem.fakeId"
          class="flex flex-col gap-1 relative bg-gray-50/50 p-4 rounded-2xl border border-gray-100"
        >
          <div class="flex justify-between items-center mb-1">
            <span
              class="text-xs font-bold text-gray-500 uppercase tracking-wider"
              >Phone {{ i + 1 }}</span
            >
            <button
              v-if="phoneNumbers.length > 1"
              type="button"
              class="size-6 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
              @click="remove(phoneItem.fakeId)"
            >
              <i v-html="icons.close"></i>
            </button>
          </div>

          <BaseInput
            v-model="phoneItem.number"
            :error="errors['number_' + phoneItem.fakeId]"
            :attributes="{ placeholder: '911223344', type: 'tel' }"
            @update:model-value="handleNumberUpdate(phoneItem.fakeId)"
          >
            <template #left_component>
              <div
                class="pointer-events-none flex items-center gap-1 pr-2 border-r border-line mr-2"
              >
                <i v-html="icons.phone" class="text-gray-400"></i>
              </div>
            </template>
          </BaseInput>
        </div>
      </div>
    </div>
  </InputParent>
</template>
