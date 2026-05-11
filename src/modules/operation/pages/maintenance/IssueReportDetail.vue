<template>
  <div class="h-full flex flex-col gap-4">
    <div v-if="isLoading" class="flex justify-center py-20">
      <i class="mdi mdi-loading mdi-spin text-4xl text-primary"></i>
    </div>

    <!-- Teleport target for tabs, kept outside of conditional rendering to prevent crashes -->
    <div id="issue-report-details-tabs" class="w-full mt-2"></div>

    <template v-else-if="issueReport">
      <!-- Header Section -->
      <div
        class="bg-white flex flex-col md:flex-row md:items-center justify-between px-3 md:px-4 py-4 md:py-3 rounded-[20px] gap-4 shadow-sm border border-gray-100"
      >
        <div class="flex flex-col gap-2 flex-1">
          <div class="flex items-center gap-4">
            <div class="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <i class="mdi mdi-alert-circle-outline text-2xl"></i>
            </div>
            <div>
              <h1 class="font-bold text-2xl leading-tight text-gray-900 uppercase">
                Issue Report #{{ issueReport._id?.slice(-6) || '-------' }}
              </h1>
              <div class="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                <span class="text-sm text-gray-600">
                  Type: <span class="font-bold text-black ml-1">{{ issueReport.type || '-' }}</span>
                </span>
                <span class="text-sm text-gray-600">
                  Date: <span class="font-bold text-black ml-1">{{ dateFormatter(issueReport.createdAt) }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row items-center justify-between md:justify-end gap-3 md:gap-4">
          <div class="flex flex-row lg:flex-col items-start md:items-end gap-1 md:gap-2">
            <Status :variant="issueReport.status" :label="issueReport.status">
              {{ issueReport.status }}
            </Status>
          </div>
          <div class="flex gap-2">
            <Button
              variant="primary"
              size="md"
              @click="handlePrint"
            >
              <template #leading>
                <i class="mdi mdi-printer text-lg"></i>
              </template>
              Print
            </Button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="issueReport.status !== 'CLOSED'" class="flex gap-2 flex-wrap">
        <Button
          v-if="issueReport.status === 'OPEN'"
          variant="primary"
          @click="handleStatusChange('IN_PROGRESS')"
          :loading="updateStatusMutation.isPending"
        >
          Mark In Progress
        </Button>
        <Button
          v-if="issueReport.status === 'IN_PROGRESS'"
          variant="success"
          @click="handleStatusChange('RESOLVED')"
          :loading="updateStatusMutation.isPending"
        >
          Mark Resolved
        </Button>
        <Button
          v-if="issueReport.status === 'RESOLVED'"
          variant="outline"
          @click="handleStatusChange('CLOSED')"
          :loading="updateStatusMutation.isPending"
        >
          Close Report
        </Button>
      </div>

      <!-- Tab Content -->
      <div class="flex-1 min-h-0 overflow-y-auto">
        <component
          :is="activeTabComponent"
          :issueReport="issueReport"
        />
      </div>
    </template>

    <div v-else class="flex flex-col items-center justify-center py-20 bg-white rounded-[20px] border border-gray-100 shadow-sm">
      <i class="mdi mdi-alert-circle-outline text-6xl text-gray-300"></i>
      <h2 class="mt-4 text-xl font-bold text-gray-800">Issue Report Not Found</h2>
      <p class="mt-2 text-gray-500">The requested report could not be found or has been removed.</p>
      <Button variant="outline" class="mt-6" @click="$router.push('/maintenance/issue-report')">
        Back to List
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { fetch_issue_report_by_id, update_issue_report_status } from "../../api/issue-report.api";
import Status from "@/components/common/Status.vue";
import Button from "@/components/Button.vue";
import { dateFormatter } from "@/utils/utils";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import { printIssueReport } from "../../utils/printIssueReport";

// Tabs
import IssueReportOverviewTab from "../../components/maintenance/IssueReportOverviewTab.vue";

const route = useRoute();
const router = useRouter();
const queryClient = useQueryClient();
const toast = useToastStore();
const authStore = useAuthStore();
const reportId = route.params.id as string;

const tabs = computed(() => (route.meta.tabs || []) as any[]);
const activeTab = computed(
  () => (route.query.tab as string) || (tabs.value?.[0]?.value as string) || "overview",
);

const { data: response, isLoading } = useQuery({
  queryKey: ["issue-report", reportId],
  queryFn: () => fetch_issue_report_by_id(reportId),
  enabled: !!reportId,
});

const issueReport = computed(() => response.value?.data);

const activeTabComponent = computed(() => {
  switch (activeTab.value) {
    case "overview":
      return IssueReportOverviewTab;
    default:
      return IssueReportOverviewTab;
  }
});

const updateStatusMutation = useMutation({
  mutationFn: (status: string) => update_issue_report_status(reportId, status),
  onSuccess: (res) => {
    if (res.success) {
      toast.success("Report status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["issue-report", reportId] });
      queryClient.invalidateQueries({ queryKey: ["issue-reports-list"] });
    } else {
      toast.error(res.message || "Failed to update status");
    }
  },
});

const handleStatusChange = (newStatus: string) => {
  updateStatusMutation.mutate(newStatus);
};

const handlePrint = () => {
  if (issueReport.value) {
    printIssueReport(issueReport.value, authStore.user);
  }
};
</script>
