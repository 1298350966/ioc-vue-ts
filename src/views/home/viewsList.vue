<template>
  <div>
    <!-- <div class="mb-15px">
      <el-input></el-input>
    </div> -->

    <div class="viewsList">
      <div class="viewItem" v-for="(item, index) in viewsList" :key="index">
        <el-image class="img" :src="item.imgSrc"></el-image>
        <div class="bottom">
          <span class="text">{{ item.name }}</span>
          <el-button size="small" @click="goChartPage(item.id)">编辑</el-button>
        </div>

      </div>
      <div class="add" @click="goChartPage()">
        <el-icon size="40px">
          <Plus />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { findAllViewsHttp } from '@/api/apiHttp/views';
import { ref } from 'vue';
import { getUUID } from "@/utils";
import { useVisibilitychange } from '@/hooks/useVisibilitychange.hooks';
const viewsList = ref([])
const router = useRouter()
async function setViewsList() {
  let res = await findAllViewsHttp()
  if (res.data) viewsList.value = res.data
}
setViewsList()
useVisibilitychange(setViewsList)

function goChartPage(id=undefined) {
  window.open( import.meta.env.BASE_URL + "#" + "/chart/home/" + ( id || getUUID()) + "?type=" + (id ? "update" : "create"))
  // router.push("/chart/home/" + ( id || getUUID()))
}

// document.addEventListener('visibilitychange', function ()
</script>

<style lang="scss" scoped>
.viewsList {
  width: 100%;
  height: 100%;
  display: grid;
  grid-gap: 20px 20px;
  grid-auto-rows: 200px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

  .viewItem {
    border-radius: 5px;
    background: var(--color-bg-3);
    overflow: hidden;
    transition: all 0.1s;

    &:hover {
      transform: scale(1.1);
    }

    //  height: 200px;
    .img {
      width: 100%;
      height: calc(100% - 40px);
    }

    .bottom {
      width: 100%;
      display: inline-grid;
      grid-template-columns: 1fr 60px;
      grid-gap: 10px;
      padding: 0 10px;
      box-sizing: border-box;
      align-items: center;
      height: 32px;
      .text {
        font-size: 14px;
        color: var(--color-text-3);
      }
    }

  }

  .add {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-2);
    cursor: pointer;
    transition: all 0.1s;

    &:hover {
      transform: scale(1.1);
    }
  }

}</style>