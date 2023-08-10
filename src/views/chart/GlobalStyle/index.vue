<template>
  <div>
    <monaco-editor height="800px" v-model="defaultStr" language="css" :editorOptions="{
                  lineNumbers: 'off',
                  lineDecorationsWidth: -10,
                  minimap: { enabled: false },
                }" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const defaultStr = ref("")
</script>

<style scoped>

</style>