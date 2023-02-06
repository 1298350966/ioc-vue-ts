<template>
  <div>
        <div class="stepContainer">
          <div>
            <span class="stepTooltip">导入文件表单依赖分析结果如下，导入成功后导入表单将覆盖原表单！</span>
          </div>
          <div class="stepTitle">表单名称/依赖名称</div>
          <div class="stepContent" v-loading="formDependTableLoading">
            <el-collapse>
              <template v-for="item in formDependData" >
                <el-collapse-item :title="item.name" :name="item.id" :key="item.id">
                  <!-- <div>
                    <div v-for="item2 in item.children" :key="item2.id" class="dependItem"> ><span class="dependItemProp">依赖表单：</span>{{item2.name}}</div>
                    <div v-for="item3 in item.children2" :key="item3.id" class="dependItem">><span class="dependItemProp">依赖表：</span>{{item3.name}}</div>
                    <div v-for="item4 in item.children3" :key="item4.id" class="dependItem">><span class="dependItemProp">依赖数据字典：</span>{{item4.name}}</div>
                  </div> -->
                </el-collapse-item>
              </template>
            </el-collapse>
            <div style="overflow:hidden;">
              <div v-for="item2 in dependsFormMap" :key="item2.id" class="dependItem"><span class="dependItemProp">依赖表单：</span>{{item2.name}}</div>
              <div v-for="item3 in dependTables" :key="item3.id" class="dependItem"><span class="dependItemProp">依赖表：</span>{{item3.name}}</div>
              <div v-for="item4 in dependDataDicts" :key="item4.id" class="dependItem"><span class="dependItemProp">依赖数据字典：</span>{{item4.name}}</div>
            </div>
          </div>
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
      type:Array,
      required:true,
    },
    importFiles:{
      required:true,
    }
  },
  data () {
    return {
        formDependData: [], //源表单
        dependsFormMap:[],  //依赖表单
        dependTables:[],  //依赖表
        dependDataDicts:[], //依赖数据字典
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
    async listFormDependData(){
      let _this = this;
      const formData = new FormData();
      formData.append("dmpfile", _this.importFiles);
      const res = await this.$Post(_this.khConfig.api.importAnalyze, formData)
      if(res.errCode === 0){
          for(let key in res.originalFormMap){
            //向obj注入id和name属性
            let obj = {
              id : key,
              name : res.originalFormMap[key],
            };
            //将规范格式的obj对象push到formDependData中
            _this.formDependData.push(obj)
          }
          // 接口返回的dependsFormMap（依赖表单）属性进行拼接处理
          for(let key in res.dependsFormMap){
            //向obj2注入id和name属性
            let obj = {
              id : key,
              name : res.dependsFormMap[key],
            };
            _this.dependsFormMap.push(obj);
          }
          //接口返回的dependTables（依赖表）属性进行拼接处理
          if(res.hasOwnProperty('dependTables')){
              res.dependTables.forEach((item)=>{
              let obj = {
                id:Math.round(Math.random()*10000),     
                name:item,
              }
              _this.dependTables.push(obj);
            })
          }
          //接口返回的数据字典属性进行拼接处理
          if(res.hasOwnProperty('dependDataDicts')){
            if(res.dependDataDicts){
              res.dependDataDicts.forEach((item)=>{
                let obj = {
                  id:Math.round(Math.random()*10000),
                  name:item,
                }
                _this.dependDataDicts.push(obj);
              })
            }else{
              _this.dependDataDicts = []
            }
          }
        // _this.setActiveNames();
        _this.$emit('formDependDataChange',_this.formDependData)
        _this.formDependTableLoading = false;
      }
    },
    //遍历formDependData，将id放入activeNames中，实现全部默认展开
    // setActiveNames(){
    //   let _this = this;
    //   _this.formDependData.forEach((item)=>{
    //     _this.activeNames.push(item.id);
    //   })
    // }
  }
})
</script>
<style lang="scss" scoped>
  ::v-deep .el-collapse-item__header{
    height: 40px;
  }
  ::v-deep .el-collapse-item__content{
    background:#f1f1f1;
    padding:0px;
  }
  ::v-deep .el-collapse-item__arrow{
    display: none;
  }


  .stepContainer{
    width:calc(80% + 100px);
    margin:0 auto;
    height:500px;

    .stepTooltip{
      color:red;
      line-height:40px;
    }
    .stepTitle{
      font-size:18px;
      font-weight:600;
      margin:0 0 15px 0;
    }
    .stepContent{
      height:440px;
      overflow:auto;
    }

  }
  .dependItem{
    // background:#f1f1f1;
    background:#f4f7fa;
    line-height:35px;
    position: relative;
    font-size: 13px;

    &::before{
      content: '';
      width: 40px;
      border-bottom: 1px black dotted;
      height: 1000px;
      border-left: 1px black solid;
      position: absolute;
      bottom: 18px;
      left:30px;
    }

    .dependItemProp{
      color:red;
      padding-left:80px;

    }
  }
  
</style>

