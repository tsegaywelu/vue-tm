<template>
  <div
    v-if="isLoading"
    class="p-6 text-center text-sm font-medium text-grey-600"
  >
    Loading agent details...
  </div>

  <template v-else-if="agent">
    <AgentForm
      form-id="edit-agent-form"
      :initial-values="agent"
      :on-submit="handleUpdateAgent"
      :labels="labels"
    >
      <template #submit-btn>
        <Button size="md" variant="outline" @click="router.back()">
          Cancel
        </Button>
        <SubmitButton> Update Agent </SubmitButton>
      </template>
    </AgentForm>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import AgentForm from "../components/AgentForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { fetch_agent_by_id, update_agent } from "../api/operation.api";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();

const queryClient = useQueryClient();
const agentId = route.params.id as string;

const { data: agentRes, isLoading } = useQuery({
  queryKey: ["agent-details", agentId],
  queryFn: () => fetch_agent_by_id(agentId),
});

const agent = computed(() => agentRes.value?.data);
const labels = computed(() => {
  return {
    shipper: agentRes?.value?.data.shipper?.name,
  };
});
const mutation = useMutation({
  mutationFn: (values: any) => update_agent(agentId, values),
});

const handleUpdateAgent = async (values: any) => {
  const res = await mutation.mutateAsync(values);
  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("Agent updated successfully!");
    queryClient.invalidateQueries({ queryKey: ["agents-list"] });
    queryClient.invalidateQueries({ queryKey: ["agent-details", agentId] });
    router.push("/agents");
  } else {
    toast.error(res.error || "Failed to update agent");
  }
};
</script>
