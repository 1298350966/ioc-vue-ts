<template>
  <div id="myDiv" ref="myDiv">
    <el-form
      :class="{formBox:data.config.isBorder}"
      :style="formBoxStyle"
      ref="buildForm"
      :label-suffix="data.config.labelSuffix ? data.config.labelSuffix : ''"
      :size="this.KHUtils.isNull(data) ? 'small' : data.config.size"
      :model="models"
      :rules="rules"
      :label-position="this.KHUtils.isNull(data) ? 'right' : data.config.labelPosition"
      :label-width="this.KHUtils.isNull(data) ? '100px' : data.config.labelWidth + 'px'"
    >
      <template v-for="(item,index) in data.list" >
        <template
          v-if="
            item.type === 'grid'
          "
        >
          <el-row
            class="cellBox gridLine"
            :key="item.model"
            type="flex"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align"
          >
            <el-col
              class="lineItem"
              v-for="(col, colIndex) in item.columns"
              :key="colIndex"
              :span="col.span"
            >
              <template v-for="colItem in col.list">
                <form-detail-build-item
                 class="cellBox"
                  v-if="
                    colItem.show &&
                    (addOrEdit
                      ? Object.keys(colItem.options).indexOf('showFields') < 0 ||
                        !colItem.options.showFields
                      : Object.keys(colItem.options).indexOf('editShowFields') < 0 ||
                        !colItem.options.editShowFields)
                  "
                  :key="colItem.model"
                  :models.sync="models"
                  :rules="rules"
                  :box="colItem"
                  :form-id="formId"
                  :addOrEdit="addOrEdit"
                  :remote="remote"
                  @func="getMsgFormSon"
                ></form-detail-build-item>
              </template>
            </el-col>
          </el-row>
        </template>
        <div class="cellBox tableBox" :key="index" v-else-if="item.type === 'table' || item.type === 'flow_table'">
            <div class="table-header" >
              <div class="header-title">{{item.name}}</div>
            </div>  
            <single-table :item="getSubTableConfig(item.key)" :data-config="data.config" :form-id="formId"
                              :parent-id="parentBusinessId" :isDetail="true"></single-table>
        </div>
        <template v-else>
          <form-detail-build-item
            class="cellBox"
            v-if="
              item.show &&
              (addOrEdit
                ? Object.keys(item.options).indexOf('showFields') < 0 ||
                  !item.options.showFields
                : Object.keys(item.options).indexOf('editShowFields') < 0 ||
                  !item.options.editShowFields)
            "
            :key="item.model"
            :models.sync="models"
            :rules="rules"
            :box="item"
            :form-id="formId"
            :addOrEdit="addOrEdit"
            :remote="remote"
            @func="getMsgFormSon"
          ></form-detail-build-item>
        </template>
      </template>
    </el-form>
  </div>
</template>

<script>
import FormDetailBuildItem from "@/components/form-build/RestructureFormDetailBuildItem";
import SingleTable from "@/components/table/SingleTable";

