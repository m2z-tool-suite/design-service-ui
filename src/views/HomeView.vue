<script setup lang="ts">
import { useRoute, RouterView } from "vue-router";
import { Amplify } from "aws-amplify";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import MenuComponent from "@/components/MenuComponent.vue";

const route = useRoute();
const auth = useAuthenticator();

Amplify.configure({
  Auth: {
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    userPoolWebClientId: import.meta.env.VITE_COGNITO_USER_POOL_WEB_CLIENT_ID,
  },
});
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
