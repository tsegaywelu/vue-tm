<template>
  <AgentForm
    form-id="shipper-add-agent-form"
    :initial-values="initialValues"
    :on-submit="handleCreateAgent"
    hide-shipper
  >
    <template #submit-btn>
      <div class="flex justify-end gap-3">
        <Button size="md" variant="outline" @click="router.back()">
          Cancel
        </Button>
        <SubmitButton> Create Agent </SubmitButton>
      </div>
    </template>
  </AgentForm>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import AgentForm from "@/modules/operation/components/AgentForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { create_shipper_agent } from "../api/shipper.api";

const router = useRouter();
const toast = useToastStore();
const authStore = useAuthStore();
const queryClient = useQueryClient();

const shipperId = computed(() => authStore.current_user?.user?.shipper?._id || "");

const initialValues = {
  shipper: shipperId.value,
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
  isActive: true,
};

const mutation = useMutation({
  mutationFn: (values: any) => create_shipper_agent(values),
});

const handleCreateAgent = async (values: any) => {
  const payload = {
    ...values,
    shipper: shipperId.value,
  };

  const res = await mutation.mutateAsync(payload);
  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("Agent added successfully!");
    queryClient.invalidateQueries({ queryKey: ["shipper-agents-list"] });
    router.push("/shipper/agents");
  } else {
    toast.error(res.error || "Failed to create agent");
  }
};
</script>
