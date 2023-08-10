import * as monaco from 'monaco-editor';
// import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
// import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
// import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

self.MonacoEnvironment = {
  async getWorker(_, label) {
    if (label === 'json') {
      const asyncJsonWorker =  (await import('monaco-editor/esm/vs/language/json/json.worker?worker')).default
      return  new asyncJsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      const asyncCssWorker =  (await import('monaco-editor/esm/vs/language/css/css.worker?worker')).default
      return new asyncCssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      const asyncHtmlWorker =  (await import('monaco-editor/esm/vs/language/html/html.worker?worker')).default
      return new asyncHtmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      const asyncTsWorker =  (await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker')).default
      return new asyncTsWorker()
    }
    const asyncEditorWorker =  (await import('monaco-editor/esm/vs/editor/editor.worker?worker')).default
    return new asyncEditorWorker()
  }
}
monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);