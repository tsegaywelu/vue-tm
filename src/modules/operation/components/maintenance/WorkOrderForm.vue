<template>
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the work order."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VehicleInput
            name="vehicle"
            :options="
              initialLabels?.vehicle
                ? [
                    {
                      label: initialLabels.vehicle,
                      value: initialValues?.vehicle,
                    },
                  ]
                : []
            "
            :validation="{ required }"
          />

          <SelectInput
            name="fuelLevel"
            label="Fuel Level"
            :options="[
              { label: 'Full', value: 'FULL' },
              { label: 'Third', value: 'THIRD' },
              { label: 'Half', value: 'HALF' },
              { label: 'Quarter', value: 'QUARTER' },
              { label: 'Empty', value: 'EMPTY' },
            ]"
            :attributes="{ placeholder: 'Select fuel level' }"
            :validation="{ required }"
          />

          <Input
            name="odometer"
            label="Odometer"
            :attributes="{ placeholder: 'Enter odometer reading', type: 'number' }"
          />

          <DateInput
            name="startDate"
            label="Start Date"
            :attributes="{ placeholder: 'Select start date' }"
            :validation="{ required }"
          />

          <DateInput
            name="estimatedCompletionDate"
            label="Estimated Completion Date"
            :attributes="{ placeholder: 'Select completion date' }"
            :validation="{ required }"
          />

          <SelectInput
            name="workArea"
            label="Work Area"
            :options="[
              { label: 'Workshop', value: 'WORKSHOP' },
              { label: 'Field', value: 'FIELD' },
              { label: 'Other', value: 'OTHER' },
            ]"
            :attributes="{ placeholder: 'Select work area' }"
            :validation="{ required }"
          />

          <SelectInput
            v-if="form.state.values.workArea === 'WORKSHOP'"
            name="workshop"
            label="Workshop"
            :attributes="{ placeholder: 'Choose workshop' }"
            searchable
            label_key="name"
            value_key="_id"
            url="/workshop"
            :options="
              initialLabels?.workshop
                ? [
                    {
                      label: initialLabels.workshop,
                      value: initialValues?.workshop,
                    },
                  ]
                : []
            "
            :validation="{ required }"
          />

          <SelectInput
            name="workType"
            label="Work Type"
            :options="[
              { label: 'Maintenance', value: 'MAINTENANCE' },
              { label: 'Overhaul', value: 'OVERHAUL' },
              { label: 'Service', value: 'SERVICE' },
              { label: 'Accident', value: 'ACCIDENT' },
              { label: 'Other', value: 'OTHER' },
            ]"
            :attributes="{ placeholder: 'Select work type' }"
            :validation="{ required }"
          />

          <Input
            name="partsCost"
            label="Parts Cost"
            :attributes="{ placeholder: 'Enter parts cost', type: 'number' }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Service Types"
        description="Select the service types for this work order."
      >
        <div class="space-y-4">
          <div
            v-for="(st, index) in selectedServiceTypes"
            :key="index"
            class="flex items-end gap-4 bg-gray-50 p-4 rounded-lg relative"
          >
            <div class="flex-1">
              <SelectInput
                :name="`serviceTypes.${index}`"
                label="Service Type"
                :attributes="{ placeholder: 'Choose service type' }"
                searchable
                label_key="name"
                value_key="_id"
                url="/service-type"
                @change="(val: any) => handleServiceTypeChange(val, form)"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              class="w-fit text-error-600 border-error-200 hover:bg-error-50"
              @click="removeServiceType(index, form)"
            >
              Remove
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            class="mt-2"
            @click="addServiceType(form)"
          >
            <template #leading>
              <div class="size-4" v-html="icons.plus"></div>
            </template>
            Add Service Type
          </Button>
        </div>
      </Colapsable>

      <Colapsable
        title="Contacts"
        description="List any mechanics or contacts involved."
      >
        <div class="space-y-4">
          <MechanicsInput name="mechanics" :initialLabels="props.initialLabels?.mechanics" />
        </div>
      </Colapsable>

      <Colapsable
        title="Service Tasks"
        description="Individual tasks included in this work order."
      >
        <div class="space-y-6">
          <div
            v-for="(task, index) in tasks"
            :key="index"
            class="border border-gray-200 rounded-lg overflow-hidden"
          >
            <div class="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
              <span class="font-semibold text-gray-700">Task {{ index + 1 }}</span>
              <Button
                type="button"
                variant="ghost"
                class="text-error-600 size-8 !p-0"
                @click="removeTask(index, form)"
              >
                <div class="size-4" v-html="icons.trash"></div>
              </Button>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SelectInput
                :name="`tasks.${index}.serviceTask`"
                label="Service Task"
                :attributes="{ placeholder: 'Choose task' }"
                searchable
                label_key="name"
                value_key="_id"
                url="/service-task"
                :validation="{ required }"
                @change="(val: any) => handleServiceTaskChange(val, index, form)"
              />

              <Input
                :name="`tasks.${index}.code`"
                label="Code"
                :attributes="{ placeholder: 'Task code' }"
              />

              <Input
                :name="`tasks.${index}.status`"
                label="Status"
                :attributes="{ placeholder: 'Current status' }"
              />

              <Input
                :name="`tasks.${index}.taskStartTime`"
                label="Task Start Time"
                :attributes="{ type: 'datetime-local' }"
                :validation="{ required }"
              />

              <Input
                :name="`tasks.${index}.taskEndTime`"
                label="Task End Time"
                :attributes="{ type: 'datetime-local' }"
              />

              <div class="md:col-span-2 lg:col-span-3">
                <TextareaInput
                  :name="`tasks.${index}.requiredParts`"
                  label="Required Parts"
                  :attributes="{ placeholder: 'List parts required for this task', rows: 2 }"
                />
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            class="mt-2"
            @click="addTask(form)"
          >
            <template #leading>
              <div class="size-4" v-html="icons.plus"></div>
            </template>
            Add Custom Task
          </Button>
        </div>
      </Colapsable>

      <Colapsable
        title="Description"
        description="Additional comments or details about the work order."
      >
        <TextareaInput
          name="description"
          label="Description"
          :attributes="{
            placeholder: 'Enter any additional details here...',
            rows: 4,
          }"
        />
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
import DateInput from "@/components/form/DateInput.vue";
import TextareaInput from "@/components/form/TextareaInput.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import VehicleInput from "@/components/common/inputs/VehicleInput.vue";
import MechanicsInput from "../inputs/MechanicsInput.vue";
import Button from "@/components/Button.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";
import { useQuery } from "@tanstack/vue-query";
import { fetch_service_type_by_id } from "../../api/service-type.api";
import { fetch_service_task_by_id } from "../../api/service-task.api";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  initialLabels?: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const selectedServiceTypes = ref<any[]>(props.initialValues.serviceTypes || [""]);
const tasks = ref<any[]>(props.initialValues.tasks || []);

