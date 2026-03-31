<template>
  <v-card border="thin" width="100%" class="fill-width">
    <v-sheet class="code-block">
      <pre class="code-content"><code>{{ text }}</code></pre>

      <v-btn :icon="copied ? mdiCheck : mdiContentCopy" variant="text" size="small" class="copy-btn"
        :color="copied ? 'success' : undefined" @click="copyToClipboard" />
    </v-sheet>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { mdiCheck, mdiContentCopy } from '@mdi/js'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
})

const copied = ref(false)

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error('Failed to copy:', e)
  }
}
</script>

<style scoped>
.fill-width {
  flex: 1 1 100%;
}

.code-block {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 12px 44px 12px 16px;
  min-height: 50px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
}

.code-content {
  flex: 1;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  overflow: auto;
}

code {
  font-family: inherit;
  background: none;
  padding: 0;
}

.copy-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  opacity: 0.6;
  transition: opacity 0.2s, transform 0.2s;
}

.copy-btn:hover {
  opacity: 1;
}
</style>