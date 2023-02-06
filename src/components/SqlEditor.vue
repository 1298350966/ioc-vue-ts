<template>
  <div style="border: 1px solid #F7F7F7">
        <textarea
          ref="mycode"
          class="codesql"
          v-model="value"
        >
        </textarea>
  </div>
</template>
<script>
  import "codemirror/theme/ambiance.css";
  import "codemirror/lib/codemirror.css";
  import "codemirror/addon/hint/show-hint.css";
  let CodeMirror = require("codemirror/lib/codemirror");
  require("codemirror/addon/edit/matchbrackets");
  require("codemirror/addon/selection/active-line");
  require("codemirror/mode/sql/sql");
  require("codemirror/addon/hint/show-hint");
  require("codemirror/addon/hint/sql-hint");
  export default {
    data() {
      return {
        editor: null
      }
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      sqlStyle: {
        type: String,
        default: 'default'
      },
      readOnly: {
        type: [Boolean, String]
      },
      data: {
        type: Array,
        default: () => {
          return [];
        }
      },
      lineNumbers: {
        type: Boolean,
        default: () => {
          return true;
        }
      }
    },
    watch: {
      newVal (newV, oldV) {
        if (this.editor) {
          this.$emit('changeTextarea', this.editor.getValue())
        }
      }
    },
    computed: {
      newVal () {
        if (this.editor) {
          return this.editor.getValue()
        }
      }
    },


    mounted(){
      this.initEditor();
    },
    methods: {
      setVal () {
        if (this.editor) {
          if (this.value === '') {
            this.editor.setValue('');
          } else {
            this.editor.setValue(this.value);
          }
        }
      },
      initEditor() {
        let mime = 'text/x-mariadb'
        let theme = 'ambiance'//设置主题，不设置的会使用默认主题
        this.editor = CodeMirror.fromTextArea(this.$refs.mycode, {
          value: this.value,
          mode: mime,//选择对应代码编辑器的语言，我这边选的是数据库，根据个人情况自行设置即可
          indentWithTabs: true,
          smartIndent: true,
          lineNumbers: this.lineNumbers,
          matchBrackets: true,
          cursorHeight: 1,
          lineWrapping: true,
          readOnly: this.readOnly,
          //theme: theme,
          // autofocus: true,
          extraKeys: {'[': 'autocomplete'},//自定义快捷键
          hintOptions: {//自定义提示选项
            // 当匹配只有一项的时候是否自动补全
            completeSingle: false,
            tables: this.data
          }
        })
      }
    }
  }
</script>
<style>
  .CodeMirror {
    color: black;
    direction: ltr;
    line-height: 32px;
    height: 550px;
  }
  .CodeMirror-hints{
    z-index: 9999 !important;
  }
</style>