// Watchers for initialization and updates
watch(() => props.initialValues.serviceTypes, (newVal) => {
  selectedServiceTypes.value = newVal && newVal.length > 0 ? newVal : [""];
}, { deep: true });


watch(() => props.initialValues.tasks, (newVal) => {
  tasks.value = newVal || [];
}, { deep: true });

// List management
const addServiceType = (form: any) => {
  const current = form.getFieldValue("serviceTypes") || [];
  const updated = [...current, ""];
  selectedServiceTypes.value = updated;
  form.setFieldValue("serviceTypes", updated);
};

const removeServiceType = (index: number, form: any) => {
  const current = form.getFieldValue("serviceTypes") || [];
  const updated = current.filter((_: any, i: number) => i !== index);
  selectedServiceTypes.value = updated;
  form.setFieldValue("serviceTypes", updated);
};


const addTask = (form: any) => {
  const current = form.getFieldValue("tasks") || [];
  const newTask = {
    serviceTask: "",
    code: "",
    status: "",
    taskStartTime: form.getFieldValue("startDate") ? `${form.getFieldValue("startDate")}T00:00` : "",
    taskEndTime: "",
    requiredParts: "",
    __fromServiceType: false,
  };
  const updated = [...current, newTask];
  tasks.value = updated;
  form.setFieldValue("tasks", updated);
};

const removeTask = (index: number, form: any) => {
  const current = form.getFieldValue("tasks") || [];
  const updated = current.filter((_: any, i: number) => i !== index);
  tasks.value = updated;
  form.setFieldValue("tasks", updated);
};

// Auto-population logic
const handleServiceTypeChange = async (serviceTypeId: string, form: any) => {
  if (!serviceTypeId) return;
  
  try {
    const res = await fetch_service_type_by_id(serviceTypeId);
    if (res.success && res.data?.serviceTasks) {
      const currentTasks = form.getFieldValue("tasks") || [];
      const existingTaskIds = new Set(currentTasks.map((t: any) => t.serviceTask));
      
      const newTasks = [];
      for (const taskRef of res.data.serviceTasks) {
        const taskId = typeof taskRef === 'string' ? taskRef : taskRef._id;
        if (!existingTaskIds.has(taskId)) {
          // Fetch task details for pre-filling
          const taskRes = await fetch_service_task_by_id(taskId);
          if (taskRes.success) {
            newTasks.push({
              serviceTask: taskId,
              code: taskRes.data.code || "",
              status: "PENDING",
              taskStartTime: form.getFieldValue("startDate") ? `${form.getFieldValue("startDate")}T00:00` : "",
              taskEndTime: "",
              requiredParts: taskRes.data.requiredParts?.join(", ") || "",
              __fromServiceType: true,
            });
          }
        }
      }
      
      if (newTasks.length > 0) {
        const updatedTasks = [...currentTasks, ...newTasks];
        tasks.value = updatedTasks;
        form.setFieldValue("tasks", updatedTasks);
      }
    }
  } catch (err) {
    console.error("Failed to fetch service type tasks", err);
  }
};

const handleServiceTaskChange = async (serviceTaskId: string, index: number, form: any) => {
  if (!serviceTaskId) return;

  try {
    const res = await fetch_service_task_by_id(serviceTaskId);
    if (res.success) {
      form.setFieldValue(`tasks.${index}.code`, res.data.code || "");
      form.setFieldValue(`tasks.${index}.requiredParts`, res.data.requiredParts?.join(", ") || "");
    }
  } catch (err) {
    console.error("Failed to fetch task details", err);
  }
};

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    odometer: values.odometer ? Number(values.odometer) : undefined,
    partsCost: values.partsCost ? Number(values.partsCost) : undefined,
    serviceTypes: values.serviceTypes?.filter((id: string) => !!id) || [],
    tasks: values.tasks?.map((t: any) => ({
      ...t,
      // Ensure date strings are valid
      taskStartTime: t.taskStartTime || undefined,
      taskEndTime: t.taskEndTime || undefined,
    })) || [],
    // Nest costBreakdown as expected by API
    costBreakdown: {
      partsCost: values.partsCost ? Number(values.partsCost) : undefined,
    }
  };
  
  // Clean up flattened fields
  delete payload.partsCost;

  await props.onSubmit(payload);
};
</script>
