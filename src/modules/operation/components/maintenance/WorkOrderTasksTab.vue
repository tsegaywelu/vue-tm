<template>
  <div class="flex flex-col gap-4">
    <div
      class="rounded-2xl px-3 md:px-5 py-6 bg-surface flex flex-col gap-6 shadow-sm border border-gray-100"
    >
      <h3 class="text-lg font-bold text-gray-900 px-1">Service Tasks</h3>
      
      <div class="overflow-x-auto rounded-xl border border-line">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Task</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Start Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">End Time</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Required Parts</th>
            </tr>
          </thead>
          <tbody class="bg-surface divide-y divide-gray-200">
            <tr v-if="!workOrder?.tasks?.length">
              <td colspan="6" class="px-6 py-10 text-center text-sm text-gray-500 italic">
                No tasks assigned to this work order.
              </td>
            </tr>
            <tr v-for="(task, index) in workOrder?.tasks" :key="index" class="hover:bg-surface-hover transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                {{ task.serviceTask?.name || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ task.code || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <Status :variant="task.status || 'pending'" size="sm">
                  {{ task.status || 'PENDING' }}
                </Status>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ task.taskStartTime ? dateTimeFormatter(task.taskStartTime) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ task.taskEndTime ? dateTimeFormatter(task.taskEndTime) : '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                {{ task.requiredParts || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WorkOrder } from "../../operation.types";
import { dateTimeFormatter } from "@/utils/utils";
import Status from "@/components/common/Status.vue";

defineProps<{
  workOrder?: WorkOrder;
}>();
</script>
