<template>
  <FormModalParent
    title="Extend Vehicle Lease Agreement"
    subtitle="Update the end date of the current agreement"
    form-id="extendLeaseForm"
    :submit-handler="handleSubmit"
    modal-style="auto"
    :values="initialValues"
  >
    <template #center>
      <div class="flex flex-col gap-4">
        <DateInput
          name="endDate"
          label="New End Date"
          :validation="{ required }"
        />
      </div>
    </template>
    <template #bottom="{ form }">
      <div class="flex justify-end gap-3">
        <Button
          size="md"
          variant="outline"
          @click="
            form.resetForm();
            closeModal(false);
          "
          >Cancel</Button
        >
        <SubmitButton :loading="extendMutation.isPending">Extend</SubmitButton>
      </div>
    </template>
  </FormModalParent>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import FormModalParent from "@/components/modals/FormModalParent.vue";
import DateInput from "@/components/form/DateInput.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { required } from "@/utils/validations";
import { useToastStore } from "@/store/toastStore";
import { closeModal } from "@customizer/modal-x";
import ApiService from "@/api/ApiService";

const props = defineProps<{
  data: { lease: any; onSuccess?: () => void };
}>();

const toast = useToastStore();
const api = new ApiService();
const queryClient = useQueryClient();

const initialValues = computed(() => {
  const lease = props.data.lease;
  return {
    endDate: lease?.endDate
      ? new Date(lease.endDate).toISOString().substr(0, 10)
      : "",
  };
});

const extendMutation = useMutation({
  mutationFn: (payload: any) =>
    api
      .addAuthenticationHeader()
      .patch(
        `/vehicle-lease-agreement/${props.data.lease?._id}/extend`,
        payload
      ),
  onSuccess: (res) => {
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Agreement extended successfully");
      queryClient.invalidateQueries({ queryKey: ["leased-vehicle-list"] });
      props.data.onSuccess?.();
      closeModal(true);
    } else {
      toast.error(res.error || "Failed to extend agreement");
    }
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.description || "An error occurred");
  },
});

const handleSubmit = async (values: any) => {
  await extendMutation.mutateAsync({ endDate: values.endDate });
};
</script>
