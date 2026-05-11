<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch } from "vue";
import { genId } from "@/utils/utils";
import InputParent from "@/components/form/InputParent.vue";
import Select from "@/components/common/Select.vue";
import { required, validateArrayItems } from "@/utils/validations";
import InputError from "@/components/form/InputError.vue";
import { icons } from "@/utils/icons";

type MechanicItem = {
  fakeId: string;
  contactId: string;
};

function newEmptyMechanic(): MechanicItem {
  return {
    fakeId: genId.next().value as string,
    contactId: "",
  };
}

const props = defineProps<{
  name: string;
  initialLabels?: Record<string, string>;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const mechanics = ref<MechanicItem[]>([]);

const errors = reactive<Record<string, string>>({});

const rules = {
  contactId: { required },
};

onMounted(() => {
  const values: any[] = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    mechanics.value = values.map((el) => {
      const id = typeof el === "string" ? el : el?._id || el;
      return {
        contactId: id || "",
        fakeId: genId.next().value as string,
      };
    });
  } else {
    mechanics.value = [newEmptyMechanic()];
  }
});

watch(
  mechanics,
  () => {
    form.setFieldValue(
      props.name,
      mechanics.value.map((m) => m.contactId).filter((id) => id !== ""),
    );
  },
  { deep: true },
);

function add() {
  const err = validateArrayItems(
    mechanics.value,
    errors,
    rules,
    "fakeId",
    true,
  );
  if (err) return;
  mechanics.value.push(newEmptyMechanic());
}

function remove(id: string) {
  const idx = mechanics.value.findIndex((el) => el.fakeId == id);
  if (idx == -1) return;
  mechanics.value.splice(idx, 1);

  if (mechanics.value.length === 0) {
    mechanics.value.push(newEmptyMechanic());
  }
}
</script>

<template>
  <InputParent
    :validation="{
      allValuesExist(values: any[]) {
        if (!mechanics || mechanics.length === 0) return [true, ''];
        const err = validateArrayItems(
          mechanics,
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
    <div
      tabindex="0"
      :data-name="props.name"
      class="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 rounded gap-4"
    >
      <div
        v-for="(mechanic, i) in mechanics"
        :key="mechanic.fakeId"
        class="flex items-start gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 relative"
      >
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Contact</label
          >
          <Select
            v-model="mechanic.contactId"
            url="/contact"
            label_key="name"
            value_key="_id"
            searchable
            :params="
              (state: any) => {
                return {
                  group: 'MECHANIC',
                  name: { regexAny: state.search },
                  q: undefined,
                };
              }
            "
            :options="
              props.initialLabels?.[mechanic.contactId]
                ? [
                    {
                      label: props.initialLabels[mechanic.contactId],
                      value: mechanic.contactId,
                    },
                  ]
                : []
            "
            :initial_labels="props.initialLabels"
            :attributes="{ placeholder: 'Choose contact' }"
            @update:model-value="errors['contactId_' + mechanic.fakeId] = ''"
          />
          <InputError :error="errors['contactId_' + mechanic.fakeId]">
            {{ errors["contactId_" + mechanic.fakeId] }}
          </InputError>
        </div>

        <button
          type="button"
          class="absolute size-6 top-2 right-2 flex items-center justify-center text-error-600 hover:bg-error-50 rounded-full transition-colors"
          @click="remove(mechanic.fakeId)"
        >
          <div class="size-4" v-html="icons.close"></div>
        </button>
      </div>
    </div>

    <button
      type="button"
      class="mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs hover:opacity-80 transition-opacity"
      @click="add()"
    >
      <i class="mdi mdi-plus-circle-outline text-lg"></i>
      Add Contact
    </button>
  </InputParent>
</template>
