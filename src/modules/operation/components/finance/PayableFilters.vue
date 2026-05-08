<template>
    <Form
      id="payable-filter"
      :values="{ select: 'all' }"
      @change="
        (values) => {
          emit('change', {
            ...values,
            routeOrigin: values.routeOrigin?.length
              ? values.routeOrigin.join(',')
              : undefined,
            routeDestination: values.routeDestination?.length
              ? values.routeDestination.join(',')
              : undefined,
          });
        }
      "
      class="[&_.input-focus]:bg-grey-25 flex-1 flex max-h-16 h-16 min-h-16 *:w-[220px] *:shrink-0 px-2 gap-2 overflow-auto"
    >
    
     
    
    <SelectInput
      :show_validation_status="false"
      label="Type"
      name="select"
      size="xs"
      :options="[
        { label: 'Showing all', value: 'all' },
        { label: 'Driver Advance', value: 'advance' },
        { label: 'Sub-Contract Advance', value: 'prePayment' },
        { label: 'Drivers Additional', value: 'transaction' },
        { label: 'Shipment', value: 'shipment' },
        { label: 'Purchase Order', value: 'purchaseOrders' },
        { label: 'Vehicle Lease', value: 'vehicleLeaseAgreements' }
      ]"
      :attributes="{ placeholder: 'Select a Type' }"
    />
    <SelectInput
      :show_validation_status="false"
      label="Status"
      name="status"
      size="xs"
      :options="[
        { label: 'All', value: '' },
       
        { label: 'Approved', value: 'APPROVED' },
        { label: 'Authorized', value: 'AUTHORIZED' },
      
      ]"
      :attributes="{ placeholder: 'Select a Status' }"
    />
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Origin"
      multiple
      parent_class_name=""
      size="xs"
      :params="(values) => ({ sort: 'shipmentCount', q: undefined, ...(values.search ? { routeName: { regexAny: values.search } } : {}) })"
      name="routeOrigin"
      value_key="destination"
      label_key="routeName"
      :url="`/route`"
      :attributes="{ placeholder: 'Select a City' }"
    />
    <SelectInput
      searchable
      :show_validation_status="false"
      label="Destination"
      multiple
      parent_class_name=""
      size="xs"
      :params="(values) => ({ sort: 'shipmentCount', q: undefined, ...(values.search ? { routeName: { regexAny: values.search } } : {}) })"
      name="routeDestination"
      value_key="destination"
      label_key="routeName"
      :url="`/route`"
      :attributes="{ placeholder: 'Select a City' }"
    />
  </Form>
</template>

<script setup lang="ts">
import SelectInput from "@/components/form/SelectInput.vue";
import Form from "@/components/form/Form.vue";

const emit = defineEmits(["change"]);
</script>
