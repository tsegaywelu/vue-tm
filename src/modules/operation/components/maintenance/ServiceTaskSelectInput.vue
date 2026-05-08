<script setup lang="ts">
import { ref, watch, inject, onMounted, reactive } from "vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Button from "@/components/Button.vue";
import InputParent from "@/components/form/InputParent.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required, validateArrayItems } from "@/utils/validations";
import { icons } from "@/utils/icons";
import { genId } from "@/utils/utils";

const props = defineProps<{
  name: string;
  initialValue?: string[];
  initialLabels?: Record<string, string>;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;

type TaskItem = { fakeId: string; taskId: string };
const tasks = ref<TaskItem[]>([]);
const errors = reactive<Record<string, string>>({});

onMounted(() => {
  const values = props.initialValue || form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    tasks.value = values.map((id: string) => ({
      fakeId: genId.next().value as string,
      taskId: id,
    }));
  } else {
    tasks.value = [{ fakeId: genId.next().value as string, taskId: "" }];
  }
});

watch(tasks, () => {
  form?.setFieldValue(props.name, tasks.value.map(t => t.taskId));
}, { deep: true });

const addTask = () => {
  const err = validateArrayItems(tasks.value, errors, { taskId: { required } });
  if (err) return;
  tasks.value.push({ fakeId: genId.next().value as string, taskId: "" });
};

const removeTask = (fakeId: string) => {
  tasks.value = tasks.value.filter(t => t.fakeId !== fakeId);
};
</script>

<template>
  <InputParent
    :name="props.name"
    :validation="{
      allTasksValid(values: string[]) {
        const err = validateArrayItems(tasks, errors, { taskId: { required } });
        return err ? [false, err] : [true, ''];
      },
    }"
  >
    <Colapsable
      title="Service Tasks"
      description="Select the tasks included in this service type."
    >
      <div class="space-y-4">
        <div
          v-for="(task, index) in tasks"
          :key="task.fakeId"
          class="flex items-end gap-4 bg-gray-50 p-4 rounded-lg relative"
        >
          <div class="flex-1">
            <SelectInput
              v-model="task.taskId"
              label="Service Task"
              :name="`task_${task.fakeId}`"
              :attributes="{ placeholder: 'Choose service task' }"
              searchable
              label_key="name"
              value_key="_id"
              url="/service-task"
              :initial_label="initialLabels?.[task.taskId]"
              :error="errors[`taskId_${task.fakeId}`]"
            />
          </div>
          <Button
            v-if="tasks.length > 1"
            type="button"
            variant="outline"
            class="w-fit text-error-600 border-error-200 hover:bg-error-50"
            @click="removeTask(task.fakeId)"
          >
            Remove
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          class="mt-2"
          @click="addTask()"
        >
          <template #leading>
            <div class="size-4" v-html="icons.plus"></div>
          </template>
          Add Service Task
        </Button>
      </div>
    </Colapsable>
  </InputParent>
</template>
