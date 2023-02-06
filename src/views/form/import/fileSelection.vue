<template>
  <div style="height:500px;width:100%;display:flex;justify-content:center;">
    <FormImportUpload
        :value="formIds"
        @change="changeFile"
        :fileList.sync="fileList"
        :showCustomFileList="true"
        :limit="1"
        :fileTypes="['dump']"
        :accept="`.dump`"
        @importFilesChange = "importFilesChange"
    >
      <template #tip>支持扩展名：.dump</template>
    </FormImportUpload>
        
  </div>
</template>
<script>
import FormImportUpload from "@/components/common//FormImportUpload";
export default ({
  name: 'fileSelection',
  components:{FormImportUpload},
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
        // formIds:[],
        fileList:[],
    }
  },
  computed: {},
  watch: {

  },
  created () {

  },
  mounted () {
  },
  methods: {
    importFilesChange(files){
      // this.$emit('importFilesChange',files);
      this.$emit('update:importFiles',files);
    },
    // 组件内fileIds改变触发
    changeFile(fileIds,symbol){
      this.formIds = fileIds
      this.$emit('updata:formIds',this.formIds)
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep .el-transfer{
  // height: 100%;
  // width:60%;
  .el-transfer-panel{
    height: 100%;
    width:calc(50% - 33px);
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

