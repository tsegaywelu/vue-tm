<template>
  <div
    v-if="isLoading"
    class="p-6 text-center text-sm font-medium text-grey-600"
  >
    Loading agent details...
  </div>

  <template v-else-if="agent">
    <AgentForm
      form-id="shipper-edit-agent-form"
      :initial-values="agent"
      :on-submit="handleUpdateAgent"
      hide-shipper
    >
      <template #submit-btn>
        <div class="flex justify-end gap-3">
          <Button size="md" variant="outline" @click="router.back()">
            Cancel
          </Button>
          <SubmitButton> Update Agent </SubmitButton>
        </div>
      </template>
    </AgentForm>
  </template>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { useToastStore } from "@/store/toastStore";
import AgentForm from "@/modules/operation/components/AgentForm.vue";
import Button from "@/components/common/Button.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import { fetch_agent_by_id, update_shipper_agent } from "../api/shipper.api";

const route = useRoute();
const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();

const agentId = route.params.id as string;

const { data: agentRes, isLoading } = useQuery({
  queryKey: ["shipper-agent-details", agentId],
  queryFn: () => fetch_agent_by_id(agentId),
});

const agent = computed(() => agentRes.value?.data);

const mutation = useMutation({
  mutationFn: (values: any) => update_shipper_agent(agentId, values),
});

const handleUpdateAgent = async (values: any) => {
  const res = await mutation.mutateAsync(values);
  if (res.success || res.status === 200 || res.status === 201) {
    toast.success("Agent updated successfully!");
    queryClient.invalidateQueries({ queryKey: ["shipper-agents-list"] });
    router.push("/shipper/agents");
  } else {
    toast.error(res.error || "Failed to update agent");
  }
};
</script>
