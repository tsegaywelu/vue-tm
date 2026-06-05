<template>
  <FormModalParent
    title="Add City Shipper Code"
    subtitle="Assign custom origin/destination codes to a city for a shipper"
    form-id="create-city-shipper-code-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <div class="flex flex-col gap-4">
        <SelectInput
          name="city"
          label="City"
          url="/city"
          value_key="_id"
          label_key="name"
          :display_label_fn="(c: any) => c.code || c.name"
          searchable
          :validation="{ required }"
          :attributes="{ placeholder: 'Select city' }"
        />
        <SelectInput
          name="shipper"
          label="Shipper"
          url="/shipper/contractedShippers"
          :value_key="(item: any) => item.shipper?._id"
          :label_key="(item: any) => item.shipper?.name"
          searchable
          :validation="{ required }"
          :attributes="{ placeholder: 'Select shipper' }"
        />
        <div class="grid grid-cols-2 gap-4">
          <Input
            name="originCode"
            label="Origin Code"
            :validation="{ required }"
            :attributes="{ placeholder: 'e.g. ADD' }"
          />
          <Input
            name="destinationCode"
            label="Destination Code"
            :validation="{ required }"
            :attributes="{ placeholder: 'e.g. AADC' }"
          />
        </div>
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button size="md" variant="outline" @click="closeModal(false)">Cancel</Button>
        <SubmitButton>Create</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/common/Button.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { create_city_shipper_code } from "../../api/city-shipper-code.api";

// [MODAL-X] AUTO-GENERATED INSTANCE
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.
// [MODAL-X] Managed Props: This block is auto-generated for strict type safety.


const toast = useToastStore();
const queryClient = useQueryClient();

const initialValues = {
  city: "",
  shipper: "",
  originCode: "",
  destinationCode: "",
};

const mutation = useMutation({
  mutationFn: ({ shipperId, data }: { shipperId: string; data: any }) =>
    create_city_shipper_code(shipperId, data),
});

const handleSubmit = async (values: any) => {
  const shipperId = values.shipper;
  const res = await mutation.mutateAsync({ shipperId, data: values });
  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("City shipper code created successfully");
    queryClient.invalidateQueries({ queryKey: ["city-shipper-codes"] });
    closeModal(true);
  } else {
    toast.error(res.error || "Failed to create city shipper code");
  }
};
</script>
