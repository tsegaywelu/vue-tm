<template>
  <FormModalParent
    :title="provider ? 'Edit Provider' : 'Add Provider'"
    :subtitle="provider ? `Updating ${provider.name}` : 'Register a new GPS provider'"
    form-id="gpsProviderForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <div class="flex flex-col gap-5">
        <div class="grid grid-cols-2 gap-4">
          <Input
            name="code"
            label="Code"
            :attributes="{ placeholder: 'e.g. MAYET' }"
            :validation="{ required }"
          />
          <Input
            name="name"
            label="Name"
            :attributes="{ placeholder: 'e.g. MAYET' }"
            :validation="{ required }"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <SelectInput
            name="authType"
            label="Auth Type"
            :options="authTypeOptions"
            :attributes="{ placeholder: 'Select Auth Type' }"
            :validation="{ required }"
          />
          <SelectInput
            name="status"
            label="Status"
            :options="statusOptions"
            :attributes="{ placeholder: 'Select Status' }"
            :validation="{ required }"
          />
        </div>
      </div>
    </template>

    <template #bottom>
      <div class="flex justify-end gap-3">
        <Button variant="secondary" size="md" @click="closeModal(null)">
          Cancel
        </Button>
        <SubmitButton>
          {{ provider ? "Update Provider" : "Add Provider" }}
        </SubmitButton>
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
import { createProvider, updateProvider } from "@/modules/admin/api/gps.api";

const props = defineProps<{
  data?: { provider?: any };
  close: (res: any) => void;
}>();

const toast = useToastStore();
const provider = computed(() => props.data?.provider);

const authTypeOptions = [
  { label: "Custom", value: "CUSTOM" },
  { label: "OAuth", value: "OAUTH" },
  { label: "API Key", value: "API_KEY" },
];

const statusOptions = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const initialValues = computed(() => ({
  code: provider.value?.code ?? "",
  name: provider.value?.name ?? "",
  authType: provider.value?.authType ?? "",
  status: provider.value?.status ?? "ACTIVE",
}));

const createMutation = useMutation({ mutationFn: (data: any) => createProvider(data) });
const updateMutation = useMutation({
  mutationFn: ({ id, data }: { id: string; data: any }) => updateProvider(id, data),
});

async function handleSubmit(values: any) {
  if (provider.value) {
    const res: any = await updateMutation.mutateAsync({ id: provider.value._id, data: values });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Provider updated successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to update provider");
    }
  } else {
    const res: any = await createMutation.mutateAsync(values);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Provider added successfully!");
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to add provider");
    }
  }
}
</script>
