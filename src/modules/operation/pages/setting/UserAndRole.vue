<template>
  <div class="flex flex-col h-full">
    <div class="mb-4 px-2">
      <nav class="flex space-x-8 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="currentTab = tab.id"
          :class="[
            currentTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Page Actions (Teleported) -->
    <Teleport to="#page-actions" defer>
      <Button
        variant="primary"
        size="md"
        class="flex items-center gap-2"
        @click="handleAdd"
      >
        <i v-html="icons.plus" />
        Add {{ currentTab === 'user' ? 'User' : 'Role' }}
      </Button>
    </Teleport>

    <!-- Tab Content -->
    <div class="flex-1 min-h-0">
      <UserTable
        v-if="currentTab === 'user'"
        ref="userTableRef"
        @action="(data) => handleAction(data, 'user')"
      />
      <RoleTable
        v-else
        ref="roleTableRef"
        @action="(data) => handleAction(data, 'role')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import UserTable from "../../components/settings/UserTable.vue";
import RoleTable from "../../components/settings/RoleTable.vue";
import Button from "@/components/Button.vue";
import { icons } from "@/utils/icons";
import { delete_user, delete_role } from "../../api/settings.api";
import { useToastStore } from "@/store/toastStore";

const router = useRouter();
const route = useRoute();
const toast = useToastStore();

const userTableRef = ref();
const roleTableRef = ref();

const tabs = [
  { id: "user", label: "Users", icon: icons.user },
  { id: "role", label: "Roles", icon: icons.users },
];

const currentTab = ref((route.query.tab as string) || tabs[0].id);

watch(currentTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});

const handleAdd = () => {
  if (currentTab.value === 'user') {
    router.push('/setting/user-and-role/user/add');
  } else {
    router.push('/setting/user-and-role/role/add');
  }
};

const handleAction = async ({ row, action }: any, type: 'user' | 'role') => {
  if (action === 'edit') {
    router.push(`/setting/user-and-role/${type}/edit/${row._id}`);
  } else if (action === 'reset' && type === 'user') {
    router.push(`/setting/user-and-role/user/reset-password/${row._id}`);
  } else if (action === 'delete') {
    const name = type === 'user' ? row.username : row.name;
    if (confirm(`Are you sure you want to delete ${type} "${name}"?`)) {
      try {
        const res = type === 'user' ? await delete_user(row._id) : await delete_role(row._id);
        if (res.success) {
          toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
          if (type === 'user') userTableRef.value?.refetch();
          else roleTableRef.value?.refetch();
        } else {
          toast.error(res.error || `Failed to delete ${type}`);
        }
      } catch (error: any) {
        toast.error(error.message || "An unexpected error occurred");
      }
    }
  }
};
</script>
