<script setup lang="ts">
import { ref, watch, inject, onMounted, reactive } from "vue";
import Select from "@/components/common/Select.vue";
import Input from "@/components/common/Input.vue";
import Textarea from "@/components/common/Textarea.vue";
import Button from "@/components/Button.vue";
import InputParent from "@/components/form/InputParent.vue";
import { required, validateArrayItems } from "@/utils/validations";
import { icons } from "@/utils/icons";
import { genId } from "@/utils/utils";
import { fetch_service_task_by_id } from "../../api/service-task.api";

const props = defineProps<{
  name: string;
  initialLabels?: Record<string, string>;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;

type TaskItem = {
  fakeId: string;
  serviceTask: string;
  code: string;
  status: string;
  taskStartTime: string;
  taskEndTime: string;
  requiredParts: string;
  __fromServiceType?: boolean;
};

const tasks = ref<TaskItem[]>([]);
const errors = reactive<Record<string, string>>({});

const rules = {
  serviceTask: { required },
  taskStartTime: { required },
};

onMounted(() => {
  const values = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    tasks.value = values.map((t: any) => ({
      ...t,
      fakeId: t.fakeId || (genId.next().value as string),
    }));
  }
});

watch(
  tasks,
  (newVal) => {
    form?.setFieldValue(props.name, newVal);
  },
  { deep: true },
);

// Sync from outside (e.g. when Service Type selection adds tasks)
watch(
  () => form?.getFieldValue(props.name),
  (newVal) => {
    const currentValues = tasks.value.map(({ fakeId, ...rest }) => rest);
    if (JSON.stringify(newVal) !== JSON.stringify(currentValues)) {
      tasks.value = (newVal || []).map((t: any) => ({
        ...t,
        fakeId: t.fakeId || (genId.next().value as string),
      }));
    }
  },
  { deep: true },
);

const addTask = () => {
  const err = validateArrayItems(tasks.value, errors, rules, "fakeId", true);
  if (err) return;

  const startTime = form.getFieldValue("startDate")
    ? `${form.getFieldValue("startDate")}T00:00`
    : "";

  tasks.value.push({
    fakeId: genId.next().value as string,
    serviceTask: "",
    code: "",
    status: "PENDING",
    taskStartTime: startTime,
    taskEndTime: "",
    requiredParts: "",
    __fromServiceType: false,
  });
};

const removeTask = (fakeId: string) => {
  tasks.value = tasks.value.filter((t) => t.fakeId !== fakeId);
};

const handleTaskChange = async (taskId: string, item: TaskItem) => {
  if (!taskId) return;
  errors[`serviceTask_${item.fakeId}`] = "";

  try {
    const res = await fetch_service_task_by_id(taskId);
    if (res.success) {
      item.code = res.data.code || "";
      item.requiredParts = res.data.requiredParts?.join(", ") || "";
    }
  } catch (err) {
    console.error("Failed to fetch task details", err);
  }
};
</script>

<template>
  <InputParent
    :name="props.name"
    :validation="{
      allTasksValid(values: any[]) {
        const err = validateArrayItems(values, errors, rules, 'fakeId');
        return err ? [false, err] : [true, ''];
      },
    }"
  >
    <div tabindex="0" :data-name="props.name" class="space-y-6">
      <div
        v-for="(task, index) in tasks"
        :key="task.fakeId"
        class="border border-line rounded-lg overflow-hidden"
      >
        <div
          class="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-line"
        >
          <span class="font-semibold text-gray-700">Task {{ index + 1 }}</span>
          <button
            type="button"
            class="text-error-600 size-8 flex items-center justify-center hover:bg-error-50 rounded-full transition-colors"
            @click="removeTask(task.fakeId)"
          >
            <div class="size-4" v-html="icons.close"></div>
          </button>
        </div>
        <div class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Select
            label="Service Task"
            v-model="task.serviceTask"
            :attributes="{ placeholder: 'Choose task' }"
            searchable
            :label_key="(item: any) => item.name || item.label"
            :value_key="(item: any) => item._id || item.value"
            url="/service-task"
            :options="
              props.initialLabels?.[task.serviceTask]
                ? [
                    {
                      label: props.initialLabels[task.serviceTask],
                      value: task.serviceTask,
                    },
                  ]
                : []
            "
            :error="errors[`serviceTask_${task.fakeId}`]"
            @update:modelValue="(val: any) => handleTaskChange(val, task)"
          />

          <Input
            v-model="task.code"
            label="Code"
            :attributes="{ placeholder: 'Task code' }"
            :error="errors[`code_${task.fakeId}`]"
          />

          <Input
            v-model="task.status"
            label="Status"
            :attributes="{ placeholder: 'Current status' }"
            :error="errors[`status_${task.fakeId}`]"
          />

          <Input
            v-model="task.taskStartTime"
            label="Task Start Time"
            type="datetime-local"
            :error="errors[`taskStartTime_${task.fakeId}`]"
          />

          <Input
            v-model="task.taskEndTime"
            label="Task End Time"
            type="datetime-local"
            :error="errors[`taskEndTime_${task.fakeId}`]"
          />

          <Textarea
            v-model="task.requiredParts"
            label="Required Parts"
            :attributes="{
              placeholder: 'List parts required for this task',
            }"
            :error="errors[`requiredParts_${task.fakeId}`]"
          />
        </div>
      </div>

      <Button type="button" variant="outline" class="mt-2" @click="addTask()">
        <template #leading>
          <div class="size-4" v-html="icons.plus"></div>
        </template>
        Add Service Task
      </Button>
    </div>
  </InputParent>
</template>
