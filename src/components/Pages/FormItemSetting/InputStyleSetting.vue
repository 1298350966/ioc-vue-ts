<template>
<setting-item-box name="颜色">
    <setting-item name="边框颜色">
        <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="styleOptions.borderColor"
            show-alpha
        ></el-color-picker>
    </setting-item>
    <setting-item name="聚焦时边框颜色">
        <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="styleOptions.focusBorderColr"
            show-alpha
        ></el-color-picker>
    </setting-item>
    <setting-item name="文字颜色">
        <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="styleOptions.textColor"
            show-alpha
        ></el-color-picker>
    </setting-item>
    <setting-item name="背景色">
        <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="styleOptions.bgColor"
            show-alpha
        ></el-color-picker>
    </setting-item>
</setting-item-box>
</template>
<script setup lang="ts">
const props = defineProps({
    styleOptions:{
        type:Object,
        required:true
    }
})
const emit = defineEmits(['update:styleOptions'])
watch(()=>props.styleOptions,(val,oldVal)=>{
    emit('update:styleOptions',val)
},{deep:true})
</script>