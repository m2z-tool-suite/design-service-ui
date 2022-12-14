<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/service/index.js";

const iframe = ref<HTMLIFrameElement | null>(null);
const diagram = ref();

const route = useRoute();
const router = useRouter();

const getDiagram = async () => {
  let response: any;
  try {
    response = await axios.get(`/diagrams/${route.params.id}`);
  } catch (err) {
    router.push("/");
    return;
  }

  const request: any = { action: "load" };
  diagram.value = response.data[0];
  const diagramData = diagram.value.data;
  if (diagramData) {
    request.xml = diagramData;
  }

  iframe.value?.contentWindow?.postMessage(JSON.stringify(request), "*");
};

const saveDiagram = (data: string) => {
  diagram.value.data = data;
  axios.put(`/diagrams/${route.params.id}`, diagram.value);
};

window.addEventListener(
  "message",
  async function (event: MessageEvent): Promise<void> {
    if (event.origin !== "https://embed.diagrams.net") {
      return;
    }

    const { event: eventType, xml: data } = JSON.parse(event.data);

    if (eventType === "init") {
      getDiagram();
    } else if (eventType === "save") {
      saveDiagram(data);
    } else if (eventType === "exit") {
      router.push("/");
    }
  }
);
</script>

<template>
  <iframe
    ref="iframe"
    src="https://embed.diagrams.net?embed=1&ui=atlas&spin=1&modified=unsavedChanges&proto=json"
    title="draw.io"
    class="w-100 h-100"
  ></iframe>
</template>

<style scoped>
iframe {
  border-width: 0;
}
</style>
