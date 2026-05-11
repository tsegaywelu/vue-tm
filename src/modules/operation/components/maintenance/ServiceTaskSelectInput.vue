<script setup lang="ts">
import { ref, watch, inject, onMounted, reactive } from "vue";
import Select from "@/components/common/Select.vue";
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

watch(
  tasks,
  () => {
    form?.setFieldValue(
      props.name,
      tasks.value.map((t) => t.taskId),
    );
  },
  { deep: true },
);

const addTask = () => {
  const err = validateArrayItems(
    tasks.value,
    errors,
    { taskId: { required } },
    "fakeId",
    true,
  );
  if (err) return;
  tasks.value.push({ fakeId: genId.next().value as string, taskId: "" });
};

const handleChange = (val: any, fakeId: string) => {
  errors[`taskId_${fakeId}`] = "";
};

const removeTask = (fakeId: string) => {
  tasks.value = tasks.value.filter((t) => t.fakeId !== fakeId);
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
      <div
        tabindex="0"
        :data-name="props.name"
        class="space-y-4 rounded grid grid-cols-4 gap-4"
      >
        <div
          v-for="(task, index) in tasks"
          :key="task.fakeId"
          class="grid grid-cols-[1fr,auto] gap-4 bg-gray-50/50 border border-gray-100 p-4 rounded-2xl relative"
        >
          <div>
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Service Task
              </label>
              <button
                v-if="tasks.length > 1"
                type="button"
                variant="outline"
                class="w-fit text-error-600 border-error-200 hover:bg-error-50"
                @click="removeTask(task.fakeId)"
              >
                <i v-html="icons.close"></i>
              </button>
            </div>
            <Select
              v-model="task.taskId"
              :attributes="{ placeholder: 'Choose task' }"
              searchable
              :label_key="(item: any) => item.name || item.label"
              :value_key="(item: any) => item._id || item.value"
              url="/service-task"
              :options="
                props.initialLabels?.[task.taskId]
                  ? [
                      {
                        label: props.initialLabels[task.taskId],
                        value: task.taskId,
                      },
                    ]
                  : []
              "
              :error="errors[`taskId_${task.fakeId}`]"
              @update:modelValue="(val: any) => handleChange(val, task.fakeId)"
            />
          </div>
        </div>
      </div>
      <Button type="button" variant="outline" class="mt-2" @click="addTask()">
        <template #leading>
          <div class="size-4" v-html="icons.plus"></div>
        </template>
        Add Task
      </Button>
    </Colapsable>
  </InputParent>
</template>
