<template>
  <Form :id="formId" :values="initialValues" :onSubmit="onSubmit">
    <template #default="{ form }">
      <Colapsable
        title="Commodity Information"
        description="Provide details about the commodity."
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ShipperInput
            name="shipper"
            :initial_labels="shipperLabels"
            :validation="{ required }"
            :attributes="{ placeholder: 'Select shipper' }"
            :options="labels?.shipper ? [{ label: labels.shipper, value: initialValues.shipper }] : []"
            :params="(state) => {
              return {
                name: state.search,
                q: undefined,
              };
            }"
          />
          <Input
            name="name"
            label="Name"
            :validation="{ required }"
            :attributes="{
              placeholder: 'Enter commodity name'
            }"
          />
        </div>
      </Colapsable>

      <div class="pt-10 flex flex-col sm:flex-row justify-end gap-3 *:w-full sm:*:w-auto *:min-h-[52px] sm:*:min-h-0 *:text-base sm:*:text-sm *:rounded-2xl sm:*:rounded-xl">
        <slot :form="form" name="submit-btn"></slot>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import Form from "@/components/form/Form.vue";
import Input from "@/components/form/Input.vue";
import Colapsable from "@/components/common/Colapsable.vue";
import { required } from "@/utils/validations";
import ShipperInput from "@/components/common/inputs/ShipperInput.vue";

defineProps<{
  formId: string;
  initialValues: Record<string, any>;
  labels?: Record<string, string>;
  onSubmit: (values: any) => Promise<void> | void;
  shipperLabels?: Record<string, string>;
}>();
</script>
