<template>
  <div class="flex flex-col gap-6">
    <div class="bg-surface-muted rounded-3xl p-6 border border-line">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-bold text-base-text">Driver Documents</h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Loop over uploaded documents -->
        <template v-if="driver.driverDocuments?.length">
          <DocumentCard
            v-for="(doc, index) in driver.driverDocuments"
            :key="index"
            :title="getDocumentName(doc)"
            :document-type="'driver-document'"
            :file-path="doc"
            :full-url="getStaticUrl(doc)"
            :can-reject="false"
          />
        </template>

        <!-- Empty card to upload new document -->
        <DocumentCard
          title="Upload New Driver Document"
          :shipment-id="driver._id"
          :document-type="'driverDocuments'"
          :upload-function="uploadDriverDocuments"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { getStaticUrl } from "@/utils/utils";
import DocumentCard from "../shipment-details/DocumentCard.vue";
import { upload_driver_documents } from "../../api/operation.api";
import { useToastStore } from "@/store/toastStore";

const props = defineProps<{
  driver: any;
}>();

const emit = defineEmits(["refresh"]);
const queryClient = useQueryClient();
const toast = useToastStore();

const uploadDriverDocuments = async (
  id: string,
  formData: FormData,
  config: any,
) => {
  try {
    const res = await upload_driver_documents(id, formData, config);
    if (res.success || res.status === 200 || res.status === 201) {
      toast.success("Driver document uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["driver", id] });
      emit("refresh");
    } else {
      toast.error(res.error || "Failed to upload document");
    }
    return res;
  } catch (error: any) {
    toast.error(
      error.response?.data?.description ||
        "An error occurred while uploading the document.",
    );
    throw error;
  }
};

const getDocumentName = (path: string) => {
  return path.split("/").pop() || "Document";
};
</script>
