<template>
  <div class="objectEditor">
    <el-card style="width: 100%;" body-style="width: 100%; padding: 0; box-sizing: border-box;">
      <monaco-editor height="100px" v-model="defaultStr" language="json" :editorOptions="{
        lineNumbers: 'off',
        lineDecorationsWidth: -10,
        minimap: { enabled: false },
      }" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { isObject } from 'lodash';

const props = defineProps<{
  modelValue: any,
  type:String,
}>()
const emit = defineEmits(["update:modelValue"])
const defaultStr = ref("")
onMounted(()=>{
  try {
    defaultStr.value = JSON.stringify(props.modelValue)
  } catch (error) {
  }
})
watch(defaultStr, (val) => {
  try {
    let _val = JSON.parse(val)
    if(props.type == "array"){
      if(!Array.isArray(_val)) return 
      emit("update:modelValue",_val )
    }else if(props.type == "object"){
      if(!isObject(_val))return
      emit("update:modelValue",_val )
    }
  } catch (error) {

  }
})

</script>

<style scoped></style>