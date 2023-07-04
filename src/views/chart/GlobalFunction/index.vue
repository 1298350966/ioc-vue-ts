<template>
  <content-box class="kh-GlobalFunction" title="公共方法">
    <template #top-right>
      <el-button link icon="Plus" @click="addData"></el-button>
      <el-button link icon="DeleteFilled" @click="clearGlobalFunction"></el-button>
    </template>
    <el-empty
      v-if="getGlobalFunction.length === 0"
      class="empty-box"
      :image-size="100"
      description="暂无数据"
    />

    <el-collapse v-else>
      <template v-for="(item, index) in getGlobalFunction" :key="item.key">
        <el-collapse-item :title="item.name" :name="item.key">
          <template #title>
            <div class="kh-flex-between model-item">
              <span>{{ item.name }}</span>
              <span class="kh-flex-between model-item-icon" @click.stop>
                <el-icon :size="16" color="#2196f3" @click.stop="editData(item)">
                  <Edit />
                </el-icon>

                <el-popconfirm
                  title="确定要删除该模型吗？"
                  icon-color="red"
                  @confirm="removeGlobalFunction(item.functionName)"
                >
                  <template #reference>
                    <el-icon :size="16" color="#f44336"><Delete /></el-icon>
                  </template>
                </el-popconfirm>
              </span>
            </div>
          </template>
          <el-card>
            <p>
              <span class="func-annotate">// {{ item.name }}</span>
              <br />
              <span class="func-keyword">{{ item.functionName }}</span> (data) {
            </p>
            <p class="go-ml-4">
              <h-code
                style="padding: 0;"
                :code="item.functionContext"
                language="typescript"
              ></h-code>
            </p>
            <p>}<span>,</span></p>
          </el-card>
        </el-collapse-item>
      </template>
    </el-collapse>
    <addAndEditGlobalFunction
      v-if="addAndEditGlobalFunctionShow"
      :data="GlobalFunctionData"
      v-model="addAndEditGlobalFunctionShow"
      @save="save"
    ></addAndEditGlobalFunction>
  </content-box>
</template>

<script setup lang="ts">
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { ContentBox } from "../ContentBox/index";
import addAndEditGlobalFunction from "./components/addAndEditGlobalFunction.vue";

const { getGlobalFunction, addGlobalFunction,removeGlobalFunction,clearGlobalFunction } = useChartEditStore();
const addAndEditGlobalFunctionShow = ref(false);
const GlobalFunctionData = ref(null);
function addData() {
  GlobalFunctionData.value = null;
  addAndEditGlobalFunctionShow.value = true;
}
function editData(data) {
  GlobalFunctionData.value = data;
  addAndEditGlobalFunctionShow.value = true;
}

function save(data) {
  addGlobalFunction(data);
}
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}
.func-keyword {
  color: #b478cf;
}

.func-annotate {
  color: #70c0e8;
}
pre code.hljs {
    padding: 0;
  }
.kh-GlobalFunction {
  // .empty-box{
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -100%);
  // }
  .model-item {
    padding-left: 10px;
    width: 100%;

    .model-item-icon {
      :deep(.el-icon) {
        margin-right: 5px;
      }
    }
  }
}
</style>
