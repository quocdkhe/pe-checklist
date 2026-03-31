<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list density="compact" nav>
        <v-list-item
          :prepend-icon="mdiFormatListChecks"
          title="Question 1"
          to="/"
          exact
          color="primary"
        ></v-list-item>
        <v-list-item
          :prepend-icon="mdiHelpCircle"
          title="Question 2"
          to="/question2"
          color="primary"
        ></v-list-item>
        <v-list-item
          :prepend-icon="mdiHelpCircleOutline"
          title="Question 3"
          to="/question3"
          color="primary"
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>PE Checklist</v-app-bar-title>
      <v-btn
        class="ma-2"
        :icon="mdiThemeLightDark"
        @click="toggleTheme"
      />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import {
  mdiThemeLightDark,
  mdiFormatListChecks,
  mdiHelpCircle,
  mdiHelpCircleOutline
} from '@mdi/js'

const drawer = ref<boolean>(true)
const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>