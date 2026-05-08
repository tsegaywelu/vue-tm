<script setup lang="ts">
import { inject, onMounted, ref, reactive, watch } from "vue";
import { genId } from "@/utils/utils";
import InputParent from "@/components/form/InputParent.vue";
import Input from "@/components/common/Input.vue";
import Select from "@/components/common/Select.vue";
import { required, validateArrayItems } from "@/utils/validations";

type IssueFound = {
  fakeId: string;
  description: string;
  severity: string;
  issueType: string;
};

function newEmptyIssue(): IssueFound {
  return {
    fakeId: genId.next().value as string,
    description: "",
    severity: "MINOR",
    issueType: "FAULT",
  };
}

const props = defineProps<{
  name: string;
}>();

const formContext = inject<any>("formContext");
const form = formContext?.form;
const issues = ref<IssueFound[]>([]);

const errors = reactive<Record<string, string>>({});

const issueRules = {
  description: { required },
  severity: { required },
  issueType: { required },
};

const severityOptions = [
  { label: 'Minor', value: 'MINOR' },
  { label: 'Moderate', value: 'MODERATE' },
  { label: 'Critical', value: 'CRITICAL' },
];

const issueTypeOptions = [
  { label: 'Damage', value: 'DAMAGE' },
  { label: 'Fault', value: 'FAULT' },
  { label: 'Other', value: 'OTHER' },
];

onMounted(() => {
  const values: any[] = form?.getFieldValue(props.name);
  if (values && values.length > 0) {
    issues.value = values.map((el) => {
      return {
        ...el,
        fakeId: genId.next().value as string,
      };
    });
  } else {
    issues.value = [];
  }
});

watch(
  issues,
  () => {
    form.setFieldValue(props.name, issues.value);
  },
  { deep: true },
);

function add() {
  const err = validateArrayItems(issues.value, errors, issueRules, "fakeId", true);
  if (err) return;
  issues.value.push(newEmptyIssue());
}

function remove(id: string) {
  const idx = issues.value.findIndex((el) => el.fakeId == id);
  if (idx == -1) return;
  issues.value.splice(idx, 1);
}
</script>

<template>
  <InputParent
    :validation="{
      allValuesExist(values: IssueFound[]) {
        if (!values || values.length === 0) return [true, ''];
        const err = validateArrayItems(values, errors, issueRules, 'fakeId', true);
        return err ? [false, err] : [true, ''];
      },
    }"
    :name="props.name"
  >
    <div tabindex="0" :data-name="props.name" class="space-y-4 rounded">
      <div
        v-for="(issue, i) in issues"
        :key="issue.fakeId"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100 relative"
      >
        <div class="col-span-1 md:col-span-1">
          <Input
            label="Description"
            v-model="issue.description"
            :error="errors['description_' + issue.fakeId]"
            @update:model-value="errors['description_' + issue.fakeId] = ''"
            :attributes="{ placeholder: 'Describe the issue' }"
          />
        </div>
        
        <div class="col-span-1 md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Severity</label>
          <Select
            v-model="issue.severity"
            :options="severityOptions"
            label_key="label"
            value_key="value"
            :clearable="false"
          />
          <p v-if="errors['severity_' + issue.fakeId]" class="text-error-600 text-xs mt-1">{{ errors['severity_' + issue.fakeId] }}</p>
        </div>

        <div class="col-span-1 md:col-span-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <Select
            v-model="issue.issueType"
            :options="issueTypeOptions"
            label_key="label"
            value_key="value"
            :clearable="false"
          />
          <p v-if="errors['issueType_' + issue.fakeId]" class="text-error-600 text-xs mt-1">{{ errors['issueType_' + issue.fakeId] }}</p>
        </div>

        <button
          type="button"
          class="absolute size-6 top-2 right-2 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
          @click="remove(issue.fakeId)"
        >
          <i class="mdi mdi-close"></i>
        </button>
      </div>
    </div>

    <button
      type="button"
      class="mt-4 flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs hover:opacity-80 transition-opacity"
      @click="add()"
    >
      <i class="mdi mdi-plus-circle-outline text-lg"></i>
      Add Issue
    </button>
  </InputParent>
</template>
