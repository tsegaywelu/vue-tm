<template>
  <div class="flex flex-col gap-6">
    <div class="bg-grey-25 rounded-3xl p-6 border border-grey-100">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-grey-900">Insurance Documents</h3>
      </div>

      <div v-if="insurance.insuranceDocuments?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DocumentCard
          v-for="(doc, index) in insurance.insuranceDocuments"
          :key="index"
          :title="getDocumentName(doc)"
          :document-type="'insurance-document'"
          :file-path="doc"
          :full-url="getStaticUrl(doc)"
          :can-reject="false"
        />
      </div>

      <div v-else class="flex flex-col items-center justify-center py-12 text-grey-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-4 opacity-20">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>No documents uploaded for this insurance</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getStaticUrl } from "@/utils/utils";
import DocumentCard from "../shipment-details/DocumentCard.vue";

const props = defineProps<{
  insurance: any;
}>();

const getDocumentName = (path: string) => {
  return path.split("/").pop() || "Document";
};
</script>
