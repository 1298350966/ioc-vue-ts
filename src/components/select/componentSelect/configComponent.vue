<template>
  <div class="iconSelectBox  grid-items-center grid-gap-15px">
    <div :class="{ select: item.id == selectComponentName }" class="img-box" v-for="(item, index) in viewsList"
      :key="index" @click="select(item)">
      <el-image fit="contain" class="icon" :src="item.imgSrc"></el-image>
      <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { findAllViewsHttp } from '@/api/apiHttp/views';
const emit = defineEmits(["select"])
const selectComponentName = ref("")
const viewsList = ref([])
async function setViewsList() {
  let res = await findAllViewsHttp()
  if (res.data) viewsList.value = res.data
}
setViewsList()
function select(item) {
  selectComponentName.value = item.id
  const { id } = item
  let args = {
    props: { id },
    name: item.name,
    componentName: "components"
  }
  emit('select', args)
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
}
</style>