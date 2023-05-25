<script setup lang="ts">
import { useRoute, RouterView } from "vue-router";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import MenuComponent from "@/components/MenuComponent.vue";

const route = useRoute();
const auth = useAuthenticator();
</script>

<template>
  <authenticator
    :login-mechanisms="['email']"
    :hide-sign-up="true"
    class="h-100"
  />
  <MenuComponent v-if="auth.route === 'authenticated'" class="pa-6 h-100">
    <p v-if="route.path === '/'">Open a project to get started</p>
    <RouterView />
  </MenuComponent>
</template>
