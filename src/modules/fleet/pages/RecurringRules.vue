<template>
  <Teleport to="#page-title-actions" defer>
    <button
      class="sm:hidden size-8 rounded-xl border border-line flex items-center justify-center text-faint-text hover:bg-surface-hover transition-colors"
      title="Run Now"
      :disabled="runNowMutation.isPending.value"
      @click="handleRunNow"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
      </svg>
    </button>
  </Teleport>

  <Teleport defer to="#page-actions">
    <div class="hidden sm:flex items-center gap-2">
      <Button variant="secondary" size="md" :loading="runNowMutation.isPending.value" @click="handleRunNow">
        Run Now
      </Button>
      <Button variant="primary" size="md" @click="router.push('/fleet/recurring-rules/add')">
        Add Rule
      </Button>
    </div>
  </Teleport>

  <button
    class="fixed bottom-6 right-6 sm:hidden z-50 w-14 h-14 rounded-full bg-primary text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
    @click="router.push('/fleet/recurring-rules/add')"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  </button>

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
  if (action === "view") {
    router.push(`/fleet/recurring-rules/${row._id}`);
    return;
  }

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
    return;
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
