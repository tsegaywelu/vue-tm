<template>
  
  <Form :id="formId" :values="initialValues" :onSubmit="handleSubmit">
    <template #default="{ form }">
      <Colapsable
        title="General Information"
        description="Basic details about the service record."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SelectInput
            name="vehicle"
            label="Vehicle"
            :attributes="{
              placeholder: 'Choose vehicle',
            }"
            searchable
            label_key="plateNumber"
            value_key="_id"
            url="/vehicle"
            :validation="{
              required,
            }"
          />

          <DateInput
            name="maintenanceDate"
            label="Maintenance Date"
            :attributes="{
              placeholder: 'Select date',
            }"
            :validation="{
              required,
            }"
          />

          <SelectInput
            name="workshop"
            label="Workshop"
            :attributes="{
              placeholder: 'Choose workshop',
            }"
            searchable
            label_key="name"
            value_key="_id"
            url="/workshop"
          />

          <Input
            name="mileageAtService"
            label="Mileage At Service"
            :attributes="{
              placeholder: 'Enter mileage',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />

          <Input
            name="totalCost"
            label="Total Cost"
            :attributes="{
              placeholder: 'Enter total cost',
              type: 'number',
            }"
            :validation="{
              required,
            }"
          />
        </div>
      </Colapsable>

      <Colapsable
        title="Mechanics"
        description="List any mechanics or contacts involved in the service."
      >
        <div class="space-y-4">
          <div
            v-for="(mechanic, index) in mechanics"
            :key="index"
            class="flex items-end gap-4 bg-gray-50 p-4 rounded-lg relative"
          >
            <div class="flex-1">
              <SelectInput
                :name="`mechanics.${index}`"
                label="Contact"
                :attributes="{
                  placeholder: 'Choose contact',
                }"
                searchable
                label_key="name"
                value_key="_id"
                url="/contact?group=MECHANIC"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              class="w-fit text-error-600 border-error-200 hover:bg-error-50"
              @click="removeMechanic(index, form)"
            >
              Remove
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            class="mt-2"
            @click="addMechanic(form)"
          >
            <template #leading>
              <div class="size-4" v-html="icons.plus"></div>
            </template>
            Add Contact
          </Button>
        </div>
      </Colapsable>

      <Colapsable
        title="Description"
        description="Additional comments or details about the service."
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
import Button from "@/components/Button.vue";
import { required } from "@/utils/validations";
import { icons } from "@/utils/icons";

const props = defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  onSubmit: (values: any) => Promise<void> | void;
}>();

const mechanics = ref<any[]>(props.initialValues.mechanics || [""]);

// Watch for changes in initialValues (especially for edit mode)
watch(() => props.initialValues.mechanics, (newVal) => {
  mechanics.value = newVal || [""];
}, { deep: true });

const addMechanic = (form: any) => {
  const currentMechanics = form.getFieldValue("mechanics") || [];
  const updatedMechanics = [...currentMechanics, ""];
  mechanics.value = updatedMechanics;
  form.setFieldValue("mechanics", updatedMechanics);
};

const removeMechanic = (index: number, form: any) => {
  const currentMechanics = form.getFieldValue("mechanics") || [];
  const updatedMechanics = currentMechanics.filter((_: any, i: number) => i !== index);
  mechanics.value = updatedMechanics;
  form.setFieldValue("mechanics", updatedMechanics);
};

const handleSubmit = async (values: any) => {
  const payload = {
    ...values,
    mileageAtService: values.mileageAtService ? Number(values.mileageAtService) : undefined,
    totalCost: values.totalCost ? Number(values.totalCost) : undefined,
    mechanics: values.mechanics?.filter((m: string) => m !== "") || [],
  };
  await props.onSubmit(payload);
};
</script>
