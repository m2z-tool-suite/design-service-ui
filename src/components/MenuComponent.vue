<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Auth } from "aws-amplify";

const route = useRoute();
const router = useRouter();

const title = ref<string>("Software designer");
const drawer = ref<boolean>(false);
const projects = ref<Array<string>>(["Project 1", "Project 2", "Project 3"]); // FIXME: get projects from Cognito

const openProject = (project: string, data: string): void => {
  title.value = `${project} - ${data}`;
  router.push(`/${project}/${data}`);
};

const signOut = async (): Promise<void> => {
  await Auth.signOut();
  router.push("/");
};

if (Object.keys(route.params).length) {
  const project = route.params.project;
  const data = route.path.split("/").slice(-1);
  title.value = `${project} - ${data}`;
}
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
            <v-list-subheader>{{ project }}</v-list-subheader>
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
