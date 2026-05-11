<template>
  <IssueReportTable @action="handleIssueReportAction" />
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import IssueReportTable from "../../components/maintenanceTables/IssueReportTable.vue";
import type { IssueReport } from "../../operation.types";

const router = useRouter();

const handleIssueReportAction = ({
  row,
  action,
}: {
  row: IssueReport;
  action: string;
}) => {
  if (action === "view" || action === "edit-status") {
    router.push({
      name: "operation_maintenance_issue_report_details",
      params: { id: row._id },
    });
  } else if (action === "delete") {
    // TODO: Implement delete confirmation modal
    console.log("Delete issue report", row._id);
  }
};
</script>
