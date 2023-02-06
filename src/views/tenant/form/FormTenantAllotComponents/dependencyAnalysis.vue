<template>
  <div>
     <!-- 步骤一内容 -->
        <div style="width:calc(80% + 100px);margin:0 auto;height:500px;" v-loading="formDependTableLoading">
          <div style="font-size:18px;font-weight:600;margin:0 0 15px 0;">表单名称/依赖表单名称</div>
          <el-collapse v-model="activeNames" >
            <template v-for="item in formDependData" >
              <el-collapse-item :title="item.name" :name="item.id" :key="item.id">
                <div>
                  <div v-for="item2 in item.children" :key="item2.id" style="background:#f1f1f1;line-height:40px;" ><span style="color:red;padding-left:50px;">依赖表单：</span>{{item2.name}}</div>
                  <div v-for="item3 in item.children2" :key="item3.id" style="background:#f1f1f1;line-height:40px;"><span style="color:red;padding-left:50px;">依赖表：</span>{{item3.name}}</div>
                </div>
              </el-collapse-item>
            </template>
          </el-collapse>
        </div>
  </div>
</template>
<script>
export default ({
  name: 'dependencyAnalysis',
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
        // formDependData: [{
        //   id: 1,
        //   name: '测试表单1',
        // }, {
        //   id: 4,
        //   name: '测试表单2',
        //   children: [{
        //       id: 41,
        //       name: '依赖表单1',
        //     }, {
        //       id: 42,
        //       name: '依赖表单2',
        //   }, {
        //       id: 43,
        //       name: '依赖表单2',
        //   }]
        // }],
        formDependData: [],
        indents:150,
        formDependTableLoading:true,
        activeNames:[],
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
    this.listFormDependData();
  },
  methods: {
    // 获取表单依赖信息
    listFormDependData(){
      let _this = this;
      let params = {
        formIds : _this.formIds
      };
      _this.$Get(_this.khConfig.api.analyzeFormDepends,params).then(res=>{
        if(res.errCode === 0){
          let obj={};
          for(let key in res.originalFormMap){
            //向obj注入id和name属性
            obj = {
              id : key,
              name : res.originalFormMap[key],
              children : [],
              children2 : [],
            };
            // 接口返回的dependsFormMap（依赖表单）属性进行拼接处理
            for(let key2 in res.dependsFormMap){
              //向obj2注入id和name属性
              let obj2 = {
                id : key2,
                name : res.dependsFormMap[key2],
              };
              obj.children.push(obj2);
            }
            //接口返回的dependTables（依赖表）属性进行拼接处理
            if(res.hasOwnProperty('dependTables')){
                res.dependTables.forEach((item)=>{
                let obj3 = {
                  id:Math.round(Math.random()*10000),     
                  name:item,
                }
                obj.children2.push(obj3);
              })
            }
            //将规范格式的obj对象push到formDependData中
            _this.formDependData.push(obj)
          }
          _this.setActiveNames();
          _this.formDependTableLoading = false;
        }
      })
    },
    //遍历formDependData，将id放入activeNames中，实现全部默认展开
    setActiveNames(){
      let _this = this;
      _this.formDependData.forEach((item)=>{
        _this.activeNames.push(item.id);
      })
    }
  }
})
</script>
<style lang="scss" scoped>
 ::v-deep .el-collapse-item__content{
    background:#f1f1f1;
    padding:0px;
  }
 ::v-deep .el-collapse-item__arrow{
    display: none;
  }
  
</style>

