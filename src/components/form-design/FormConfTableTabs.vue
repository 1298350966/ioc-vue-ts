<template>
  <div>
     <el-tabs v-model="activeName" >
        <el-tab-pane label="分页查询" name="first">
            <template v-if="activeName == 'first'">
                <FormConfTable v-on="$listeners" v-bind="$attrs"></FormConfTable>
            </template>
        </el-tab-pane>
        <el-tab-pane label="分组查询" name="second">
            <template v-if="activeName == 'second'">
                <FormConfTableV2 v-on="$listeners" v-bind="$attrs"></FormConfTableV2>
            </template>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FormConfTable from "./FormConfTable.vue";
import FormConfTableV2 from "./FormConfTableV2.vue";
export default {
    name:'FormConfTableTabs',
    components:{ FormConfTable, FormConfTableV2 },
    props:{},
    data(){
        return{
            activeName:'first',
        }
    },
}
</script>

<style>

</style>