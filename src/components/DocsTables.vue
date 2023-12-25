<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import store from "@/store/index";
import { axiosDesign, axiosGenerator } from "@/service/index";
import ReadOnlyTable from "@/components/ReadOnlyTable.vue";
import DocumentForm from "@/components/DocumentForm.vue";
import GraphForm from "@/components/GraphForm.vue";
import type { Item } from "vue3-easy-data-table";
import type ClassType from "@/types/ClassType";
import type DocumentParameters from "@/types/DocumentParameters";
import type GraphParameters from "@/types/GraphParameters";

const route = useRoute();

const tab = ref<string>();

const selectedType = ref<any>();
const selectedItem = ref<Item>();

const project = ref<string>(route.params.project as string);
const projectDataSource = ref<string>("");

const meta = computed<any>(() => store.state.meta);

const classTypes = ref<ClassType[]>([]);

watch(
  route,
  () => {
    if (route.name !== "docs") return;
    initialize();
  },
  { deep: true }
);

const initialize = () => {
  if (!meta.value) return;

  const type = route.params.type;
  selectedType.value = meta.value.find((m: any) => m.key === type);

  project.value = route.params.project as string;
  projectDataSource.value = selectedType.value.dataSource + project.value;

  selectedItem.value = undefined;
};

const mainTableRowClicked = (item: any) => {
  selectedItem.value = item;
};

const getClassTypes = async (): Promise<void> => {
  const response = await axiosDesign.get("/class-types/all");
  classTypes.value = response.data;
};

const generateDocument = async (
  parameters: DocumentParameters
): Promise<void> => {
  try {
    const response = await axiosGenerator.post(
      "/generate-document",
      parameters
    );
    const data = response.data;
    const id = JSON.parse(data)._id.$oid;

    // create link to download file and click it
    const href =
      "data:text/json;charset=utf-8," +
      JSON.stringify(JSON.parse(data), null, 2);
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", `${id}.json`);
    document.body.appendChild(link);
    link.click();

    // clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch (error: any) {
    if (error.response.status === 400) {
      window.alert("No data available to generate document.");
    } else {
      window.alert("Document generator is not available at the moment.");
    }
  }
};

const generateGraph = async (parameters: GraphParameters): Promise<void> => {
  try {
    const response = await axiosGenerator.post("/generate-graph", parameters, {
      responseType: "blob",
    });

    // create link to download file and click it
    const href = URL.createObjectURL(response.data);
    const link = document.createElement("a");

    // get filename from response header
    response.headers["content-disposition"]?.split(";").forEach((x) => {
      if (x.includes("filename")) {
        const filename = x.split("=")[1].trim().replace('"', "");
        link.setAttribute("download", filename);
      }
    });

    link.href = href;
    document.body.appendChild(link);
    link.click();

    // clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch (error: any) {
    if (error.response.status === 400) {
      window.alert("No data available to generate graph.");
    } else {
      window.alert("Graph generator is not available at the moment.");
    }
  }
};

initialize();
getClassTypes();
</script>

<template>
  <v-tabs bg-color="primary">
    <v-tab>{{ selectedType.name }}</v-tab>
  </v-tabs>
  <ReadOnlyTable
    :headers="selectedType.headers"
    :dataSource="projectDataSource"
    @rowClicked="mainTableRowClicked"
  />

  <template v-if="selectedItem && selectedType.children">
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab
        v-for="child in selectedType.children"
        :key="child.key"
        :value="child.key"
      >
        {{ child.name }}
      </v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item
        v-for="child in selectedType.children"
        :key="child.key"
        :value="child.key"
      >
        <ReadOnlyTable
          :headers="meta.find((m: any) => m.key === child.key)?.headers"
          :data-source="child.dataSource + selectedItem.id"
        />
      </v-window-item>
    </v-window>
  </template>

  <div v-if="selectedType.key === 'methods'" class="text-right my-4">
    <DocumentForm
      :project="project"
      :classTypes="classTypes"
      @confirm="generateDocument"
    />
  </div>

  <div v-if="selectedType.key === 'relationships'" class="text-right my-4">
    <GraphForm :project="project" @confirm="generateGraph" />
  </div>
</template>
