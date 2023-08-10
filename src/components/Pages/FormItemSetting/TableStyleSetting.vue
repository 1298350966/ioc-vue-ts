<template>
    <setting-item-box name="表格">
        <setting-item name="背景色">
            <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="styleOptions.bgColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="头部行背景色">
            <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="styleOptions.headerBgColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="头部行文字颜色">
            <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="styleOptions.headerTextColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="表格内容文字颜色">
            <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="styleOptions.textColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="hover激活的行背景色">
            <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="styleOptions.rowHoverBgColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="边框颜色">
            <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="styleOptions.borderColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="列颜色">
            <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="styleOptions.trBgColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="斑马纹列颜色">
            <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="styleOptions.stripeTrBgColor"
                show-alpha
            ></el-color-picker>
        </setting-item>
        <setting-item name="边框颜色">
            <el-color-picker
                size="small"
                :modes="['hex']"
                v-model="styleOptions.expandedCellBgColor"
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