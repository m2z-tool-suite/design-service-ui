<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Auth } from "aws-amplify";
import type Project from "@/types/Project";

const route = useRoute();
const router = useRouter();

const title = ref<string>("Software designer");
const drawer = ref<boolean>(false);
const projects = ref<Array<Project>>();

watch(
  route,
  () => {
    if (Object.keys(route.params).length) {
      const projectTitle = route.params.project;
      const data = route.path.split("/").slice(-1);
      title.value = `${projectTitle}  - ${data}`;
    } else {
      title.value = "Software designer";
    }
  },
  { deep: true }
);

const getProjects = async (): Promise<void> => {
  const groups = (await Auth.currentSession()).getIdToken().decodePayload()[
    "cognito:groups"
  ];

  const projectsMapped = groups
    .filter((group: string) => group.startsWith("PROJECT_"))
    .map((group: string) => group.replace("PROJECT_", ""));

  const projectsWrite = projectsMapped
    .filter((group: string) => group.endsWith("_WRITE"))
    .map((group: string) => group.replace("_WRITE", ""))
    .map((group: string) => ({ title: group, type: "WRITE" }));

  const projectsRead = projectsMapped
    .filter((group: string) => group.endsWith("_READ"))
    .map((group: string) => group.replace("_READ", ""))
    .map((group: string) => ({ title: group, type: "READ" }));

  projects.value = projectsWrite.concat(projectsRead);
};

const openProject = (project: Project, data: string): void => {
  title.value = `${project.title} - ${data}`;
  router.push(`/${project.title}/${data}`);
};

const signOut = async (): Promise<void> => {
  await Auth.signOut();
  router.push("/");
};

getProjects();
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar color="primary" prominent>
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          variant="text"
          size="x-large"
        />
        <v-toolbar-title>
          {{ title }}
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          @click="signOut"
          variant="text"
          icon="mdi-exit-to-app"
          size="x-large"
        />
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" location="left" temporary>
        <v-list>
          <template v-for="project in projects" :key="project">
            <v-list-subheader>
              {{ project.title }} ({{ project.type }})
            </v-list-subheader>
            <v-list-item @click="openProject(project, 'requirements')">
              <v-list-item-title>Requirements</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openProject(project, 'diagrams')">
              <v-list-item-title>Diagrams</v-list-item-title>
            </v-list-item>
            <v-divider />
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <slot></slot>
      </v-main>
    </v-layout>
  </v-card>
</template>
