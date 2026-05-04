<template>
  <div class="flex flex-col gap-6 p-4 relative">
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
            document-type="civ"
            :shipment-id="shipment?._id"
            :file-path="shipment?.civ"
            :full-url="getStaticUrl(shipment?.civ)"
            :can-reject="canReject"
            :upload-function="upload_civ"
          />
          <DocumentCard
            title="Agent Receive Voucher"
            document-type="arv"
            :shipment-id="shipment?._id"
            :file-path="shipment?.arv"
            :full-url="getStaticUrl(shipment?.arv)"
            :can-reject="canReject"
            :upload-function="upload_arv"
          />
          <DocumentCard
            title="Agent Issue Voucher"
            document-type="aiv"
            :shipment-id="shipment?._id"
            :file-path="shipment?.aiv"
            :full-url="getStaticUrl(shipment?.aiv)"
            :can-reject="canReject"
            :upload-function="upload_aiv"
          />
          <DocumentCard
            title="Shipper Receive Voucher"
            document-type="crv"
            :shipment-id="shipment?._id"
            :file-path="shipment?.crv"
            :full-url="getStaticUrl(shipment?.crv)"
            :can-reject="canReject"
            :upload-function="upload_crv"
          />
          <DocumentCard
            title="Odometer at Complete"
            document-type="odometerAtCompleteDocument"
            :shipment-id="shipment?._id"
            :file-path="shipment?.odometerAtCompleteDocument"
            :full-url="getStaticUrl(shipment?.odometerAtCompleteDocument)"
            :can-reject="canReject"
            :upload-function="upload_closing_documents"
          />
          <DocumentCard
            title="Fuel Reading at Complete"
            document-type="fuelReadingAtCompleteDocument"
            :shipment-id="shipment?._id"
            :file-path="shipment?.fuelReadingAtCompleteDocument"
            :full-url="getStaticUrl(shipment?.fuelReadingAtCompleteDocument)"
            :can-reject="canReject"
            :upload-function="upload_closing_documents"
          />
        </div>
      </InfoWrapper>

      <!-- Closing Documents -->
      <InfoWrapper title="Closing Documents">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2.5 py-2"
        >
          <DocumentCard
            v-for="(doc, idx) in shipment?.closingDocuments || []"
            :key="'cd' + idx"
            :title="`Closing Document #${+idx + 1}`"
            document-type="closingDocuments"
            :index="+idx"
            :shipment-id="shipment?._id"
            :file-path="doc"
            :full-url="getStaticUrl(doc)"
            :can-reject="canReject"
            :upload-function="upload_closing_documents"
          />

          <!-- Empty card for new uploads -->
          <DocumentCard
            title="Upload Closing Document"
            document-type="closingDocuments"
            :shipment-id="shipment?._id"
            :full-url="''"
            :can-reject="false"
            :allowMultiple="true"
            :upload-function="upload_closing_documents"
          />
        </div>
      </InfoWrapper>

      <!-- General Documents -->
      <InfoWrapper title="Other Shipment Documents">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2.5 py-2"
        >
          <DocumentCard
            v-for="(doc, idx) in shipment?.shipmentDocuments || []"
            :key="idx"
            :title="`Document #${+idx + 1}`"
            document-type="shipmentDocuments"
            :index="+idx"
            :shipment-id="shipment?._id"
            :file-path="doc"
            :full-url="getStaticUrl(doc)"
            :can-reject="canReject"
            :upload-function="upload_closing_documents"
          />

          <!-- Empty card for new uploads -->
          <DocumentCard
            title="Upload New Document"
            document-type="shipmentDocuments"
            :shipment-id="shipment?._id"
            :full-url="''"
            :can-reject="false"
            :allowMultiple="true"
            :upload-function="upload_closing_documents"
          />
        </div>
      </InfoWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import InfoWrapper from "./InfoWrapper.vue";
import DocumentCard from "./DocumentCard.vue";
import { getStaticUrl } from "@/utils/utils";
import {
  upload_aiv,
  upload_civ,
  upload_arv,
  upload_crv,
  upload_closing_documents,
} from "@/modules/operation/api/shipment.api";

const props = defineProps<{
  shipment?: Record<string, any>;
}>();

const canReject = computed(() => {
  // TODO
  // fetch the document uploaded by to know if the logged in user can reject it
  return true;
});
</script>
