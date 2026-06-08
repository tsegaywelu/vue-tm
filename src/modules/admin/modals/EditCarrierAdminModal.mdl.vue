<template>
  <FormModalParent
    title="Edit Carrier Admin"
    :subtitle="admin ? `Updating ${admin.username}` : ''"
    form-id="edit-carrier-admin-form"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <div class="flex flex-col gap-5">
        <Input
          name="username"
          label="Username"
          :attributes="{ placeholder: 'Enter username' }"
          :validation="{ required }"
        />

        <SelectInput
          name="carrier"
          label="Carrier"
          url="/carrier"
          label_key="name"
          value_key="_id"
          searchable
          :attributes="{ placeholder: 'Select a carrier' }"
          :validation="{ required }"
        />
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" size="md" @click="closeModal(null)">
          Cancel
        </Button>
        <SubmitButton>Save Changes</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { closeModal } from "@customizer/modal-x";
import { useMutation } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import SelectInput from "@/components/form/SelectInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { updateCarrierAdmin } from "@/modules/admin/api/carrier.api";

const props = defineProps<{
  data?: { admin?: any };
  close: (res: any) => void;
}>();

const toast = useToastStore();
const admin = computed(() => props.data?.admin);

const initialValues = computed(() => ({
  username: admin.value?.username ?? "",
  carrier: admin.value?.carrier?._id ?? admin.value?.carrier ?? "",
}));

const mutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
    updateCarrierAdmin(id, data),
});

async function handleSubmit(values: any) {
  const res: any = await mutation.mutateAsync({
    id: admin.value._id,
    data: { username: values.username, carrier: values.carrier },
  });

  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("Carrier admin updated successfully!");
    closeModal(true);
  } else {
    toast.error(res.error || "Failed to update carrier admin");
  }
}
</script>
