<template>
  <InspectionForm
    form-id="add-inspection-form"
    :initial-values="initialValues"
    :on-submit="handleCreateInspection"
  >
    <template #submit-btn="{ form }">
      <Button size="md" variant="outline" @click="form.reset()">
        Discard Changes
      </Button>
      <SubmitButton> Create Inspection </SubmitButton>
    </template>
  </InspectionForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import InspectionForm from "../../components/maintenance/InspectionForm.vue";
import { create_inspection } from "../../api/inspection.api";
import { useToastStore } from "@/store/toastStore";
import SubmitButton from "@/components/form/SubmitButton.vue";
import Button from "@/components/Button.vue";
import { useQueryClient, useMutation } from "@tanstack/vue-query";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: (values: any) => create_inspection(values),
});

const initialValues = {
  inspectionDate: new Date().toISOString().split("T")[0],
  inspectionReason: "ROUTINE",
  issuesFound: [],
};

const handleCreateInspection = async (values: any) => {
  try {
    const res = await mutation.mutateAsync(values);
    if (res.success) {
      toast.success("Inspection created successfully");
      queryClient.invalidateQueries({ queryKey: ["inspections-list"] });
      router.push("/maintenance/inspection");
    } else {
      toast.error(res.error || "Failed to create inspection");
    }
  } catch (error: any) {
    toast.error(error.message || "An unexpected error occurred");
  }
};
</script>
