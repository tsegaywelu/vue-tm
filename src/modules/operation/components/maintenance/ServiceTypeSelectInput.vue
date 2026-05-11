<script setup lang="ts">
import { ref, watch, inject, onMounted, reactive } from "vue";
import Select from "@/components/common/Select.vue";
import Button from "@/components/Button.vue";
import InputParent from "@/components/form/InputParent.vue";
import { required, validateArrayItems } from "@/utils/validations";
import { icons } from "@/utils/icons";
import { genId } from "@/utils/utils";

const props = defineProps<{
  name: string;
  initialLabels?: Record<string, string>;
}>();

const emit = defineEmits(["change"]);

const formContext = inject<any>("formContext");
const form = formContext?.form;

type ServiceTypeItem = { fakeId: string; serviceTypeId: string };
const serviceTypes = ref<ServiceTypeItem[]>([]);
const errors = reactive<Record<string, string>>({});

const rules = {
  serviceTypeId: { required },
};

onMounted(() => {
  const values = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    serviceTypes.value = values.map((id: string) => ({
      fakeId: genId.next().value as string,
      serviceTypeId: id,
    }));
  } else {
    serviceTypes.value = [
      { fakeId: genId.next().value as string, serviceTypeId: "" },
    ];
  }
});

watch(
  serviceTypes,
  () => {
    form?.setFieldValue(
      props.name,
      serviceTypes.value.map((s) => s.serviceTypeId),
    );
  },
  { deep: true },
);

const addServiceType = () => {
  const err = validateArrayItems(
    serviceTypes.value,
    errors,
    rules,
    "fakeId",
    true,
  );
  if (err) return;
  serviceTypes.value.push({
    fakeId: genId.next().value as string,
    serviceTypeId: "",
  });
};

const removeServiceType = (fakeId: string) => {
  serviceTypes.value = serviceTypes.value.filter((s) => s.fakeId !== fakeId);
  if (serviceTypes.value.length === 0) {
    serviceTypes.value.push({
      fakeId: genId.next().value as string,
      serviceTypeId: "",
    });
  }
};

const handleChange = (val: any, fakeId: string) => {
  errors[`serviceTypeId_${fakeId}`] = "";
  emit("change", val);
};
</script>

<template>
  <InputParent
    :name="props.name"
    :validation="{
      allValuesValid() {
        const err = validateArrayItems(serviceTypes, errors, rules, 'fakeId');
        console.log(err);
        return err ? [false, err] : [true, ''];
      },
    }"
  >
    <div
      tabindex="0"
      :data-name="props.name"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 rounded"
    >
      <div
        v-for="(st, index) in serviceTypes"
        :key="st.fakeId"
        class="bg-gray-50/50 border border-gray-100 p-4 rounded-2xl relative flex flex-col gap-2"
      >
        <button
          v-if="serviceTypes.length > 1"
          type="button"
          class="absolute size-6 top-2 text-error right-2 flex items-center justify-center text-error-600 hover:bg-error-50 rounded-full transition-colors"
          @click="removeServiceType(st.fakeId)"
        >
          x
        </button>

        <label class="block text-sm font-medium text-gray-700">
          Service Type
        </label>
        <Select
          v-model="st.serviceTypeId"
          :attributes="{ placeholder: 'Choose service type' }"
          searchable
          :label_key="(item: any) => item.name || item.label"
          :value_key="(item: any) => item._id || item.value"
          url="/service-type"
          :options="
            props.initialLabels?.[st.serviceTypeId]
              ? [
                  {
                    label: props.initialLabels[st.serviceTypeId],
                    value: st.serviceTypeId,
                  },
                ]
              : []
          "
          :error="errors[`serviceTypeId_${st.fakeId}`]"
          @update:modelValue="(val: any) => handleChange(val, st.fakeId)"
        />
      </div>

      <div class="col-span-full">
        <Button
          type="button"
          variant="outline"
          class="mt-2"
          @click="addServiceType()"
        >
          <template #leading>
            <div class="size-4" v-html="icons.plus"></div>
          </template>
          Add Service Type
        </Button>
      </div>
    </div>
  </InputParent>
</template>
