<template>
  <el-tabs v-model="tabsActiveName" class="demo-tabs">
    <el-tab-pane v-for="(item, index) in customComponentsConfig" :key="index" :label="item.name" name="1">
      <template v-if="item.list">
        <!-- <el-tabs tab-position="left" v-model="tabsActiveName2" class="demo-tabs">
          <el-tab-pane v-for="(item1, index) in item.list" :key="index" :label="item1.name" name="1">
            <div class="iconSelectBox  grid-items-center grid-gap-15px">  
                <div  class="img-box" v-for="(item2, index) in item1.list" :key="index">
                  <el-image fit="contain" class="icon" :src="item2.image"></el-image>
                  <span>{{ item2.name }}</span>
                </div>
              </div>
          </el-tab-pane>
        </el-tabs> -->
        <div class="iconSelectBox  grid-items-center grid-gap-15px">
          <div :class="{ select: item2.componentName == selectComponentName }" class="img-box"
            v-for="(item2, index) in item.list" :key="index" @click="select(item2)">
            <el-image fit="contain" class="icon" :src="item2.image"></el-image>
            <span>{{ item2.name }}</span>
          </div>
        </div>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { customComponentsConfig } from "@/customComponents/index"

// defineOptions({
//   name:"imgSelect"
// })
const emit = defineEmits(["select"])
const props = defineProps<{
  customComponentsConfig: any,
}>()
const tabsActiveName = ref("1")
const tabsActiveName2 = ref("1")
const selectComponentName = ref("")
function select(item) {
  selectComponentName.value = item.componentName
  emit('select', item)
}

</script>

<style lang="scss" scoped>
.iconSelectBox {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.img-box {
  border-radius: 5px;
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 15px;
  cursor: pointer;

  .icon {
    border-radius: 5px;
    transition: all 0.3s;

    &:hover {
      transform: scale(1.1);
    }
  }

  span {
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin-top: 10px;
    font-size: 12px;
  }
}

.select {
  background: #0080ff2f;
  ;
  border: 1px solid var(--el-color-primary);
}</style>