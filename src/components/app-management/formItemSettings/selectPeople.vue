<template>
  <div>
    <el-dialog
      title="选择人员"
      custom-class="selectPeople"
      :visible.sync="approverVisible"
      width="800px"
      append-to-body
      destroy-on-close
      class="promoter_person"
    >
      <div class="person_body clear">
        <div class="person_tree l">
          <!-- <input
            type="text"
            placeholder="搜索成员"
            v-model="approverSearchName"
            @input="getDebounceData($event)"
          /> -->
          <p class="ellipsis tree_nav" v-if="!approverSearchName">
            <span @click="getDepartmentList2(0)" class="ellipsis">组织架构</span>
            <span
              v-for="(item, index) in titleDepartments"
              class="ellipsis"
              :key="index + 'a'"
              @click="getDepartmentList2(item, index)"
              >{{ item.orgName }}</span
            >
          </p>
          <ul>
            <li v-for="(item, index) in orgList" :key="index + 'b'" class="check_box not">
              <a @click="addOrgSelectList(item)"
                ><img src="@/assets/images/flow/icon_file.png" />{{ item.orgName }}</a
              >
              <i @click="getDepartmentList(item)">下级</i>
            </li>
            <li v-for="(item, index) in userList" :key="index + 'c'" class="check_box">
              <a
                :class="toggleClass(approverEmplyessList, item) && 'active'"
                @click="toChecked(approverEmplyessList, item)"
                :title="item.departmentNames"
              >
                <img src="@/assets/images/flow/icon_people.png" />{{ item.realName }}</a
              >
            </li>
          </ul>
        </div>
        <div class="has_selected l">
          <p class="clear">
            已选（{{ approverEmplyessList.length }}）
            <a
              @click="
                approverEmplyessList = [];
                orgSelectList = [];
              "
              >清空</a>
          </p>
          <ul>
            <li
              v-for="(item, index) in orgSelectList"
              :key="index + 'b'"
              class="check_box not"
            >
              <img src="@/assets/images/flow/icon_file.png" />
              <span>{{ item.orgName }}</span>
              <img
                src="@/assets/images/flow/cancel.png"
                @click="removeEle(orgSelectList, item)"
              />
            </li>
            <li v-for="(item, index) in approverEmplyessList" :key="index + 'e'">
              <img src="@/assets/images/flow/icon_people.png" />
              <span>{{ item.realName }}</span>
              <img
                src="@/assets/images/flow/cancel.png"
                @click="removeEle(approverEmplyessList, item)"
              />
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approverVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureApprover">确 定</el-button>
      </span>
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
    selectType: {
      type: Number,
      default: 0,
    },
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    isOrgSelect:{
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      columnArray: [],
      value: [],
      orgList: [],
      orgSelectList: [],
      userList: [],
      titleDepartments: [],
      approverEmplyessList: [],
      approverSearchName: "",
    };
  },
  computed: {
    approverVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        return this.$emit("update:visible", val);
      },
    },
  },
  mounted() {
    this.listOrgByParentIdHttp();
    this.initData()
  },
  methods: {
    initData(){
      this.orgSelectList = []
      this.approverEmplyessList = []
      this.data.forEach((e)=>{
        if(e.type == 0){
          this.orgSelectList.push({
            id:e.id,
            orgName:e.name,
          })
        } else if(e.type == 1) {
          this.approverEmplyessList.push({
            id:e.id,
            realName:e.name,
          })
        }
      })
    },
    addOrgSelectList(item){
      if(this.isOrgSelect){
        this.orgSelectList.push(item)
      }
    },
    async listOrgByParentIdHttp(parentId) {
      let params = {
        parentId: parentId || "",
      };
      const { listOrgByParentId } = this.khConfig.api;
      let res = await this.$Get(listOrgByParentId, params);
      if (res == "error") return;
      this.orgList = res.list;
      this.listUserByOrgIdHttp(parentId);
    },
    async listUserByOrgIdHttp(orgId) {
      let params = {
        orgId: orgId,
      };
      const { listUserByOrgId } = this.khConfig.api;
      // 
      let res = await this.$Get(listUserByOrgId, params);
      if (res == "error") return;
      // 
      this.userList = res.list;
    },
    sureApprover() {
      // 
      this.approverVisible = false;
      // this.$emit("update:data",this.value)
      let orgSelectList = this.orgSelectList.map((value) => {
        return {
          id: value.id,
          name: value.orgName,
          type: 0,
        };
      });
      let dataLsit = this.approverEmplyessList.map((value) => {
        return {
          id: value.id,
          name: value.realName,
          type: 1,
        };
      });
      this.$emit("onSelectPeople", [...orgSelectList, ...dataLsit]);
      // console.log(this.approverEmplyessList,this.data)
    },
    toggleClass(arr, elem, key = "id") {
      return arr.some((item) => {
        return item[key] == elem[key];
      });
    },
    toChecked(arr, elem, key = "id") {
      ;
      var isIncludes = this.toggleClass(arr, elem, key);

      !isIncludes ? arr.push(elem) : this.removeEle(arr, elem, key);
    },
    removeEle(arr, elem, key = "id") {
      var includesIndex;
      arr.map((item, index) => {
        if (item[key] == elem[key]) {
          includesIndex = index;
        }
      });
      arr.splice(includesIndex, 1);
    },
    getDepartmentList(item) {
      this.titleDepartments.push(item);
      this.listOrgByParentIdHttp(item.id);
    },
    getDepartmentList2(item, index) {
      this.titleDepartments = this.titleDepartments.slice(0, index + 1);
      // 
      this.listOrgByParentIdHttp(item.id);
    },
  },
};
</script>

