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
            :attributes="{
              placeholder: 'Enter odometer reading',
              type: 'number',
            }"
            :validation="{
              required,
            }"
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
          <ServiceTypeSelectInput
            name="serviceTypes"
            :initialLabels="props.initialLabels?.serviceTypes"
            @change="(val: any) => handleServiceTypeChange(val, form)"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Contacts"
        description="List any mechanics or contacts involved."
      >
        <div class="space-y-4">
          <MechanicsInput
            name="mechanics"
            :initialLabels="props.initialLabels?.mechanics"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Service Tasks"
        description="Individual tasks included in this work order."
      >
        <div class="space-y-6">
          <ServiceTasksInput
            name="tasks"
            :initialLabels="props.initialLabels?.tasks"
          />
        </div>
      </Colapsable>

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
import ServiceTypeSelectInput from "./ServiceTypeSelectInput.vue";
import ServiceTasksInput from "./ServiceTasksInput.vue";
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

// Watchers for initialization and updates

const handleServiceTypeChange = async (serviceTypeId: string, form: any) => {
  if (!serviceTypeId) return;

  try {
    const res = await fetch_service_type_by_id(serviceTypeId);
    if (res.success && res.data?.serviceTasks) {
      const currentTasks = form.getFieldValue("tasks") || [];
      const existingTaskIds = new Set(
        currentTasks.map((t: any) => t.serviceTask),
      );

      const newTasks = [];
      for (const taskRef of res.data.serviceTasks) {
        const taskId = typeof taskRef === "string" ? taskRef : taskRef._id;
        if (!existingTaskIds.has(taskId)) {
          // Fetch task details for pre-filling
          const taskRes = await fetch_service_task_by_id(taskId);
          if (taskRes.success) {
            newTasks.push({
              serviceTask: taskId,
              code: taskRes.data.code || "",
              status: "PENDING",
              taskStartTime: form.getFieldValue("startDate")
                ? `${form.getFieldValue("startDate")}T00:00`
                : "",
              taskEndTime: "",
              requiredParts: taskRes.data.requiredParts?.join(", ") || "",
              __fromServiceType: true,
            });
          }
        }
      }

      if (newTasks.length > 0) {
        const updatedTasks = [...currentTasks, ...newTasks];
        form.setFieldValue("tasks", updatedTasks);
      }
    }
  } catch (err) {
    console.error("Failed to fetch service type tasks", err);
  }
};

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    vehicleStats: {
      fuelLevel: values.fuelLevel,
      odometer: values.odometer ? Number(values.odometer) : undefined,
    },
    costBreakdown: {
      partsCost: values.partsCost ? Number(values.partsCost) : undefined,
    },
    serviceTypes: values.serviceTypes?.filter((id: string) => !!id) || [],
    serviceTasks: (values.tasks || []).map((t: any) => ({
      serviceTask: t.serviceTask,
      code: t.code,
      status: t.status,
      taskStartTime: t.taskStartTime || undefined,
      taskEndTime: t.taskEndTime || undefined,
      requiredParts:
        typeof t.requiredParts === "string"
          ? t.requiredParts
              .split(",")
              .map((p: string) => p.trim())
              .filter((p: string) => !!p)
          : Array.isArray(t.requiredParts)
            ? t.requiredParts
            : [],
    })),
    mechanics: values.mechanics || [],
  };

  // Conditionally include workshop
  if (values.workArea === "WORKSHOP" && values.workshop) {
    payload.workshop = values.workshop;
  }

  // Clean up flattened/temporary fields
  delete payload.fuelLevel;
  delete payload.odometer;
  delete payload.partsCost;
  delete payload.tasks;

  await props.onSubmit(payload);
};
</script>
