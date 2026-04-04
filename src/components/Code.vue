<template>
  <v-card border="thin" width="100%" class="fill-width">
    <v-sheet class="code-block">
      <pre class="code-content"><code v-html="highlightedCode"></code></pre>

      <v-btn
        :icon="copied ? mdiCheck : mdiContentCopy"
        variant="text"
        size="small"
        class="copy-btn"
        :color="copied ? 'success' : undefined"
        @click="copyToClipboard"
      />
    </v-sheet>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { mdiCheck, mdiContentCopy } from "@mdi/js";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: "csharp",
    validator: (value) =>
      ["csharp", "html", "xml", "javascript", "python", "json"].includes(value),
  },
});

const copied = ref(false);

const highlightedCode = computed(() => {
  try {
    return hljs.highlight(props.text, { language: props.language }).value;
  } catch {
    return hljs.highlightAuto(props.text).value;
  }
});

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.text);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (e) {
    console.error("Failed to copy:", e);
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
  font-family: "Cascadia Mono", "Consolas", monospace;
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
}

.copy-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  opacity: 0.6;
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.copy-btn:hover {
  opacity: 1;
}
</style>