<style lang="scss" scope>
.selectPeople {
  box-sizing: border-box;
  .ellipsis{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  li {
    list-style-type: none;
  }
  ul {
    padding-left: 5px;
    padding-top: 0;
  }
  .error_tip {
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(150%, 0px);
    font-size: 24px;
  }
  .add-node-popover-body {
    display: flex;
  }
  .promoter_content {
    padding: 0 20px;
  }
  .condition_content .el-button,
  .copyer_content .el-button,
  .approver_self_select .el-button,
  .promoter_content .el-button,
  .approver_content .el-button {
    margin-bottom: 20px;
  }
  .promoter_content p {
    padding: 18px 0;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
  }
  .promoter_person .el-dialog__body {
    padding: 10px 20px 14px 20px;
  }
  .person_body {
    display: flex;
    border: 1px solid #f5f5f5;
    height: 500px;
    overflow: hidden;
  }
  .person_tree {
    padding: 10px 12px 0 8px;
    width: 50%;
    // height: 100%;
    border-right: 1px solid #f5f5f5;
    overflow: auto;
    box-sizing: border-box;
  }
  .person_tree input {
    padding-left: 30px;
    width: 100%;
    height: 30px;
    font-size: 12px;
    border-radius: 2px;
    border: 1px solid #d5dadf;
    background: url(~@/assets/images/flow/list_search.png) no-repeat 10px center;
    background-size: 14px 14px;
    margin-bottom: 14px;
  }
  .tree_nav span {
    display: inline-block;
    padding-right: 10px;
    margin-right: 5px;
    max-width: 6em;
    color: #38adff;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    background: url(~@/assets/images/flow/jiaojiao.png) no-repeat right center;
  }
  .tree_nav span:last-of-type {
    background: none;
  }
  .person_tree ul,
  .has_selected ul {
    // height: 420px;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .person_tree li {
    padding: 5px 0;
  }
  .person_tree li i {
    float: right;
    padding-left: 24px;
    padding-right: 10px;
    color: #3195f8;
    font-size: 12px;
    cursor: pointer;
    background: url(~@/assets/images/flow/next_level_active.png) no-repeat 10px center;
    border-left: 1px solid rgb(238, 238, 238);
  }
  .person_tree li a.active + i {
    color: rgb(197, 197, 197);
    background-image: url(~@/assets/images/flow/next_level.png);
    pointer-events: none;
  }
  .person_tree img {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .has_selected {
    width: 50%;
    height: 100%;
    font-size: 12px;
    // overflow: auto;
  }
  .has_selected ul {
    height: 460px;
  }
  .has_selected p {
    padding-left: 19px;
    padding-right: 20px;
    line-height: 37px;
    border-bottom: 1px solid #f2f2f2;
  }
  .has_selected p a {
    float: right;
  }
  .has_selected ul li {
    margin: 11px 26px 13px 19px;
    line-height: 17px;
  }
  .has_selected li span {
    vertical-align: middle;
  }
  .has_selected li img:first-of-type {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .has_selected li img:last-of-type {
    float: right;
    margin-top: 2px;
    width: 14px;
  }
  el-radio-group {
    padding: 20px 0;
  }
  .approver_content {
    padding-bottom: 10px;
    border-bottom: 1px solid #f2f2f2;
  }
  .approver_content .el-radio,
  .approver_some .el-radio,
  .approver_self_select .el-radio {
    width: 27%;
    margin-bottom: 20px;
  }
  .copyer_content .el-checkbox {
    margin-bottom: 20px;
  }
  .el-checkbox__label {
    font-size: 14px;
  }
  .condition_content,
  .copyer_content,
  .approver_self_select,
  .approver_manager,
  .approver_content,
  .approver_some {
    padding: 20px 20px 0;
  }
  .approver_manager p:first-of-type,
  .approver_some p {
    line-height: 19px;
    font-size: 14px;
    margin-bottom: 14px;
  }

  .approver_manager p {
    line-height: 32px;
  }
  .approver_manager select {
    width: 420px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .approver_manager p.tip {
    margin: 10px 0 22px 0;
    font-size: 14px;
    line-height: 16px;
    color: #f8642d;
  }
  .approver_self {
    padding: 28px 20px;
  }
  .selected_list {
    margin-bottom: 20px;
    line-height: 30px;
  }
  .selected_list span {
    margin-right: 10px;
    padding: 3px 6px 3px 9px;
    line-height: 12px;
    white-space: nowrap;
    border-radius: 2px;
    border: 1px solid rgba(220, 220, 220, 1);
  }
  .selected_list img {
    margin-left: 5px;
    width: 7px;
    height: 7px;
    cursor: pointer;
  }
  .approver_self_select h3 {
    margin: 5px 0 20px;
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
  }
  .condition_copyer .el-drawer__body .priority_level {
    position: absolute;
    top: 11px;
    right: 30px;
    width: 100px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .condition_content p.tip {
    margin: 20px 0;
    width: 510px;
    text-indent: 17px;
    line-height: 45px;
    background: rgba(241, 249, 255, 1);
    border: 1px solid rgba(64, 163, 247, 1);
    color: #46a6fe;
    font-size: 14px;
  }
  .condition_content ul {
    max-height: 500px;
    overflow-y: scroll;
    margin-bottom: 20px;
  }
  .condition_content li > span {
    float: left;
    margin-right: 8px;
    width: 70px;
    line-height: 32px;
    text-align: right;
  }
  .condition_content li > div {
    display: inline-block;
    width: 370px;
  }
  .condition_content li:not(:last-child) > div > p {
    margin-bottom: 20px;
  }
  .condition_content li > div > p:not(:last-child) {
    margin-bottom: 10px;
  }
  .condition_content li > a {
    float: right;
    margin-right: 10px;
    margin-top: 7px;
  }
  .condition_content li select,
  .condition_content li input {
    width: 100%;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .condition_content li select + input {
    width: 260px;
  }
  .condition_content li select {
    margin-right: 10px;
    width: 100px;
  }
  .condition_content li p.selected_list {
    padding-left: 10px;
    border-radius: 4px;
    min-height: 32px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .condition_content li p.check_box {
    line-height: 32px;
  }
  .condition_list .el-dialog__body {
    padding: 16px 26px;
  }
  .condition_list p {
    color: #666666;
    margin-bottom: 10px;
  }
  .condition_list p.check_box {
    margin-bottom: 0;
    line-height: 36px;
  }

  .el-icon-edit {
    margin-left: 15px;
    font-size: 18px;
  }
}
</style>
