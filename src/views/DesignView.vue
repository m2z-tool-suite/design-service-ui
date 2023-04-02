<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { axiosDesign } from "@/service/index.js";
import type Diagram from "@/types/Diagram.js";
import type DrawioRequest from "@/types/DrawioRequest.js";
import type DrawioMessage from "@/types/DrawioMessage.js";
import type { AxiosResponse } from "axios";

const route = useRoute();
const router = useRouter();

const iframe = ref<HTMLIFrameElement>();
const diagram = ref<Diagram>();

const getDiagram = async (): Promise<void> => {
  let response: AxiosResponse;
  try {
    response = await axiosDesign.get(`/diagrams/${route.params.id}`);
  } catch (err) {
    router.push("/");
    return;
  }

  const request: DrawioRequest = { action: "load" };
  diagram.value = response.data[0];
  if (diagram.value?.data) {
    request.xml = diagram.value.data;
  }

  iframe.value?.contentWindow?.postMessage(JSON.stringify(request), "*");
};

const saveDiagram = (data: string): void => {
  if (!diagram.value) {
    return;
  }

  diagram.value.data = data;
  axiosDesign.put(`/diagrams/${route.params.id}`, diagram.value);
};

window.addEventListener(
  "message",
  async (messageEvent: MessageEvent): Promise<void> => {
    if (messageEvent.origin !== "https://embed.diagrams.net") {
      return;
    }

    const { event: eventType, xml: data }: DrawioMessage = JSON.parse(
      messageEvent.data
    );

    if (eventType === "init") {
      getDiagram();
    } else if (eventType === "save" && data) {
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
