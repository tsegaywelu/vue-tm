<template>
  <AgentForm
    form-id="add-agent-form"
    :initial-values="initialValues"
    :on-submit="handleCreateAgent"
  >
    <template #submit-btn>
      <Button size="md" variant="outline" @click="router.back()">
        Cancel
      </Button>
      <SubmitButton> Create Agent </SubmitButton>
    </template>
  </AgentForm>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useMutation } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import AgentForm from "../components/AgentForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { add_agent } from "../api/operation.api";

const router = useRouter();
const toast = useToastStore();

const initialValues = {
  shipper: "",
  name: "",
  tradeName: "",
  agentCode: "",
  region: "",
  city: "",
  cargoType: "",
  contact: {
    fullName: "",
    email: "",
    phoneNumbers: [],
  },
  locationGPS: {
    latitude: null,
    longitude: null,
  },
};

const mutation = useMutation({
  mutationFn: (values: any) => add_agent(values),
});

const handleCreateAgent = async (values: any) => {
  const res = await mutation.mutateAsync(values);
  if (res.success) {
    toast.success("Agent added successfully!");
    router.push("/agents");
  } else {
    toast.error(res.error || "Failed to create agent");
  }
};
</script>
