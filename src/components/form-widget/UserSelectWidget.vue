<template>
  <div class="div-center">
    <div class="ty-transfer mt20 ml20 transfer-center" >
        <el-row class="search-header">
            <el-input v-model="userName" placeholder="请输入用户名或真实姓名" clearable>
                <el-button slot="append" icon="el-icon-search" @click="handlequeryUser"></el-button>
            </el-input>
        </el-row>
      <div class="selectContainer">
        <div class="fl ty-transfer-list transfer-list-left transfer-left"  >
            <div class="ty-transfer-list-head">
            <div>
                <el-breadcrumb class="dib fs14 fw ml5" separator-class="el-icon-arrow-right" style="margin:5px;"  >
                    <el-breadcrumb-item v-for="(item,key) in titleList" :key="key" style="margin-top: 10px;font-size:13px;"><a @click="backOrg(item)">{{item.name}}</a></el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div style="margin-left:auto;height:50px;white-space:nowrap;">
                <el-button size="mini" v-if="isShowReturnButton" style="margin-right:10px;" @click="initDeptUserTree(false)">返回</el-button>
                <el-button size="mini" type="primary" plain style="margin:10px 10px 0 0;" v-if="allowMultiSelect" @click="checkAll">全选</el-button>
            </div>
            </div>
            <div class="ty-transfer-list-body">
            <ul class="ty-tree-select">
                <li v-for="item in currentOrgUser" :key="item.id">
                <div class="ty-tree-div" >
                      <div v-if="!isOrg(item)">
                          <el-checkbox v-model="item.isSelected" @change="addOrgUser(item)" :disabled="allowCheckUser?false:true">
                              <el-avatar class="avatarUser" :size="20" v-if="!isOrg(item)"> {{item.name}} </el-avatar>
                              <span class="tyue-checkbox-txt" >{{item.name}}</span>
                          </el-checkbox>
                      </div>

                      <div v-if="isOrg(item)&&!allowCheckOrg">
                        <i class="el-icon-folder-opened"  style="color: #409EFF;font-size: 18px" v-if="isOrg(item)"></i>
                        <!-- <i  style="color: #409EFF;font-size: 18px" v-if="isOrg(item)"></i> -->
                        <span class="tyue-checkbox-txt" >{{item.name}}</span>
                        <el-link type="primary" style="float: right" v-if="isOrg(item)"
                                @click="exterOrg(item)">下级
                        </el-link>
                      </div>

                      <div v-if="isOrg(item)&&allowCheckOrg">
                        <el-checkbox v-model="item.isSelected" @change="addOrgUser(item)" style="width:100%;display:flex;">
                          <!-- <i  style="color: #409EFF;font-size: 18px" v-if="isOrg(item)"></i> -->
                          <i class="el-icon-folder-opened"  style="color: #409EFF;font-size: 18px" v-if="isOrg(item)"></i>
                          <span class="tyue-checkbox-txt" >{{item.name}}</span>
                          <el-link type="primary" style="float: right;" v-if="isOrg(item)"
                                  @click="exterOrg(item)">下级
                          </el-link>
                        </el-checkbox>
                      </div>
                </div>
                </li>
            </ul>
            </div>
        </div>
        <div class="fl ty-transfer-list transfer-list-right transfer-left" style="margin-left: 50px" >
            <div class="ty-transfer-list-head">
            <div style="display:flex;justify-content:space-between;align-items:center;width:100%;padding:3px 10px;">
                <div class="dib fs14 fw ml5" >已选择（{{selectOrgUser.length}}）</div>
                <el-button @click="clearAll" type="danger" plain size="mini" style="height:30px;">清空</el-button>
            </div>
            </div>
            <div class="ty-transfer-list-body">
            <ul class="ty-tree-select">
                <li  v-for="item in selectOrgUser" :key="item.id">
                <div class="ty-tree-div">
                    <el-avatar class="avatarUser" :size="20" v-if="item.type === 1"> {{item.name}} </el-avatar>
                    <label>
                        <i  style="color: #409EFF;font-size: 18px" v-if="isOrg(item)"></i>
                    <span class="tyue-checkbox-txt">{{item.name}}</span>
                    </label>
                    <el-link type="primary" style="float: right"
                            @click="deleteOrgUser(item)">删除
                    </el-link>
                </div>

                </li>
                
            </ul>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    name: "UserSelectWidget",
    props: {

        allowCheckOrg:{ //允许选择部门
            type: Boolean,
            default: false,
        },
        allowCheckUser:{//允许选择人
            type: Boolean,
            default: true,
        },
        allowMultiSelect:{//允许多选
            type: Boolean,
            default: true,
        },
        dataModel:{

        },
        box:{}

    },
    watch:{
        selectOrgUser:{
            handler(val,oldVal){
                // 由于外部组件自动赋值时只接受用户控件的username配置项，而传值的selectOrgUser只包含userName属性，此处做属性转化以实现兼容
                this.selectOrgUserConversion = val.map((item)=>{
                  let obj = {...item};
                  obj.username = item.userName;
                  return obj;
                })
                this.$emit('handleSelectionChange',this.selectOrgUserConversion)
            },   
            deep:true,
            immediate:true,
        }
    },
    data() {
      return {
        loading: false,
        isShowReturnButton:false,
        props: {
          multiple: true,
          checkStrictly: false,
          children: 'children',
          label: 'name',
          value: 'id'
        },
        orgUser: [],
        currentOrgUser: [], //左侧显示的组织和成员
        selectOrgUser: [],  //右侧选择的组织和成员
        selectOrgUserConversion:[],
        level: 0,
        titleList: [],//标题导航栏

        userName:'',
      }
    },
    mounted() {
      this.initDeptUserTree(true);
    },
    methods: {
      initDeptUserTree(isFirst) {
        this.loading = true;
        this.isShowReturnButton = false;
        this.currentOrgUser = [];
        this.orgUser = [];
        if(isFirst){
            this.selectOrgUser = [];
        }
        this.titleList = [];

        this.$Get(this.khConfig.api.listOrgStructure)
          .then(res => {
            if (res.errCode === 0) {
              console.log("--"+JSON.stringify(res))
              this.orgUser = res.list;
              this.currentOrgUser = this.orgUser;
              this.initSelect(this.currentOrgUser);
              this.initCheckSelect();
              let newObj = {};
              newObj.id = 0;
              newObj.name = "组织架构";
            //   newObj.children = this.listOrgStructure(res.list[0].id);
              // this.listOrgStructure(res.list[0].id).then((res)=>{
              //   newObj.children = res;
              //   this.titleList = [];
              //   this.titleList.push(newObj);
              // })
              this.titleList = [];
              this.titleList.push(newObj);
            }
            this.loading = false;
          })
      },
      initSelect(org){
        if (org != null && org.length > 0) {
          org.forEach(item => {
            if (item.isSelected == null) {
              item.isSelected = false;
            }
          })
        }
      },
    
      addOrgUser(item){
        console.log(item.isSelected);
        if (item.isSelected) {
            if( this.selectOrgUser instanceof Array &&  this.selectOrgUser.length >0  && !this.allowMultiSelect){
                // item.isSelected = false;
                // this.$message({
                //     message: '不允许多选',
                //     type: 'warning'
                // });
                this.selectOrgUser = [];
                this.selectOrgUser.push(item)
                this.checkSelect()
                
            }else {
                let newObj = Object.assign({},item)
                if(item.type == 0){
                    newObj.type = 0;
                    this.selectOrgUser.unshift(newObj);
                }else {
                    newObj.type = 1;
                    this.selectOrgUser.push(newObj);
                }
            }

        } else {
          if (this.selectOrgUser != null && this.selectOrgUser.length > 0) {
            for (var i = 0; i < this.selectOrgUser.length; i++) {
              let org = this.selectOrgUser[i];
              if (org.id === item.id) {
                this.selectOrgUser.splice(i, 1);
              }
            }
          }
        }

      },
      deleteOrgUser(item){
          if (this.selectOrgUser != null && this.selectOrgUser.length > 0) {
            for (var i = 0; i < this.selectOrgUser.length; i++) {
              let org = this.selectOrgUser[i];
              if (org.id === item.id) {
                this.selectOrgUser.splice(i, 1);
                this.checkSelect()
              }
            }
          
        }
      },
      //进入下一级通讯录
      exterOrg(item){
        this.currentOrgUser = [];
        // this.currentOrgUser = this.listOrgStructure(item.id);
        this.listOrgStructure(item.id).then((res)=>{
            this.currentOrgUser = res;
            this.initSelect(this.currentOrgUser);
            this.checkSelect();
            let newObj = {};
            newObj.id = item.id;
            newObj.name = item.name;
            newObj.level = item.level;
            newObj.children = res;
            this.titleList.push(newObj);
        })
        
      },
    //返回到某个目录
      backOrg(item){
        this.currentOrgUser = [];
        // this.currentOrgUser = this.listOrgStructure(item.id);
        this.listOrgStructure(item.id).then((res)=>{
            this.currentOrgUser = res;
            this.initSelect(this.currentOrgUser);
            this.checkSelect();
            //删除后续目录连接
            if (this.titleList != null && this.titleList.length > 0) {
            for (var i = 0; i < this.titleList.length; i++) {
                let title = this.titleList[i];
                if (title.id === item.id) {
                this.titleList.splice(i + 1, 100);
                }
            }
            }
        })
      },

      initCheckSelect(){
        // this.selectOrgUser = [];
        // if (this.formPermissions != null && this.formPermissions.length > 0) {
        //   for (var i = 0; i < this.formPermissions.length; i++) {

        //     let obj = this.formPermissions[i];
        //     let newObj = {};
        //     newObj.id = parseInt(obj.id);
        //     newObj.name = obj.name;
        //     newObj.type = obj.type;
        //     this.selectOrgUser.push(newObj);
        //   }
        //   this.checkSelect();
        // }
      },
      //校验是选中状态
      checkSelect(){
              for (var i = 0;i<this.currentOrgUser.length;i++){
                  let obj = this.currentOrgUser[i];
                  obj.isSelected = false;
                  for(var j = 0;j<this.selectOrgUser.length;j++){
                      let selectObj = this.selectOrgUser[j];
                      if (obj.id === selectObj.id){
                        obj.isSelected = true;
                      }
                  }
              }
      },
    
      //查询用户
        async handlequeryUser(){
            let _this = this;
            _this.titleList = [];
            let params = {
                pageNum:1,
                pageSize:10000,
                wd:this.userName
            }
            const { listUser } = _this.khConfig.api;
            let res = await _this.$Get(listUser,params);
            if(res.errCode === 0){
                _this.currentOrgUser = res.list;
                _this.currentOrgUser.map(item=>{
                    item.name = item.realName;
                    item.type = 1;
                    return item;
                })
                _this.initSelect(_this.currentOrgUser);
                _this.checkSelect();
                let newObj = {};
                newObj.id = 0;
                newObj.name = "组织成员";
                newObj.level = 0;
                newObj.children = [];
                _this.titleList = [];
                _this.titleList.push(newObj);
            }
            this.isShowReturnButton = true;
        },

        // 查询组织部门结构和人员
        async listOrgStructure(parentId){
            let _this = this;
            let params = {};
            if(parentId){
                params.orgId = parentId
            }
            const { listOrgStructure } = _this.khConfig.api;
            let res = await _this.$Get(listOrgStructure,params);
            if(res.errCode === 0){
                return res.list.map(item=>{
                    item.realName = item.name;
                    return item
                });
            }
        },

        // 全选当前页面的用户
        checkAll(){
            this.currentOrgUser.forEach((item,index)=>{
                if (!item.isSelected) {
                    if( this.selectOrgUser instanceof Array &&  this.selectOrgUser.length >0  && this.allowMultiSelect == false){
                        item.isSelected = false;
                        this.$message({
                            message: '不允许多选',
                            type: 'warning'
                        });
                    }else {
                        let newObj = Object.assign({},item);
                        if(item.type == 1){
                            newObj.type = 1;
                            this.selectOrgUser.push(newObj);
                        }

                    }

                } else {
                    if (this.selectOrgUser != null && this.selectOrgUser.length > 0) {
                        for (var i = 0; i < this.selectOrgUser.length; i++) {
                        let org = this.selectOrgUser[i];
                        if (org.id === item.id) {
                            this.selectOrgUser.splice(i, 1);
                        }
                        }
                    }
                }
            })
            this.checkSelect();
        },
        //清空当前选中所有用户
        clearAll(){
              this.selectOrgUser = [];
              if (this.currentOrgUser != null && this.currentOrgUser.length > 0) {
                  this.currentOrgUser.forEach(item => {
                      item.isSelected = false;
                  })
              }
              this.checkSelect();
        }
    },
    computed: {
      isOrg(){
        return function (value) {
            // 0:组织架构 1：用户
          if (value.type == 0) {
            return true;
          } else {
            return false;
          }
        }
      },
      isSelectOrg(){
        return function (value) {
          if (value.userId == null) {
            return true;
          } else {
            return false;
          }
        }
      },
      isSelect(){
        return function (value) {
          return value.isSelected == null ? false : value.isSelected;
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  img {
    border: 0;
    vertical-align: middle;
    max-width: 100%;
  }

  body {
    font-size: 12px;
    font-family: 'PingFang SC', 'Hiragino Sans GB', 'PingHei', 'Open Sans', 'sans-serif', 'Helvetica Neue', 'Helvetica', 'Microsoft YaHei', 'SimSun', 'Arial';
    color: #666666;
  }

  html, body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, input, textarea, p, table, tr, th, td, span, strong, em {
    padding: 0;
    margin: 0;
    font-style: normal;
    font-size: 12px;
  }

  input {
    border: 0;
    padding: 0px;
    font-size: 12px;
    background: none;
    font-family: "PingFang SC", "Hiragino Sans GB", "PingHei", "Open Sans", "sans-serif", "Helvetica Neue", "Helvetica", "Microsoft YaHei", "SimSun", "Arial";
  }

  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    background-color: #fff;
    -webkit-box-shadow: 0 0 0 1000px white inset;
  }

  button, button:focus, button:active, button:link {
    -webkit-appearance: none;
    outline: none;
  }

  ol, ul, li {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: normal;
    font-size: 100%;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  a {
    text-decoration: none;
    outline: none;
    cursor: pointer;
    color: #333;
  }

  a:link, a:visited {
    text-decoration: none;
  }

  a:hover {
    text-decoration: none;
  }

  a:active {
    text-decoration: none;
  }

  .clearboth {
    clear: both;
  }

  .dib {
    display: inline-block;
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  .ml5 {
    margin-left: 5px;
  }

  .ml10 {
    margin-left: 10px;
  }

  /*   .mt20{margin-top:13px;}*/
  .mt50 {
    margin-top: 20px;
  }

  .mt10 {
    margin-top: 10px;
  }

  .ml20 {
    margin-left: 10px;
  }

  .div-h, .ty-p {
    line-height: 1.5;
  }

  .color9 {
    color: #999;
  }

  .color-blue {
    color: #00a0e8;
  }

  .p16 {
    padding: 16px;
  }

  .p24 {
    padding: 24px;
  }

  .bgf7 {
    padding: 10px;
    background: #f7f7f7;
  }

  .bg999 {
    padding: 10px;
    background: #999;
  }

  .ty-relative {
    position: relative;
  }

  .fs14 {
    font-size: 14px;
  }

  .fw {
    font-weight: 600;
  }

  .tyue-checkbox {
    vertical-align: middle;
    display: inline-block;
    position: relative;
    white-space: nowrap;
  }

  .tyue-checkbox-txt {
    margin-left: 6px;
    margin-right: 8px;
    font-size: 13px;
  }

  .tyue-checkbox-txt.active {
    color: #00A0E8;
  }

  /*过滤*/
  .ty-transfer-list {
    /* width: 380px; */
    width: 45%;
    height: 550px;
    border: 1px solid #e8e8e8;
    border-radius: 3px;
    background: #fff;
    box-shadow: 0 0 5px #e8e8e8
  }

  .ty-transfer-list-head {
   /* height: 32px;*/
  /*  line-height: 32px;*/
    /* height: 40px;*/
    line-height: 40px; 
    display: flex;
    font-size: 15px;
    color: #666;
    background-color: #f5f7fc;
    width: 100%;
    overflow-y: auto;
  }

  .ty-transfer-list-serach {
    width: auto;
    padding: 0 15px 8px;
    position: relative;
  }

  .ty-transfer-list-serach input {
    display: block;
    width: 100%;
    height: 28px;
    line-height: 28px;
    padding-left: 30px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .ty-transfer-list-serach input {
    transition: all .3s linear;
    -webkit-transition: all .3s linear;
    -o-transition: all .3s linear;
    -moz-transition: all .3s linear;
  }

  .ty-transfer-list-serach > input:focus,
  .ty-transfer-list-serach > input:hover {
    border-color: #57c5f7;
    border: 1px solid #57c5f7;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(45, 183, 245, .2);
  }

  .ty-tree-select {
    margin-top: 10px;
  }

  .ty-transfer-list-serach-icon {
    width: 17px;
    height: 17px;
    display: block;
    position: absolute;
    top: 4px;
    left: 22px;
    z-index: 10;
  }

  .ty-transfer-list-body {
    border-top: 1px solid #e8e8e8;
    padding: 4px 15px 4px 10px;
    flex: 1;
    overflow-y: auto;
    box-sizing: border-box;

    /*滚动条里面小方块*/
        &::-webkit-scrollbar-thumb {
            background-color: #EBEAEF;
            border-radius: 10px;
        }
        /*滚动条整体样式*/
        &::-webkit-scrollbar {
            // width: 6px;
            // height: 6px;
        }
        /*滚动条里面轨道*/
        &::-webkit-scrollbar-track {
            background: #FFFFFF;
            border-radius: 10px;
        }
    
  }

  .ty-transfer .ty-tree-arrow-right span, .ty-transfer .ty-tree-arrow-bottom span {
    margin-left: 0;
  }

  .ty-transfer .ty-tree-select-ul {
    padding-left: 38px;
  }

  .ty-transfer .ty-tree-div .tyc-check-blue {
    margin: 8px 6px;
  }

  .ty-transfer .ty-tree-div {
    height: 30px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ty-transfer .ty-tree-text {
    height: 30px;
    line-height: 30px;
    line-height: 30px;
    cursor: pointer;
  }

  .ty-transfer .ty-tree-switcher {
    height: 28px;
  }

  .ty-transfer-list-foot {
    background: #f1f1f1;
  }

  .ty-transfer-list-serach + .ty-transfer-list-body {
    height: 230px;
  }

  .ty-transfer-operation {
    padding: 107px 5px 0 5px;
  }

  .ty-transfer-operation span {
    display: block;
    width: 34px;
    height: 34px;
    text-align: center;
    position: relative;
    cursor: pointer;
    border: 1px solid #d9d9d9;
    border-radius: 50%;
    /* background-image: url("../assets/images/icon-little.png"); */
    background-repeat: no-repeat;
    background-color: #f3f3f3;
    transition: background-color 0.3s linear;
    -moz-transition: background-color 0.3s linear;
    -webkit-transition: background-color 0.3s linear;
    -o-transition: background-color 0.3s linear;

  }

  .ty-transfer-operation span i {
    font-size: 2em;
    color: #bbb;
  }

  .ty-transfer-operation span + span {
    margin-top: 25px;
  }

  .ty-transfer-operation span:hover {
    border: 1px solid #3dadf2;
    background-color: #7AC7F8;
  }

  .ty-transfer-operation span:hover i {
    color: #fff;
  }

  .ty-transfer-btn-toright, .ty-transfer-btn-toright.disabled:hover {
    background-position: 8px 2px;
  }

  .ty-transfer-btn-toright:hover, .ty-transfer-btn-toright.active, .ty-transfer-btn-toright.active:hover {
    background-position: 8px -23px;
  }

  .ty-transfer-btn-toleft, .ty-transfer-btn-toleft.disabled:hover {
    background-position: 6px -54px;
  }

  .ty-transfer-btn-toleft:hover, .ty-transfer-btn-toleft.active, .ty-transfer-btn-toleft.active:hover {
    background-position: 6px -79px;
  }

  .ty-transfer-operation span.active {
    border: 1px solid #3dadf2;
    background-color: #00A0E8;
  }

  .ty-transfer-operation span.active i {
    color: #fff;
  }

  .ty-transfer-btn-toleft.disabled:hover, .ty-transfer-btn-toright.disabled:hover {
    cursor: not-allowed;
    border: 1px solid #d9d9d9;;
    background-color: #f3f3f3;
  }

  .ty-transfer-operation .active:hover {
    background-color: #7AC7F8;
  }

  .ty-transfer-btn-totop, .ty-transfer-btn-totop.disabled:hover {
    background-position: 8px 2px;
    transform: rotate(-90deg);
  }

  .ty-transfer-btn-tobottom, .ty-transfer-btn-tobottom.disabled:hover {
    background-position: 8px 2px;
    transform: rotate(90deg);
  }

  .ty-transfer-btn-totop.disabled:hover, .ty-transfer-btn-tobottom.disabled:hover {
    cursor: not-allowed;
    border: 1px solid #d9d9d9;
    background-color: #f3f3f3;
  }

  .ty-transfer-btn-totop:hover, .ty-transfer-btn-totop.active, .ty-transfer-btn-totop.active:hover,
  .ty-transfer-btn-tobottom:hover, .ty-transfer-btn-tobottom.active, .ty-transfer-btn-tobottom.active:hover {
    background-position: 8px -23px;
  }

  .transfer-all-check {
    vertical-align: middle;
  }

  .show .ty-tabs {
    width: 460px;
  }

  .ty-tabs-nav {
    height: 38px;
    border-bottom: 2px solid #d9d9d9;
    position: relative;
  }

  .ty-tabs-nav > div {
    height: 40px;
    overflow: hidden;
    position: relative;
  }

  .ty-tabs-nav-scroll > div {
    width: auto;
    margin: 0 40px;
  }

  .ty-tabs-ul {
    width: 100%;
    height: 38px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  .tabs-nav-scroll-ul {
    width: 1300px;
  }

  .ty-tabs-ul li {
    float: left;
    padding: 0 15px;
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    color: #666;
    cursor: pointer;
  }

  .ty-tabs-ul li.current {
    color: #00a0e8;
  }

  .ty-tabs-icon-prev, .ty-tabs-icon-next {
    width: 38px;
    height: 38px;
    display: block;
    border-bottom: 2px solid #d9d9d9;
    cursor: pointer;
    position: absolute;
    top: 0;
    z-index: 100;
  }

  .ty-tabs-icon-prev {
    background-position: 15px -368px;
    left: 0;
  }

  .ty-tabs-icon-prev:hover {
    background-position: 15px -396px;
  }

  .ty-tabs-icon-next {
    background-position: 15px -424px;
    right: 0;
  }

  .ty-tabs-icon-next:hover {
    background-position: 15px -454px;
  }

  .ty-tabs-line {
    width: 86px;
    height: 2px;
    background: #00a0e8;
    position: absolute;
    bottom: -2px;
    left: 0;
    z-index: 101;
  }

  .ty-tabs-nav-scroll .ty-tabs-line {
    left: 40px;
  }

  .show .ty-tabs-card {
    width: 460px;
  }

  .ty-tabs-card-nav {
    height: 32px;
    position: relative;
  }

  .ty-tabs-card-nav > div {
    height: 32px;
    position: relative;
  }

  .ty-tabs-card-nav-scroll > div {
    width: auto;
    margin: 0 40px;
  }

  .ty-tabs-card-ul {
    width: 100%;
    height: 32px;
    position: absolute;
    top: 1px;
    left: 0;
    z-index: 10;
  }

  .ty-tabs-card-ul li {
    float: left;
    min-width: 48px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    padding: 0 15px;
    font-size: 12px;
    color: #666;
    border: 1px solid #f1f1f1;
    border-bottom: 0;
    background: #f1f1f1;
    border-radius: 4px 4px 0 0;
    cursor: pointer;
  }

  .ty-tabs-card-ul li + li {
    margin-left: 8px;
  }

  .ty-tabs-card-ul li.current {
    color: #00a0e8;
    border: 1px solid #d9d9d9;
    border-bottom: 1px solid #fff;
    background: #fff;
  }

  .ty-tabs-card-con {
    border: 1px solid #d9d9d9;
  }

  .tabbox {
    width: 100%;
    height: 140px;
    margin: auto;
  }

  .tabbox .content {
    overflow: hidden;
    width: auto;
    height: auto;
    position: relative;
  }

  .tabbox .content ul {
    position: relative;
    left: 0;
    top: 0;
    height: auto;
  }

  .tabbox .content li {
    width: 1500px;
    height: auto;
    float: left;
    padding: 50px;
  }

  .tabbox .content li p {
    padding: 10px;
  }

  /*.ty-tabs-card-con{height:100px;padding-top:80px;}*/
  .ty-tabs-card-con > .mt20 {
    text-align: center;
  }

  .ty-tabs-card .ty-tabs-icon-prev, .ty-tabs-card .ty-tabs-icon-next {
    width: 32px;
    height: 32px;
    display: block;
    border-bottom: 0;
    cursor: pointer;
    position: absolute;
    top: 0;
    z-index: 100;
  }

  .ty-tabs-card .ty-tabs-icon-prev {
    background-position: 15px -371px;
    left: 0;
  }

  .ty-tabs-card .ty-tabs-icon-prev:hover {
    background-position: 15px -399px;
  }

  .ty-tabs-card .ty-tabs-icon-next {
    background-position: 15px -427px;
    right: 0;
  }

  .ty-tabs-card .ty-tabs-icon-next:hover {
    background-position: 15px -457px;
  }

  .ty-breadcrumb {
    height: 24px;
  }

  .ty-breadcrumb li {
    float: left;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
    color: #999;
  }

  .ty-breadcrumb span {
    padding: 0 10px;
    color: #ccc;
    font-size: 14px;
  }

  .ty-breadcrumb a {
    color: #666;
    font-size: 14px;
  }

  .ty-breadcrumb a:hover {
    text-decoration: none;
    color: #00a0e8;
  }

  .ty-breadcrumb a:hover {
    font-weight: bold;
  }

  .ty-breadcrumb a.current:hover {
    color: #666;
    font-weight: bold;
    cursor: default;
  }

  .ty-breadcrumb a.current {
    font-weight: bold;
  }

  .four-icon.ty-transfer-operation {
    padding-top: 30px;
  }

  .ty-transfer-operation .ty-transfer-btn-zhiding,
  .ty-transfer-operation .ty-transfer-btn-zhidi {
    /* background-image: url(../assets/images/zhiding-zhidi.png); */
    background-size: 27px 108px;
    background-repeat: no-repeat;
  }

  .ty-transfer-operation .ty-transfer-btn-zhiding:hover,
  .ty-transfer-operation .ty-transfer-btn-zhiding.active,
  .ty-transfer-operation .ty-transfer-btn-zhiding.active:hover {
    background-position: 4px -50px;
  }

  .ty-transfer-operation .ty-transfer-btn-zhidi:hover,
  .ty-transfer-operation .ty-transfer-btn-zhidi.active,
  .ty-transfer-operation .ty-transfer-btn-zhidi.active:hover {
    background-position: 4px -78px;
  }

  .ty-transfer-operation .ty-transfer-btn-zhiding.normal {
    background-position: 4px 4px;
  }

  .ty-transfer-operation .ty-transfer-btn-zhidi.normal {
    background-position: 4px -25px;
  }

  .ty-transfer-operation .ty-transfer-btn-zhiding.normal.active,
  .ty-transfer-operation .ty-transfer-btn-zhiding.normal:hover {
    background-position: 4px -50px;
  }

  .ty-transfer-operation .ty-transfer-btn-zhidi.normal.active,
  .ty-transfer-operation .ty-transfer-btn-zhidi.normal:hover {
    background-position: 4px -78px;
  }

  .ty-transfer-operation .ty-transfer-btn-zhiding.normal.disabled,
  .ty-transfer-operation .ty-transfer-btn-zhidi.normal.disabled {
    cursor: not-allowed;
    border: 1px solid #d9d9d9;
    background-color: #f3f3f3;
  }

  @font-face {
    font-family: 'iconfont';
    src: url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.eot');
    src: url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.woff2') format('woff2'),
    url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.woff') format('woff'),
    url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.svg#iconfont') format('svg');
  }

  .el-upload {
    float: left;
    padding-right: 10px;
  }

  a.custom-a-jump {
    color: #606266;
    text-decoration: none
  }

  a.custom-a-jump:hover {
    color: #409EFF;
  }
  .avatarUser{
    background:#409EFF ;
    display: inline-block;
    vertical-align: bottom;
    font-size: 5px;
    // margin-left: 5px;
  }
  .transfer-left {
    text-align: left;
    display: flex;
    flex-direction: column;
  }
  .transfer-center {
    display: inline-block;
    margin: 0 auto;
    width: 100%;

    
  }
  .div-center {
    text-align: center;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  .search-header{
      display:flex; 
      justify-content: center;
      align-items: center;
      padding:10px 0 20px 0;

      .el-input-group{
          width:calc(90% + 50px) !important;
      }

  }
  .selectContainer{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

</style>
