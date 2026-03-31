<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
    <v-btn class="ma-2" :icon="mdiThemeLightDark" location="top right" position="absolute"
      @click="$vuetify.theme.cycle()" />
  </v-app>
</template>

<script lang="ts" setup>
import { mdiThemeLightDark } from '@mdi/js'
import { RouterView } from 'vue-router';
</script>
