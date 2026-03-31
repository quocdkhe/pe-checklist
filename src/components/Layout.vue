<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list density="compact" nav>
        <v-list-item :prepend-icon="mdiFormatListChecks" title="Question 1" to="/" exact color="primary"></v-list-item>
        <v-list-item :prepend-icon="mdiHelpCircle" title="Question 2" to="/question2" color="primary"></v-list-item>

        <v-list-group value="code-mau">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="mdiCodeBraces" title="Code mẫu" color="primary"></v-list-item>
          </template>
          <v-list-item title="Code mẫu EF phần xóa" to="/ef-delete-code" color="primary"></v-list-item>
          <v-list-item title="Cấu hình Odata" to="/odata-config" color="primary"></v-list-item>
          <v-list-item title="Công thức phân trang" to="/pagination-formula" color="primary"></v-list-item>
          <v-list-item title="Sử dụng ApiClient" to="/api-client-usage" color="primary"></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>PE Checklist</v-app-bar-title>
      <v-btn class="ma-2" :icon="mdiThemeLightDark" @click="toggleTheme" />
    </v-app-bar>

    <v-main style="height: 100vh; overflow-y: auto;">
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
  mdiHelpCircleOutline,
  mdiCodeBraces
} from '@mdi/js'

const drawer = ref<boolean>(true)
const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>