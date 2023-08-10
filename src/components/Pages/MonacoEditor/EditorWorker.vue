<template></template>

<script lang="ts" setup>
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'


// @ts-ignore
self.MonacoEnvironment = {
  async getWorker(workerId, label) {
    console.log(`output->`,workerId, label)
    if (label === 'json') {
      // const jsonWorker = (await import("monaco-editor/esm/vs/language/json/json.worker?worker")).default
      return new jsonWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      // const tsWorker = (await import("monaco-editor/esm/vs/language/typescript/ts.worker?worker")).default
      return new tsWorker()
    }
    if (label === 'html') {
      // const htmlWorker = (await import("monaco-editor/esm/vs/language/html/html.worker?worker")).default
      return new htmlWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      // const cssWorker = (await import("monaco-editor/esm/vs/language/css/css.worker?worker")).default
      return new cssWorker()
    }
    return new editorWorker()
  }
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
</script>
