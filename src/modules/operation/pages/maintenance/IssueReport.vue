<template>
  <Teleport to="#page-actions" defer>
    <Button v-permission="'ISSUE_REPORT:create'">
      <template #leading>
        <div class="size-5" v-html="all_icons.plus"></div>
      </template>
      New Issue Report
    </Button>
  </Teleport>
  <IssueReportTable @action="handleIssueReportAction" />
</template>

<script setup lang="ts">
import IssueReportTable from "../../components/maintenanceTables/IssueReportTable.vue";
import Button from "@/components/Button.vue";
import type { IssueReport } from "../../operation.types";
import { icons } from "@/utils/icons";
import { raaz_icons } from "@/utils/raaz_icons";

const all_icons = { ...icons, ...raaz_icons };

const handleIssueReportAction = ({
  row,
  action,
}: {
  row: IssueReport;
  action: string;
}) => {
  console.log(`Action: ${action} on IssueReport: ${row._id}`);
  // TODO: Implement modal views or navigation for issue report details and status changes
};
</script>
