<template>
  <div class="views-content">
    <div class="views-header">
      <div class="content__add" @click="goChartPage(null)">
        <!-- <img src="/img/new-project.png" height="40px" alt=""> -->
        <el-icon class="mr-5px" size="16px">
          <Plus />
        </el-icon>
        <p>新建大屏</p>
      </div>
      <el-input v-model="search.name" placeholder="请输入查询名称" class="input-with-select">
        <template #append>
          <el-button icon="Search" @click="searchClick" />
        </template>
      </el-input>
    </div>

    <div class="viewsList">
      <div class="viewItem" v-for="(item, index) in viewsList" :key="index">
        <div class="top">
          <el-image class="img" :src="item.imgSrc"></el-image>

          <div class="box">
            <el-button class="box_button" @click="goChartPage(item.id)">编辑</el-button>
            <div class="box_icon">
              <el-icon @click="goChartPage(item.id)" size="20px">
                <EditPen></EditPen>
               </el-icon>
              <el-icon @click="deleteViews(item.id)" size="20px">
                <Delete></Delete>
               </el-icon>
               <el-icon class="View" size="20px">
                <View></View>
               </el-icon>
               
            </div>
          </div>
        </div>

        <div class="bottom">
          <span class="text">{{ item.name }}</span>
        </div>
      </div>
    </div>

    <div class="pagination-box">
      <el-pagination v-model:current-page="pagination.pageNum" v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 15, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.totalCount" />
    </div>

  </div>
</template>

<script setup lang="ts">

import { findAllViewsHttp, deleteViewsHttp } from '@/api/apiHttp/views';
import { ref } from 'vue';
import { getUUID } from "@/utils";
import { useVisibilitychange } from '@/hooks/useVisibilitychange.hooks';
const viewsList = ref([])
const router = useRouter()
const pagination = reactive({
  pageSize: 10,
  pageNum: 1,
  totalCount: 0
})
const search = reactive({
  name: "",
  type: 0
})

async function setViewsList() {
  let params = {
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize,
    ...search
  }

  let res = await findAllViewsHttp(params)
  if (res.datas) {
    viewsList.value = res.datas
    pagination.pageSize = res.pageSize
    pagination.pageNum = res.pageNum
    pagination.totalCount = res.totalCount
  }
}
setViewsList()


useVisibilitychange(setViewsList)

async function searchClick() {
  pagination.pageNum = 1
  await setViewsList()
}



async function deleteViews(id: string) {
  await deleteViewsHttp(id)
  await setViewsList()
}

function goChartPage(id = undefined) {
  window.open(import.meta.env.BASE_URL + "#" + "/chart/home/" + (id || getUUID()) + "?type=" + (id ? "update" : "create") + "&viewsType=0")
  // router.push("/chart/home/" + ( id || getUUID()))
}

// document.addEventListener('visibilitychange', function ()
</script>

<style lang="scss" scoped>
.views-content {
  .views-header {
    display: grid;
    grid-template-columns: 1fr 300px;
    align-items: center;

    .content__add {
      margin-bottom: 20px;
      width: 160px;
      height: 40px;
      padding: 0 20px;
      box-sizing: border-box;
      vertical-align: middle;
      border: 1px solid #00baff;
      // color: var(--el-text-color-regular);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      position: relative;
      background-image: -webkit-gradient(linear, right top, left top, color-stop(0, rgba(0, 222, 255, .39)), to(rgba(0, 174, 255, .19)));
      background-image: linear-gradient(-90deg, rgba(0, 222, 255, .39), rgba(0, 174, 255, .19));
      -webkit-box-shadow: 0 0 10px 0 rgba(55, 224, 255, .3);
      box-shadow: 0 0 10px 0 rgba(55, 224, 255, .3);
      font-size: 14px;
      cursor: pointer;
      border-radius: 5px;
    }
  }

  .viewsList {
    width: 100%;
    min-height: 610px;
    display: grid;
    grid-gap: 20px 20px;
    grid-auto-rows: 200px;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    margin-bottom: 20px;

    .viewItem {
      border-radius: 5px;
      background: var(--bg-color-3);
      overflow: hidden;
      // transition: all 0.1s;
      border: 1px solid var(--el-border-color);
      position: relative;

      .top {
        position: relative;
        height: calc(100% - 40px);

        .img {
          width: 100%;
          height: 100%;
        }

        &:hover {
          .box {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .box {
    
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color:rgba(var(--el-color-primary-rgb), 0.7) ;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          // opacity: 0;
          transform: translateX(-100%);
          gap: 10px;
          .box_button {
            margin: 5px 0;
            display: inline-block;
            vertical-align: middle;
            height: 34px;
            line-height: 34px;
            padding: 0 40px;
            box-sizing: border-box;
            outline: 0;
            text-align: center;
            font-size: 14px;
            font-weight: 700;
            background-image: linear-gradient(-225deg, #00d3f1, #12b3ff);
            background-color: #2681ff;
            border-color: #2681ff;
            color: #fff;
            border: none;
            transition: .3s ease;
            cursor: pointer;
    
          }
          .box_icon{
            width: 70px;
            display: flex;
            justify-content: space-around;
       
            .el-icon{
              cursor: pointer;
              font-weight: bold;
            }
            .View{
              position: absolute;
              top: 7px;
              right: 7px;
            }
          }
        }
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
          color: var(--font-color-3);
        }
      }



    }

    .add {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-color-2);
      cursor: pointer;
      transition: all 0.1s;

      &:hover {
        transform: scale(1.1);
      }
    }

  }
}



.pagination-box {
  display: flex;
  align-items: center;
  justify-content: center;
}</style>