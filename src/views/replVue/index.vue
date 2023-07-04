

<template>
  <div style="width: 100%;height: 100vh;">
    <Repl :editor="CodeMirror" />
  </div>
</template>


<script setup lang="ts">
import { Repl } from '@vue/repl'
import CodeMirror from '@vue/repl/codemirror-editor'
import '@vue/repl/style.css'

console.log(`output->`,Repl)
</script>

<style scoped>

</style>