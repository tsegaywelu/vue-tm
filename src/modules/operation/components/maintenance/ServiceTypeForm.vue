<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the service type."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="name"
            label="Name"
            :attributes="{
              placeholder: 'Enter service type name',
            }"
            :validation="{
              required,
            }"
          />
        </div>
        <div class="mt-6">
          <TextareaInput
            name="description"
            label="Description"
            :attributes="{
              placeholder: 'Enter description',
              rows: 3,
            }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Service Tasks"
        description="Select the tasks included in this service type."
      >
        <div class="space-y-4">
          <div
            v-for="(task, index) in localTasks"
            :key="index"
            class="flex items-end gap-4 bg-gray-50 p-4 rounded-lg relative"
          >
            <div class="flex-1">
              <SelectInput
                :name="`serviceTasks.${index}`"
                label="Service Task"
                :attributes="{
                  placeholder: 'Choose service task',
                }"
                searchable
                label_key="name"
                value_key="_id"
                url="/service-task"
                :validation="{
                  required,
                }"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              class="w-fit text-error-600 border-error-200 hover:bg-error-50"
              @click="removeTaskRow(index, form)"
            >
              Remove
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            class="mt-2"
            @click="addTaskRow(form)"
          >
            <template #leading>
              <div class="size-4" v-html="icons.plus"></div>
            </template>
            Add Service Task
          </Button>
        </div>
      </Colapsable>

      <!-- Action Footer -->
      <div class="pt-10 flex justify-end gap-4">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import Button from "@/components/Button.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const localTasks = ref<any[]>(props.initialValues.serviceTasks || [""]);

// Watch for changes in initialValues (especially for edit mode)
watch(() => props.initialValues.serviceTasks, (newVal) => {
  localTasks.value = newVal && newVal.length > 0 ? newVal : [""];
}, { deep: true });

const addTaskRow = (form: any) => {
  const currentTasks = form.getFieldValue("serviceTasks") || [];
  const updatedTasks = [...currentTasks, ""];
  localTasks.value = updatedTasks;
  form.setFieldValue("serviceTasks", updatedTasks);
};

const removeTaskRow = (index: number, form: any) => {
  const currentTasks = form.getFieldValue("serviceTasks") || [];
  const updatedTasks = currentTasks.filter((_: any, i: number) => i !== index);
  localTasks.value = updatedTasks;
  form.setFieldValue("serviceTasks", updatedTasks);
};

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    serviceTasks: values.serviceTasks?.filter((id: string) => !!id) || [],
  };
  await props.onSubmit(payload);
};
</script>
