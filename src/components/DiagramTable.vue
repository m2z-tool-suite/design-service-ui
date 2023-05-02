<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { axiosDesign, axiosGenerator } from "@/service/index.js";
import DiagramForm from "@/components/DiagramForm.vue";
import DeleteDialog from "@/components/DeleteDialog.vue";
import type { Header, Item, ServerOptions } from "vue3-easy-data-table";
import type Diagram from "@/types/Diagram";
import type PageRequest from "@/types/PageRequest";
import type PageResponse from "@/types/PageResponse";
import type { AxiosResponse } from "axios";

const router = useRouter();

const rowsItems: number[] = [10, 25, 50, 100];
const themeColor: string = "#0049B0";

const headers: Header[] = [
  { text: "ID", value: "id", sortable: true },
  { text: "Title", value: "title", sortable: true },
  { text: "Description", value: "description", sortable: true },
  { text: "", value: "action" },
];

const items = ref<Item[]>([]);
const itemsSelected = ref<Item[]>([]);

const serverItemsLength = ref<number>(0);
const serverOptions = ref<ServerOptions>({
  page: 1,
  rowsPerPage: 10,
});

const loading = ref<boolean>(false);

const search = ref<string>("");

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

const getDiagrams = async (): Promise<void> => {
  loading.value = true;

  const response: AxiosResponse = await axiosDesign.get("/diagrams", {
    params: {
      ...parameters.value,
      search: search.value,
    },
  });
  const data: PageResponse<Diagram> = response.data;

  serverItemsLength.value = data.totalElements;
  if (serverItemsLength.value) {
    items.value = data.content;
  } else {
    items.value = [];
  }

  loading.value = false;
};

const openDiagram = (diagram: Diagram): void => {
  router.push(`/design/${diagram.id}`);
};

const createDiagram = async (diagram: Diagram): Promise<void> => {
  await axiosDesign.post("/diagrams", diagram);
  getDiagrams();
};

const editDiagram = async (diagram: Diagram): Promise<void> => {
  await axiosDesign.put(`/diagrams/${diagram.id}`, diagram);
  getDiagrams();
};

const deleteDiagrams = async (): Promise<void> => {
  const ids: number[] = itemsSelected.value.map((x) => x.id);
  await axiosDesign.delete(`/diagrams/${ids}`);
  getDiagrams();
};

const generateCode = async (diagram: Diagram): Promise<void> => {
  try {
    const response = await axiosGenerator.post(
      "/generate-code",
      {
        data: diagram.data,
      },
      { responseType: "blob" }
    );

    // create link to download file and click it
    const href = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", `${diagram.title}.zip`);
    document.body.appendChild(link);
    link.click();

    // clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      window.alert("Code generation is not supported for this diagram.");
    } else {
      window.alert("Code generator is not available at the moment.");
    }
  }
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

    <DeleteDialog :selection="itemsSelected" @confirm="deleteDiagrams" />
  </div>
  <v-text-field
    v-model="search"
    class="mb-3 mx-3"
    density="compact"
    variant="filled"
    label="Search diagrams"
    append-inner-icon="mdi-magnify"
    single-line
    hide-details
    @click:append-inner="getDiagrams"
  ></v-text-field>
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
        <DiagramForm
          :action="'Edit'"
          :icon="'mdi-pen'"
          :diagram="item"
          class="mx-1"
          @confirm="editDiagram"
        />
        <v-icon
          icon="mdi-pencil-ruler"
          size="x-large"
          class="mx-1"
          @click="openDiagram(item)"
        ></v-icon>
        <v-icon
          icon="mdi-file-code-outline"
          size="x-large"
          class="mx-1"
          @click="generateCode(item)"
        ></v-icon>
      </div>
    </template>
  </EasyDataTable>
</template>
