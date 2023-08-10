<template>
  <div class="wangEditor">
  <Toolbar v-if="isToolbar" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
  <Editor class="Editor" :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="overflow-y: hidden"
    @onCreated="handleCreated" @onChange="handleChange" @onDestroyed="handleDestroyed" @onFocus="handleFocus"
    @onBlur="handleBlur" @customAlert="customAlert" @customPaste="customPaste" />  
  </div>
</template>

<script lang="ts" setup>
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const props = withDefaults(defineProps<{
  modelValue: string,
  isToolbar:boolean
}>(),{
  isToolbar:true
})
const emit = defineEmits(['update:modelValue'])
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref(props.modelValue || "");
const mode = 'default'
const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;

  editor.destroy();
});

// 编辑器回调函数
const handleCreated = (editor) => {
  console.log("created", editor);
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
  console.log("change:", editor.getHtml());
};
const handleDestroyed = (editor) => {
  console.log("destroyed", editor);
};
const handleFocus = (editor) => {
  console.log("focus", editor);
};
const handleBlur = (editor) => {
  console.log("blur", editor);
};
const customAlert = (info, type) => {
  alert(`【自定义提示】${type} - ${info}`);
};
const customPaste = (editor, event, callback) => {
  console.log("ClipboardEvent 粘贴事件对象", event);

  // 自定义插入内容
  // editor.insertText("xxx");

  // 返回值（注意，vue 事件的返回值，不能用 return）
  // callback(false); // 返回 false ，阻止默认粘贴行为
  callback(true) // 返回 true ，继续默认的粘贴行为
};


watch(valueHtml,(val)=>{
  emit('update:modelValue',val)
})
</script>
<style lang="scss" scoped>

  .wangEditor{
    display: flex;
    flex-flow: column;
    height: 500px;
    // --w-e-textarea-bg-color:var(--bg-color-1);
    // --w-e-textarea-color: var(--font-color);
    // // --w-e-toolbar-bg-color: var(--bg-color-1);
    // --w-e-toolbar-color:var(--font-color);
    // --w-e-toolbar-border-color:var(--el-border-color);
    // --w-e-textarea-bg-color:transparent;
    // --w-e-toolbar-bg-color: transparent;
    .Editor{
      flex: 1;
    }
  }
</style>