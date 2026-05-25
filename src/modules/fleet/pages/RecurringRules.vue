<template>
  <Teleport defer to="#page-actions">
    <Button variant="secondary" size="md" :loading="runNowMutation.isPending.value" @click="handleRunNow">
      Run Now
    </Button>
    <Button variant="primary" size="md" @click="$router.push('/fleet/recurring-rules/add')">
      Add Rule
    </Button>
  </Teleport>

  <RecurringRuleTable ref="tableRef" @action="handleAction" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import Button from "@/components/common/Button.vue";
import RecurringRuleTable from "../components/RecurringRuleTable.vue";
import {
  pause_recurring_rule,
  resume_recurring_rule,
  run_recurring_rules_now,
} from "../api/fleet.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const toast = useToastStore();
const queryClient = useQueryClient();
const tableRef = ref<any>(null);

const pauseMutation = useMutation({
  mutationFn: (id: string) => pause_recurring_rule(id),
});

const resumeMutation = useMutation({
  mutationFn: (id: string) => resume_recurring_rule(id),
});

const runNowMutation = useMutation({
  mutationFn: run_recurring_rules_now,
});

const refresh = () => {
  queryClient.invalidateQueries({ queryKey: ["recurring-rule-list"] });
  tableRef.value?.refetch();
};

const handleAction = async ({ row, action }: { row: any; action: string }) => {
  if (action === "edit") {
    router.push(`/fleet/recurring-rules/edit/${row._id}`);
    return;
  }

  if (action === "pause") {
    const res = await pauseMutation.mutateAsync(row._id);
    if (res.success) {
      toast.success("Rule paused");
      refresh();
    } else {
      toast.error(res.error || "Failed to pause rule");
    }
  }

  if (action === "resume") {
    const res = await resumeMutation.mutateAsync(row._id);
    if (res.success) {
      toast.success("Rule resumed");
      refresh();
    } else {
      toast.error(res.error || "Failed to resume rule");
    }
  }
};

const handleRunNow = async () => {
  const res = await runNowMutation.mutateAsync();
  if (res.success) {
    const { processedRules, generatedEntries, failedRules } = res.data as any;
    toast.success(
      `Processed ${processedRules} rule(s) — ${generatedEntries} entries generated, ${failedRules} failed`
    );
    refresh();
  } else {
    toast.error(res.error || "Failed to run rules");
  }
};
</script>
