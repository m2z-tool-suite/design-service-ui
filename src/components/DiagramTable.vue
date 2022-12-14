<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import type {
  Header,
  Item,
  ServerOptions,
  ClickRowArgument,
} from "vue3-easy-data-table";
import axios from "@/service/index.js";
import DiagramForm from "@/components/DiagramForm.vue";

const router = useRouter();

const rowsItems = [10, 25, 50, 100];

const themeColor = "#0049B0";

const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Title", value: "title", sortable: true },
  { text: "Description", value: "description", sortable: true },
  { text: "", value: "action" },
];

const items = ref<Item[]>([]);
const itemsSelected = ref<Item[]>([]);

const serverItemsLength = ref(0);
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 10,
});

const loading = ref(false);

const parameters = computed(() => {
  const { page, rowsPerPage, sortBy, sortType } = serverOptions.value;

  const result: any = {
    page: page - 1,
    size: rowsPerPage,
  };
  if (sortBy && sortType) {
    result.sort = `${sortBy},${sortType}`;
  }

  return result;
});

const getDiagrams = async () => {
  loading.value = true;

  const response = await axios.get("/diagrams", { params: parameters.value });
  const data = response.data;
  items.value = data.content;
  serverItemsLength.value = data.totalElements;

  loading.value = false;
};

const openDiagram = (diagram: ClickRowArgument) => {
  router.push(`/design/${diagram.id}`);
};

const createDiagram = async (data: object) => {
  await axios.post("/diagrams", data);
  getDiagrams();
};

const editDiagram = async (data: any) => {
  await axios.put(`/diagrams/${data.id}`, data);
  getDiagrams();
};

const deleteDiagrams = async () => {
  const ids = itemsSelected.value.map((x) => x.id);
  await axios.delete(`/diagrams/${ids}`);
  getDiagrams();
};

getDiagrams();

watch(serverOptions, () => getDiagrams(), { deep: true });
</script>

<template>
  <div class="text-right mb-6 mr-6">
    <DiagramForm
      :action="'Create'"
      :icon="'mdi-plus'"
      @confirm="createDiagram"
    />
    <v-icon @click="deleteDiagrams" icon="mdi-delete" size="x-large"></v-icon>
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
    @clickRow="openDiagram"
  >
    <template #item-action="item">
      <div class="text-right pa-4">
        <DiagramForm
          :action="'Edit'"
          :icon="'mdi-pen'"
          :diagram="item"
          @confirm="editDiagram"
        />
      </div>
    </template>
  </EasyDataTable>
</template>
