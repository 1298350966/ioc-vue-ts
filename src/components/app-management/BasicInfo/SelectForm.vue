<template>
  <div>
    <el-dialog
      width="70vw"
      :modal="false"
      title="添加操作"
      custom-class="SelectForm"
      :visible.sync="dialogFormVisible"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <div>
        <el-form :model="form" label-width="100px" :inline="true">
          <el-form-item label="表单名称：" prop="appName">
            <el-input
              v-model="form.name"
              placeholder="请输入名称"
              clearable
              size="small"
            />
          </el-form-item>

          <el-form-item class="opt-button">
            <el-button type="info" @click="listData">搜索</el-button>
            <el-button type="success" @click="listData((form.name = ''))">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- @selection-change="handleSelectionChange($event,item)" -->
        <div class="table-box">
          <el-table
            ref="multipleTable"
            class="process-table"
            v-for="(item, index) in tableData"
            :key="index"
            :data="item.data"
            empty-text="暂无数据"
            tooltip-effect="dark"
            @row-click="rowClick"
          >
            <!-- <el-table-column type="selection" width="80px"></el-table-column> -->
            <el-table-column :label="item.formGroup" type="index" width="450px">
              <template slot-scope="scope">
                <div class="scope-box">
                  <img alt=" " :src="scope.row.formImg" v-if="!scope.row.showDefault" />
                  <img
                    alt=" "
                    src="@/assets/images/default-icon.png"
                    v-if="scope.row.showDefault"
                  />
                  <div class="process-table-box">
                    <h4>{{ scope.row.formName }}</h4>
                    <p>{{ scope.row.formComment }}</p>
                    <p>{{ scope.row.lastUpdateTime }} 更新</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label=" ">
              <template slot-scope="scope">
                <el-row class="second-column">
                  <el-col :span="12">
                    <h4>可见范围</h4>
                    <p
                      style="
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 2;
                      "
                    >
                      {{ scope.row.permissions }}
                    </p>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addData">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        name: "",
        region: "",
      },
      tableData: [],
      multipleSelection: [],
    };
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        return this.$emit("update:visible", val);
      },
    },
  },
  mounted() {
    this.listData();
  },
  methods: {
    // 查询流程相关的表单数据
    listData() {
      const loading = this.$loading({
        lock: true,
        text: "拼命加载中..",
        spinner: "el-icon-loading",
        background: "transparent",
      });
      // 流程表单类型查询
      this.$Get(this.khConfig.api.listFormConfWithPermission, {
        formName: this.form.name || null,
        formType: this.formType,
        pageNum: 1,
        pageSize: 1000,
      }).then((res) => {
        if (res.errCode === 0) {
          this.tableData = [];
          if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
            // 表单分组
            let newArray = [];
            for (let i = 0, n = res.datas.length; i < n; i++) {
              let state = false;
              let compareObj = res.datas[i];
              if (newArray.length > 0) {
                for (let j = 0, m = newArray.length; j < m; j++) {
                  let obj = newArray[j];
                  if (obj.formGroup === compareObj.formGroup) {
                    state = true;
                  }
                }
              }
              if (!state) {
                newArray.push(compareObj);
              }
            }
            if (newArray.length > 0) {
              newArray.forEach((arr) => {
                let dataList = [];
                let newObj = {};
                res.datas.forEach((obj) => {
                  // 查询表单权限
                  if (
                    !this.KHUtils.isNull(obj.formPermissionList) &&
                    obj.formPermissionList.length > 0
                  ) {
                    let temp = "";
                    obj.formPermissionList.forEach((obj) => {
                      temp += obj.subName + "  ";
                    });
                    obj.permissions = temp;
                  } else {
                    obj.permissions = "全部可见";
                  }
                  if (obj.formGroup === arr.formGroup) {
                    if (this.KHUtils.isNull(obj.formImg)) {
                      obj.formImg = "";
                      obj.showDefault = true;
                    } else {
                      obj.formImg = this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + obj.formImg;
                      obj.showDefault = false;
                    }
                    dataList.push(obj);
                  }
                  // 时间格式化
                  obj.lastUpdateTime = obj.lastUpdateTime.split(".")[0];
                });
                newObj.formGroup = arr.formGroup + "(" + dataList.length + ")";
                newObj.data = dataList;
                this.tableData.push(newObj);
              });
            }
          }
        }
        loading.close();
      });
    },
    // handleSelectionChange(val,item,tableData){
    //     console.log(val)
    //     item.multipleSelection = val;
    //     this.multipleSelection = []
    //     this.tableData.forEach((value) => {
    //         if(value.multipleSelection){
    //         this.multipleSelection =  [...value.multipleSelection]
    //         }
    //     })

    //     console.log( this.multipleSelection)
    // },
    rowClick(row) {
      // console.log(JSON.parse(row.formMeta.list));
      this.multipleSelection = {
        formId: row.formId,
        formName: row.formName,
        list: JSON.parse(row.formMeta).list,
      };
      this.addData(row);
    },
    addData(row) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.$emit("onData", row);
    },
  },
};
</script>

<style lang="scss" scope>
.SelectForm {
  height: 70vh;
  box-sizing: border-box;
  position: relative;

  .el-dialog__body {
    padding: 10px 20px;
    height: calc(100% - 116px);
    box-sizing: border-box;
    position: relative;
    overflow: auto;
  }
  .process-table {
    // element-vue中el-table去除底边
    .el-table td,
    .el-table th.is-leaf {
      border-bottom: none;
    }
    .scope-box {
      width: 100%;
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        margin-right: 20px;
      }
      h4,
      p {
        margin: 0;
      }
    }
    // element-vue中el-table去除鼠标悬停背景色
    .el-table tbody tr:hover > td {
      background-color: #ffffff !important;
    }
  }
}
</style>
