<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { axiosDesign } from "@/service/index.js";
import RequirementForm from "@/components/RequirementForm.vue";
import type { Header, Item, ServerOptions } from "vue3-easy-data-table";
import type Requirement from "@/types/Requirement";
import type RequirementType from "@/types/RequirementType";
import type RequirementPriority from "@/types/RequirementPriority";
import type RequirementRisk from "@/types/RequirementRisk";
import type RequirementStatus from "@/types/RequirementStatus";
import type PageRequest from "@/types/PageRequest";
import type PageResponse from "@/types/PageResponse";
import type { AxiosResponse } from "axios";

const rowsItems: number[] = [10, 25, 50, 100];
const themeColor: string = "#0049B0";

const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Title", value: "title", sortable: true },
  { text: "Description", value: "description", sortable: true },
  { text: "Type", value: "type.title" },
  { text: "Priority", value: "priority.title" },
  { text: "Stakeholders", value: "stakeholders", sortable: true },
  { text: "Risk", value: "risk.title" },
  { text: "Status", value: "status.title" },
  { text: "Effort assessment", value: "effortAssessment", sortable: true },
  { text: "", value: "action" },
];

const items = ref<Item[]>([]);
const itemsSelected = ref<Item[]>([]);

const types = ref<RequirementType[]>([]);
const priorities = ref<RequirementPriority[]>([]);
const risks = ref<RequirementRisk[]>([]);
const statuses = ref<RequirementStatus[]>([]);

const serverItemsLength = ref<number>(0);
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 10,
});

const loading = ref<boolean>(false);

const parameters = computed<PageRequest>(() => {
  const { page, rowsPerPage, sortBy, sortType } = serverOptions.value;

  const result: PageRequest = {
    page: page - 1,
    size: rowsPerPage,
  };
  if (sortBy && sortType) {
    result.sort = `${sortBy},${sortType}`;
  }

  return result;
});

const getRequirements = async (): Promise<void> => {
  loading.value = true;

  const response: AxiosResponse = await axiosDesign.get("/requirements", {
    params: parameters.value,
  });
  const data: PageResponse<Requirement> = response.data;

  serverItemsLength.value = data.totalElements;
  if (serverItemsLength.value) {
    items.value = data.content;
  }

  loading.value = false;
};

const createRequirement = async (requirement: Requirement): Promise<void> => {
  await axiosDesign.post("/requirements", requirement);
  getRequirements();
};

const editRequirement = async (requirement: Requirement): Promise<void> => {
  await axiosDesign.put(`/requirements/${requirement.id}`, requirement);
  getRequirements();
};

const deleteRequirements = async (): Promise<void> => {
  const ids: number[] = itemsSelected.value.map((x) => x.id);
  await axiosDesign.delete(`/requirements/${ids}`);
  getRequirements();
};

const getRequirementsOptions = async (): Promise<void> => {
  const response = await Promise.all([
    axiosDesign.get("/requirement-types/all"),
    axiosDesign.get("/requirement-priorities/all"),
    axiosDesign.get("/requirement-risks/all"),
    axiosDesign.get("/requirement-statuses/all"),
  ]);

  const data = response.map((x) => x.data);
  [types.value, priorities.value, risks.value, statuses.value] = data;
};

getRequirements();
getRequirementsOptions();

watch(serverOptions, () => getRequirements(), { deep: true });
</script>

<template>
  <div class="text-right mb-6 mr-6">
    <RequirementForm
      :action="'Create'"
      :icon="'mdi-plus'"
      :types="types"
      :priorities="priorities"
      :risks="risks"
      :statuses="statuses"
      @confirm="createRequirement"
    />
    <v-icon
      @click="deleteRequirements"
      icon="mdi-delete"
      size="x-large"
    ></v-icon>
  </div>
  <EasyDataTable
    v-model:server-options="serverOptions"
    v-model:items-selected="itemsSelected"
    :headers="headers"
    :items="items"
    :server-items-length="serverItemsLength"
    :loading="loading"
    :rows-items="rowsItems"
    :theme-color="themeColor"
    buttonsPagination
  >
    <template #item-action="item">
      <div class="text-right pa-4">
        <RequirementForm
          :action="'Edit'"
          :icon="'mdi-pen'"
          :requirement="item"
          :types="types"
          :priorities="priorities"
          :risks="risks"
          :statuses="statuses"
          @confirm="editRequirement"
        />
      </div>
    </template>
  </EasyDataTable>
</template>
