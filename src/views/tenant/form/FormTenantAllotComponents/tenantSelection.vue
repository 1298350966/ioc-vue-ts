<template>
  <div style="height:500px;width:100%;display:flex;justify-content:center;">
    <template v-if="!isSync">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span style="font-size:18px;font-weight:600;">已分配租户</span>
            <span style="margin:0 15px 0 auto; color:gray;font-size:12px;" >{{ allotTenantsData.length }}</span>
          </div>
          <div v-for="item in allotTenantsData" :key="item.id" class="itemClass">
            <!-- {{ item.id + '-'  + item.tenantName }} -->
            {{  item.tenantName }}
          </div>
        </el-card>
        <el-transfer
          style="text-align: left; display: inline-block;height: 100%;width:60%;"
          v-model="chekcdTenantsData"
          filterable
          :render-content="renderFunc"
          :titles="['选择租户', '已选择租户']"
          :props="{
            key: 'id',
            label: 'tenantName'
          }"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :data="newUnAllotTenantList">
        </el-transfer>
    </template>
    <template v-if="isSync">
        <el-transfer
          style="text-align: left; display: inline-block; height: 100%;width:calc(80% + 100px);display:flex;justify-content:center;"
          v-model="chekcdTenantsData"
          filterable
          :render-content="renderFunc"
          :titles="['待选择租户', '已选择租户']"
          :props="{
            key: 'id',
            label: 'tenantName'
          }"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :data="newAllotTenantsData">
        </el-transfer>
    </template>

  </div>
</template>
<script>
export default ({
  name: 'tenantSelection',
  props: {
    currentStep:{
      type:Number,
      required:true,
    },
    formIds:{
      type:Number,
      required:true,
    },
    isSync:{
      type:Boolean,
      required:true,
    },
  },
  data () {
    return {
        renderFunc(h, option) {
          // return <span>{ option.key } - { option.label }</span>;
          return <span>{ option.label }</span>;
        },
        //当前是否为同步配置对话框
        // isSync:true,
        // 已选中的租户
        chekcdTenantsData:[],
        //已分配表单的租户列表
        allotTenantsData:[],
        //经过处理的用于穿梭框展示的已分配表单租户列表
        newAllotTenantsData:[],
        // 所有租户列表
        allTenantsList:[],
        //未分配租户列表
        unAllotTenantList:[],
        //经过处理的用于穿梭框展示的未分配表单租户列表
        newUnAllotTenantList:[],

    }
  },
  computed: {},
  watch: {
    chekcdTenantsData:{
      handler(val,oldVal){
        this.$emit("chekcdTenantsData",val);
        //把全部租户列表也提交给父组件，再由父组件提交给步骤三，用于将同步结果的租户id匹配租户名称，进行显示
        if(this.isSync){
          this.$emit("allTenantsList",this.allotTenantsData);
        }else{
          this.$emit("allTenantsList",this.unAllotTenantList);
        }
      },
      deep:true
    }
  },
  created () {

  },
  mounted () {
    this.listAllotTenants();
  },
  methods: {
    // --------------------------------表单同步配置相关函数--------------------------------
    //获取已分配的表单租户列表
    listAllotTenants(){
      let _this = this;
      let url = _this.khConfig.api.queryAllotTenants+"/"+_this.formIds;
      _this.$Post(url).then(res=>{
        if(res.errCode === 0){
          _this.allotTenantsData = res.tenantList;
          _this.allotTenantsDataDeal();
          if(!_this.isSync){
            _this.listTenants();
          }
        }
      })
    },
    // 处理allotTenantsData数据格式，用于穿梭框展示
    allotTenantsDataDeal(){
      let _this = this;
      _this.newAllotTenantsData = _this.allotTenantsData.map((item)=>{
        const obj = { 
          ...item, 
          key:parseInt(item.id),
          label:item.tenantName,
          disabled:item.status === 0?true:false,
        };
        return obj;
      })
    },
    // 获取所有租户列表
    listTenants(){
      let _this = this;
      //需要一次性拿到所有租户列表数据,所以pageSize设为10000
      let params ={
        pageNum: 1,
        pageSize: 10000
      }
      _this.$Get(_this.khConfig.api.listTenant,params).then(res=>{
        if(res.errCode === 0){
          _this.allTenantsList = res.datas;
          _this.getUnAllotTenantsList(res.datas);
        }
      })
    },

    // ------------------------------------------表单分配相关处理函数-------------------------------------------
    // 数据过滤:获取未分配(可以分配)的租户列表
    getUnAllotTenantsList(allTenants){
      let _this = this;
      _this.unAllotTenantList = allTenants.filter((item)=>{
        let flag = false;
        _this.allotTenantsData.forEach(element => {
          if(element.id === item.id){
            flag = true;
          }
        });
        return flag === false;
      })
      _this.unAllotTenantListDeal();
    },
    // 处理unAllotTenantList数据格式，用于穿梭框展示
    unAllotTenantListDeal(){
      let _this = this;
      _this.newUnAllotTenantList = _this.unAllotTenantList.map((item)=>{
        const obj = { 
          ...item, 
          key:parseInt(item.id),
          label:item.tenantName,
          disabled:item.status === 0?true:false,
        };
        return obj;
      })
    },
  }
})
</script>
<style lang="scss" scoped>
::v-deep .el-transfer{
  // height: 100%;
  // width:60%;
  .el-transfer-panel{
    height: 100%;
    width:calc(50% - 66px);
    border: 1px solid #ddd;
    .el-transfer-panel__header{
      .el-checkbox{
        .el-checkbox__label{
          font-size:18px;
          font-weight: 600;
        }
      }
    }  
    .el-transfer-panel__body{
      height: calc(100% - 55px);
      .el-transfer-panel__list.is-filterable{
        height: calc(100% - 45px);
      }
    }
  }
  .el-transfer__buttons{
    margin:auto 0;
    padding:0 15px;
  }
}

.box-card {
    width: 25%;
    background: #efefef;
    margin: 0 50px 0 0;
    border-radius: 4px;
    vertical-align:middle;
  }
  .clearfix{
    height: 40px;
    line-height: 40px;
    background:#F5F7FA;
    padding-left: 25px;
    font-size: 16px;
    display: flex;

  }
  .itemClass{
    width:100%;
    padding-left: 24px;
    line-height: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
 ::v-deep .el-card__header{
    padding: 0;
  }
 ::v-deep .el-card__body{
    max-height: calc(100% - 40px);
    overflow: auto;
    padding:10px 0;
  }
  
</style>

