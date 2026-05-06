<template>
  <FormModalParent
    title="Extend Vehicle Lease Agreement"
    form-id="extendLeaseForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="{ endDate: '' }"
  >
    <template #center>
      <div class="flex flex-col gap-4">
        <Input type="date" name="endDate" label="End Date" :validation="{ required }" />
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import FormModalParent from "@/components/modals/FormModalParent.vue";
import Input from "@/components/form/Input.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import ApiService from "@/api/ApiService";

const props = defineProps<{
  data: { id: string; onSuccess: () => void };
}>();

const toast = useToastStore();
const api = new ApiService();

const handleSubmit = async (values: any) => {
  try {
    const res = await api.addAuthenticationHeader().patch(`/vehicle-lease-agreement/${props.data.id}/extend`, { endDate: values.endDate });
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Agreement extended successfully");
      props.data.onSuccess();
      closeModal();
    } else {
      toast.error(res.error || "Failed to extend agreement");
    }
  } catch (error: any) {
    toast.error(error.response?.data?.description || "An error occurred");
  }
};
</script>
