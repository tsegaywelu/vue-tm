<template>
  <div class="flex flex-col gap-6 p-4">
    <div
      class="rounded-2xl px-3 md:px-5 py-4 bg-white flex flex-col gap-6 shadow-sm border border-gray-100"
    >
      <!-- Operational Vouchers -->
      <InfoWrapper title="Operational Vouchers">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2.5 py-2"
        >
          <DocumentCard
            title="Shipper Issue Voucher"
            :file-path="shipment?.civ"
            :full-url="getStaticUrl(shipment?.civ)"
            :can-reject="canReject"
            @view="viewDocument"
            @change="changeDocument"
            @reject="rejectDocument"
          />
          <DocumentCard
            title="Agent Receive Voucher"
            :file-path="shipment?.arv"
            :full-url="getStaticUrl(shipment?.arv)"
            :can-reject="canReject"
            @view="viewDocument"
            @change="changeDocument"
            @reject="rejectDocument"
          />
          <DocumentCard
            title="Agent Issue Voucher"
            :file-path="shipment?.aiv"
            :full-url="getStaticUrl(shipment?.aiv)"
            :can-reject="canReject"
            @view="viewDocument"
            @change="changeDocument"
            @reject="rejectDocument"
          />
          <DocumentCard
            title="Shipper Receive Voucher"
            :file-path="shipment?.crv"
            :full-url="getStaticUrl(shipment?.crv)"
            :can-reject="canReject"
            @view="viewDocument"
            @change="changeDocument"
            @reject="rejectDocument"
          />
        </div>
      </InfoWrapper>

      <!-- Closing Documents -->
      <InfoWrapper title="Closing Documents">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2.5 py-2"
        >
          <DocumentCard
            title="Odometer at Complete"
            :file-path="shipment?.odometerAtCompleteDocument"
            :full-url="getStaticUrl(shipment?.odometerAtCompleteDocument)"
            :can-reject="canReject"
            @view="viewDocument"
            @change="changeDocument"
            @reject="rejectDocument"
          />
          <DocumentCard
            title="Fuel Reading at Complete"
            :file-path="shipment?.fuelReadingAtCompleteDocument"
            :full-url="getStaticUrl(shipment?.fuelReadingAtCompleteDocument)"
            :can-reject="canReject"
            @view="viewDocument"
            @change="changeDocument"
            @reject="rejectDocument"
          />
        </div>
      </InfoWrapper>

      <!-- General Documents -->
      <InfoWrapper
        title="Other Shipment Documents"
        v-if="shipment?.shipmentDocuments?.length"
      >
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2.5 py-2"
        >
          <DocumentCard
            v-for="(doc, idx) in shipment.shipmentDocuments"
            :key="idx"
            :title="`Document #${+idx + 1}`"
            :file-path="doc"
            :full-url="getStaticUrl(doc)"
            :can-reject="canReject"
            @view="viewDocument"
            @change="changeDocument"
            @reject="rejectDocument"
          />
        </div>
      </InfoWrapper>
      <div v-else class="text-gray-400 italic px-6 py-4">
        No other shipment documents found.
      </div>
    </div>

    <FileViewer
      v-if="showViewer"
      :fileURL="selectedFile"
      @close="showViewer = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import InfoWrapper from "./InfoWrapper.vue";
import DocumentCard from "./DocumentCard.vue";
import FileViewer from "@/components/common/FileViewer.vue";
import { getStaticAssetspath } from "@/utils/utils";

const props = defineProps<{
  shipment?: Record<string, any>; // Using any to catch un-typed fields like arv, aiv, crv
}>();

const showViewer = ref(false);
const selectedFile = ref("");

const canReject = computed(() => {
  return !(props.shipment?.carrier && !props.shipment?.driver);
});

const getStaticUrl = (filePath: string) => {
  if (!filePath) return "";
  const normalizedPath = filePath.replace(/\\/g, "/");
  // Use v_STATIC_PATH directly as requested
  const basePath = import.meta.env.v_STATIC_PATH || getStaticAssetspath("core");
  return `${basePath.replace(/\/$/, "")}/${encodeURI(normalizedPath).replace(/^\//, "")}`;
};

const viewDocument = (filePath: string) => {
  if (!filePath) return;
  selectedFile.value = getStaticUrl(filePath);
  showViewer.value = true;
};

const changeDocument = (filePath: string) => {
  // Logic to open a change document modal
  console.log("Change document requested for:", filePath);
};

const rejectDocument = (filePath: string) => {
  // Logic to reject a document
  console.log("Reject document requested for:", filePath);
};
</script>
