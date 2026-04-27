<template>
  <div class="flex flex-col gap-6 p-4">
    <div class="rounded-2xl px-3 md:px-5 py-4 bg-white flex flex-col gap-6 shadow-sm border border-gray-100">
      
      <!-- Operational Vouchers -->
      <InfoWrapper title="Operational Vouchers">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2.5 py-2">
          <!-- Shipper Issue Voucher -->
          <div class="flex flex-col gap-3 p-4 bg-[#f6f7f9] rounded-xl border border-gray-100">
            <span class="font-bold text-gray-900 text-sm">Shipper Issue Voucher</span>
            <div class="flex items-center gap-2 mt-auto">
              <Button size="sm" variant="outline" class="flex-1" :disabled="!shipment?.civ" @click="viewDocument(shipment?.civ)">View</Button>
              <Button size="sm" variant="default" class="flex-1" :disabled="!shipment?.civ" @click="downloadDocument(shipment?.civ)">Download</Button>
            </div>
          </div>

          <!-- Agent Receive Voucher -->
          <div class="flex flex-col gap-3 p-4 bg-[#f6f7f9] rounded-xl border border-gray-100">
            <span class="font-bold text-gray-900 text-sm">Agent Receive Voucher</span>
            <div class="flex items-center gap-2 mt-auto">
              <Button size="sm" variant="outline" class="flex-1" :disabled="!shipment?.arv" @click="viewDocument(shipment?.arv)">View</Button>
              <Button size="sm" variant="default" class="flex-1" :disabled="!shipment?.arv" @click="downloadDocument(shipment?.arv)">Download</Button>
            </div>
          </div>

          <!-- Agent Issue Voucher -->
          <div class="flex flex-col gap-3 p-4 bg-[#f6f7f9] rounded-xl border border-gray-100">
            <span class="font-bold text-gray-900 text-sm">Agent Issue Voucher</span>
            <div class="flex items-center gap-2 mt-auto">
              <Button size="sm" variant="outline" class="flex-1" :disabled="!shipment?.aiv" @click="viewDocument(shipment?.aiv)">View</Button>
              <Button size="sm" variant="default" class="flex-1" :disabled="!shipment?.aiv" @click="downloadDocument(shipment?.aiv)">Download</Button>
            </div>
          </div>

          <!-- Shipper Receive Voucher -->
          <div class="flex flex-col gap-3 p-4 bg-[#f6f7f9] rounded-xl border border-gray-100">
            <span class="font-bold text-gray-900 text-sm">Shipper Receive Voucher</span>
            <div class="flex items-center gap-2 mt-auto">
              <Button size="sm" variant="outline" class="flex-1" :disabled="!shipment?.crv" @click="viewDocument(shipment?.crv)">View</Button>
              <Button size="sm" variant="default" class="flex-1" :disabled="!shipment?.crv" @click="downloadDocument(shipment?.crv)">Download</Button>
            </div>
          </div>
        </div>
      </InfoWrapper>

      <!-- Closing Documents -->
      <InfoWrapper title="Closing Documents">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2.5 py-2">
          <!-- Odometer Document -->
          <div class="flex flex-col gap-3 p-4 bg-[#f6f7f9] rounded-xl border border-gray-100">
            <span class="font-bold text-gray-900 text-sm">Odometer at Complete</span>
            <div class="flex items-center gap-2 mt-auto">
              <Button size="sm" variant="outline" class="flex-1" :disabled="!shipment?.odometerAtCompleteDocument" @click="viewDocument(shipment?.odometerAtCompleteDocument)">View</Button>
              <Button size="sm" variant="default" class="flex-1" :disabled="!shipment?.odometerAtCompleteDocument" @click="downloadDocument(shipment?.odometerAtCompleteDocument)">Download</Button>
            </div>
          </div>

          <!-- Fuel Document -->
          <div class="flex flex-col gap-3 p-4 bg-[#f6f7f9] rounded-xl border border-gray-100">
            <span class="font-bold text-gray-900 text-sm">Fuel Reading at Complete</span>
            <div class="flex items-center gap-2 mt-auto">
              <Button size="sm" variant="outline" class="flex-1" :disabled="!shipment?.fuelReadingAtCompleteDocument" @click="viewDocument(shipment?.fuelReadingAtCompleteDocument)">View</Button>
              <Button size="sm" variant="default" class="flex-1" :disabled="!shipment?.fuelReadingAtCompleteDocument" @click="downloadDocument(shipment?.fuelReadingAtCompleteDocument)">Download</Button>
            </div>
          </div>
        </div>
      </InfoWrapper>

      <!-- General Documents -->
      <InfoWrapper title="Other Shipment Documents" v-if="shipment?.shipmentDocuments?.length">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2.5 py-2">
          <div v-for="(doc, idx) in shipment.shipmentDocuments" :key="idx" class="flex flex-col gap-3 p-4 bg-[#f6f7f9] rounded-xl border border-gray-100">
            <span class="font-bold text-gray-900 text-sm break-all truncate">Document #{{ idx + 1 }}</span>
            <div class="flex items-center gap-2 mt-auto">
              <Button size="sm" variant="outline" class="flex-1" @click="viewDocument(doc)">View</Button>
              <Button size="sm" variant="default" class="flex-1" @click="downloadDocument(doc)">Download</Button>
            </div>
          </div>
        </div>
      </InfoWrapper>
      <div v-else class="text-gray-400 italic px-6 py-4">
        No other shipment documents found.
      </div>
    </div>
    
    <FileViewer v-if="showViewer" :fileURL="selectedFile" @close="showViewer = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InfoWrapper from './InfoWrapper.vue';
import Button from '@/components/common/Button.vue';
import FileViewer from '@/components/common/FileViewer.vue';
import { getStaticAssetspath } from '@/utils/utils';

const props = defineProps<{
  shipment?: Record<string, any>; // Using any to catch un-typed fields like arv, aiv, crv
}>();

const showViewer = ref(false);
const selectedFile = ref('');

const getFullUrl = (filePath: string) => {
  if (!filePath) return '';
  const normalizedPath = filePath.replace(/\\/g, '/');
  return `${getStaticAssetspath('core')}/${encodeURI(normalizedPath)}`;
};

const viewDocument = (filePath: string) => {
  if (!filePath) return;
  selectedFile.value = getFullUrl(filePath);
  showViewer.value = true;
};

const downloadDocument = (filePath: string) => {
  if (!filePath) return;
  const fileURL = getFullUrl(filePath);
  
  const link = document.createElement('a');
  link.href = fileURL;
  // Fallback filename from path
  const filename = filePath.split('/').pop()?.split('\\').pop() || 'download';
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
