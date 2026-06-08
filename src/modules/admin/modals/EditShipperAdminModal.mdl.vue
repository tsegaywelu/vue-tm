<template>
  <FormModalParent
    title="Edit Shipper Admin"
    :subtitle="admin ? `Updating ${admin.username}` : ''"
    form-id="edit-shipper-admin-form"
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
          name="shipper"
          label="Shipper"
          url="/shipper"
          label_key="name"
          value_key="_id"
          searchable
          :attributes="{ placeholder: 'Select a shipper' }"
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
import { updateShipperAdmin } from "@/modules/admin/api/shipper.api";

const props = defineProps<{
  data?: { admin?: any };
  close: (res: any) => void;
}>();

const toast = useToastStore();
const admin = computed(() => props.data?.admin);

const initialValues = computed(() => ({
  username: admin.value?.username ?? "",
  shipper: admin.value?.shipper?._id ?? admin.value?.shipper ?? "",
}));

const mutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: Record<string, any> }) =>
    updateShipperAdmin(id, data),
});

async function handleSubmit(values: any) {
  const res: any = await mutation.mutateAsync({
    id: admin.value._id,
    data: { username: values.username, shipper: values.shipper },
  });

  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("Shipper admin updated successfully!");
    closeModal(true);
  } else {
    toast.error(res.error || "Failed to update shipper admin");
  }
}
</script>
