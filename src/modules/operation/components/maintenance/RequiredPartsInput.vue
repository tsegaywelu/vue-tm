<script setup lang="ts">
import { ref, watch, inject, onMounted, reactive } from "vue";
import Input from "@/components/common/Input.vue";
import Button from "@/components/Button.vue";
import InputParent from "@/components/form/InputParent.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required, validateArrayItems } from "@/utils/validations";
import { icons } from "@/utils/icons";
import { genId } from "@/utils/utils";

const props = defineProps<{
  name: string;
  initialValue?: string[];
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;

type PartItem = { fakeId: string; name: string };
const parts = ref<PartItem[]>([]);
const errors = reactive<Record<string, string>>({});

onMounted(() => {
  const values = props.initialValue || form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    parts.value = values.map((p: string) => ({
      fakeId: genId.next().value as string,
      name: p,
    }));
  } else {
    parts.value = [{ fakeId: genId.next().value as string, name: "" }];
  }
});

watch(parts, () => {
  form?.setFieldValue(props.name, parts.value.map(p => p.name));
}, { deep: true });

const addPart = () => {
  const err = validateArrayItems(parts.value, errors, { name: { required } });
  if (err) return;
  parts.value.push({ fakeId: genId.next().value as string, name: "" });
};

const removePart = (fakeId: string) => {
  parts.value = parts.value.filter(p => p.fakeId !== fakeId);
};
</script>

<template>
  <InputParent
    :name="props.name"
    :validation="{
      allPartsValid(values: string[]) {
        const err = validateArrayItems(parts, errors, { name: { required } });
        return err ? [false, err] : [true, ''];
      },
    }"
  >
    <Colapsable
      title="Required Parts"
      description="List any parts required to complete this task."
    >
      <div class="space-y-4">
        <div
          v-for="(part, index) in parts"
          :key="part.fakeId"
          class="flex items-end gap-4 bg-gray-50 p-4 rounded-lg relative"
        >
          <div class="flex-1">
            <Input
              v-model="part.name"
              label="Part Name"
              :name="`part_${part.fakeId}`"
              :attributes="{ placeholder: 'Enter part name' }"
              :error="errors[`name_${part.fakeId}`]"
            />
          </div>
          <Button
            v-if="parts.length > 1"
            type="button"
            variant="outline"
            class="w-fit text-error-600 border-error-200 hover:bg-error-50"
            @click="removePart(part.fakeId)"
          >
            Remove
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          class="mt-2"
          @click="addPart()"
        >
          <template #leading>
            <div class="size-4" v-html="icons.plus"></div>
          </template>
          Add Part
        </Button>
      </div>
    </Colapsable>
  </InputParent>
</template>