export default {
  name: "RestructureFormBuild",
  components: {
      FormDetailBuildItem,
      SingleTable
  },
  // data: ????????????; (??????)
  // value: ??????????????????{input_01:1,text_01:"111"}; (??????)
  // addOrEdit: ????????????????????????Or??????,true:??????; (??????),??????????????????????????????
  // remote: ????????????????????????????????????????????????????????? (?????????)
  props: ["data", "value", "addOrEdit", "remote", "formId","tableFormConfig","parentBusinessId"],
  /*        props: {
                    "data": {type: Object, required: true},// data: ????????????????????????
                    "value": {type: Object, required: true},// value: ??????????????????{input_01:1,text_01:"111"}; (??????)
                    "addOrEdit": {type: Boolean, required: true},// addOrEdit: ????????????????????????Or??????,true:??????; (??????),??????????????????????????????
                    "remote": {type: Object, required: false},// remote: ????????????????????????????????????????????????????????? (?????????)
                    "formId": {type: Number, required: false},// formId: ??????ID,????????????????????????
                    "isDetail" ?????????????????????
                },*/

  watch: {
    value: {
      deep: true,
      handler(value) {
        this.models = { ...this.models, ...value };
      },
    },
  },
  computed:{
      getSubTableConfig(){
          return function (key) {
              if(this.tableFormConfig instanceof Array && this.tableFormConfig.length >0){
                  return this.tableFormConfig.find((item, index, array) => {
                      return item.key == key;
                  });
              }
          }
      },
      formBoxStyle(){
        return {
            "--border-color": (this.data && this.data.config.borderColor) ? this.data.config.borderColor : "#e6ebfe",
            "--border-width":(this.data && this.data.config.borderWidth) ? this.data.config.borderWidth + "px" : "1px",
            "--border-style": (this.data && this.data.config.borderStyle) ? this.data.config.borderStyle : "solid"
        }
      }
  },
  created() {
    this.buildModule(this.data.list);
    console.log(this.data);
  },

  data() {
    return {
      models: {},
      rules: {},
      relatedList: [], //  ????????????????????????key??????
      defaultRelatedList: [], //  ???????????????????????????????????????,
    };
  },

  mounted() {
    setTimeout(() => {
      var myDiv = document.getElementById("myDiv");
      this.KHForm.initGlobalStyle(myDiv, this, this.data.list, this.data.config);
    }, 100);
    // ?????????????????????????????????????????????
    let radios = [];
    let radiosRelatedList = [];
    this.relatedList = [];
    this.defaultRelatedList = [];
    if (!this.KHUtils.isNull(this.data.list)) {
      this.data.list.forEach((item) => {
        this.$set(item, "show", true);
        if (item.type === "radio" || item.type === "select") {
          radios.push(item);
        } else if (item.type === "grid") {
          // ??????????????????
          loop(item);

          function loop(obj) {
            if (obj.columns) {
              obj.columns.forEach((cs) => {
                cs.list.forEach((ls) => {
                  if (ls.type === "radio" || ls.type === "select") {
                    radios.push(ls);
                  }
                  ls.show = true;
                  if (ls.columns) {
                    loop(ls);
                  }
                });
              });
            }
          }
        } else if (item.type === "table") {
          if (item.tableColumns && item.tableColumns.length > 0) {
            item.tableColumns.forEach((obj) => {
              this.$set(obj, "show", true);
            });
          }
        }
      });
    }
    radios.forEach((item) => {
      item.options.options.forEach((val) => {
        if (!this.KHUtils.isNull(val.relatedList)) {
          radiosRelatedList.push(...val.relatedList);
        }
      });
    });

    radiosRelatedList.forEach((key) => {
      for (let i = 0; i < radios.length; i++) {
        if (key === radios[i].key) {
          radios.splice(i, 1);
          i++;
        }
      }
    });
    radios.forEach((item) => {
      item.options.options.forEach((val) => {
        if (!this.KHUtils.isNull(val.relatedList)) {
          if (val.value === this.value[item.model]) {
            this.defaultRelatedList.push(...val.relatedList);
          } else if (item.options.defaultValue === val.value) {
            this.defaultRelatedList.push(...val.relatedList);
          } else {
            this.relatedList.push(...val.relatedList);
          }
        }
      });
      Array.from(new Set(this.relatedList));
      Array.from(new Set(this.defaultRelatedList));
      this.loopQuery(this.defaultRelatedList, true);
      this.loopQuery(this.relatedList, false);
    });
    this.switchControl(this.relatedList, false);
    this.switchControl(this.defaultRelatedList, true);
  },

  methods: {
    // ????????????????????????????????????????????????key??????
    loopQuery(list, type) {
      if (!this.KHUtils.isNull(list)) {
        list.forEach((key) => {
          for (let i = 0; i < this.data.list.length; i++) {
            if (
              this.data.list[i].key === key &&
              (this.data.list[i].type === "radio" || this.data.list[i].type === "select")
            ) {
              let arr = [];
              let defaultArr = [];
              this.data.list[i].options.options.forEach((item) => {
                if (!this.KHUtils.isNull(item.relatedList)) {
                  if (type) {
                    if (item.value === this.data.list[i].options.defaultValue) {
                      defaultArr.push(...item.relatedList);
                    } else {
                      arr.push(...item.relatedList);
                    }
                  } else {
                    arr.push(...item.relatedList);
                  }
                }
              });
              Array.from(new Set(defaultArr));
              Array.from(new Set(arr));
              this.relatedList.push(...arr);
              this.loopQuery(arr, false);
              if (type) {
                this.defaultRelatedList.push(...defaultArr);
                this.loopQuery(defaultArr, true);
              }
              break;
            }
          }
        });
      }
    },
    // ?????????????????????
    switchControl(keys, isShow) {
      if (Array.isArray(keys)) {
        keys.forEach((key) => {
          for (let i = 0, j = this.data.list.length; i < j; i++) {
            if (key === this.data.list[i].key) {
              this.data.list[i].show = isShow;
              break;
            }
            // ??????????????????
            if (this.data.list[i].type === "grid") {
              loop(this.data.list[i]);
            }

            function loop(obj) {
              if (obj.columns) {
                obj.columns.forEach((cs) => {
                  cs.list.forEach((ls) => {
                    if (key === ls.key) {
                      ls.show = isShow;
                    }
                    if (ls.columns) {
                      loop(ls);
                    }
                  });
                });
              }
            }
          }
        });
      }
    },
    // ?????????????????????????????????????????????
    getMsgFormSon(buildObj) {
      let _this = this;
      let data = buildObj.data;
      let buildList = _this.data.list;
      if (buildList.length <= 1) return;
      this.relatedList = []; //  ????????????????????????|????????????relatedList
      this.defaultRelatedList = []; //  ?????????|??????????????????????????????relatedList
      const options = buildObj.options.options;
      for (let i = 0; i < options.length; i++) {
        if (!this.KHUtils.isNull(options[i].relatedList)) {
          if (options[i].value === data) {
            this.defaultRelatedList = options[i].relatedList;
          } else {
            this.relatedList.push(...options[i].relatedList);
          }
        }
      }
      Array.from(new Set(this.relatedList));
      Array.from(new Set(this.defaultRelatedList));
      this.loopQuery(this.defaultRelatedList, true);
      this.loopQuery(this.relatedList, false);
      this.switchControl(this.relatedList, false);
      this.switchControl(this.defaultRelatedList, true);
    },
    // ?????????????????????
    buildModule(buildList) {
      let _this = this;
      if (this.KHUtils.isNull(buildList)) {
        return false;
      }
      for (let i = 0; i < buildList.length; i++) {
        if (buildList[i].type === "grid") {
          buildList[i].columns.forEach((item) => {
            _this.buildModule(item.list);
          });
        } else {
          if (_this.value && Object.keys(_this.value).indexOf(buildList[i].model) >= 0) {
            _this.models[buildList[i].model] = _this.value[buildList[i].model];
          } else {
            if (buildList[i].type === "blank") {
              _this.$set(
                _this.models,
                buildList[i].model,
                buildList[i].options.defaultType === "String"
                  ? ""
                  : buildList[i].options.defaultType === "Object"
                  ? {}
                  : []
              );
            } else {
              if (buildList[i].type === "table") {
                _this.models[buildList[i].model] = [];
              } else {
                _this.models[buildList[i].model] = buildList[i].options.defaultValue;
              }
            }
          }
          // ??????????????????
          if (_this.rules[buildList[i].model]) {
            _this.rules[buildList[i].model] = [
              ..._this.rules[buildList[i].model],
              ...buildList[i].rules.map((item) => {
                if (item.pattern) {
                  return { ...item, pattern: eval(item.pattern) };
                } else {
                  return { ...item };
                }
              }),
            ];
          } else {
              if(buildList[i].rules instanceof Array && buildList[i].rules.length >0){
                  _this.rules[buildList[i].model] = [
                      ...buildList[i].rules.map((item) => {
                          if (item.pattern) {
                              return { ...item, pattern: eval(item.pattern) };
                          } else {
                              return { ...item };
                          }
                      }),
                  ];
              }

          }
        }
      }
    },
    // ????????????????????????
    getData() {
      let _this = this;
      return new Promise((resolve, reject) => {
        _this.$refs.buildForm.validate((valid) => {
          if (valid) {
            resolve(_this.models);
          } else {
            reject(new Error("????????????????????????").message);
          }
        });
      });
    },
    // ????????????
    reset() {
      let _this = this;
      _this.$refs.buildForm.resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/components/form-build/scss/tableMode.scss";
.header-title {
    font-weight: bolder;
    color: #3A3B3F;
    position: relative;
    margin-right: auto;
    // margin-bottom: 10px;
    margin-left: 10px;

    &::before {
        content: '';
        display: block;
        height: 17px;
        border-right: 3px solid #3581FB;
        position: absolute;
        left: -10px;
    }
}
</style>
