<template>
 <div>
   <el-row>
     <el-row>
       <el-col :span="4">
         数据集字段
       </el-col>
       <el-col :span="4" :offset="1">
         关联方式
       </el-col>
       <el-col :span="5" :offset="1">
         关联表名
       </el-col>
       <el-col :span="4" :offset="1">
         关联字段
       </el-col>
       <el-col :span="2" :offset="1">
         操作
       </el-col>
     </el-row>
     <el-row style="margin-top: 10px" v-for="(item,index) in join.condition" :key="index">
       <el-col :span="4">
         <el-select>

         </el-select>
       </el-col>
       <el-col :span="4" :offset="1" >
         <el-select :class="{ 'hidden': index !=0 }" placeholder="" v-model="join.jointype" >
           <el-option v-for="(item,key) in jointypeOptions" :key="key" :label="item.label"
                      :value="item.value"></el-option>
         </el-select>
       </el-col>
       <el-col :span="5" :offset="1">
         <el-select :class="{ 'hidden': index !=0 }" v-model="join.dest">
           <el-option v-for="(item,key) in jointypeOptions" :key="key" :label="item.label"
                      :value="item.value"></el-option>
         </el-select>
       </el-col>
       <el-col :span="4" :offset="1">
         <el-select>

         </el-select>
       </el-col>
       <el-col :span="2" :offset="1">
         <el-button type="danger" icon="el-icon-delete" circle @click="deleteAssociation(index)"></el-button>
       </el-col>
     </el-row>

     <el-row style="margin-top: 10px">
       <el-col :span="6">
         <el-button type="primary" style="width: 600px" @click="addAssociation">添加关联条件</el-button>
       </el-col>
     </el-row>

   </el-row>
   <div slot="footer" class="dialog-footer">
     <el-button @click="dialogFormVisible = false">取 消</el-button>
     <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
   </div>
 </div>
</template>

<script>
  export default {
    components: {
    },
    data() {
      return {
        join: {
          source: '',
          jointype: '',
          dest: '',
          condition: [
            {
              sc: '',
              dc: ''
            }
          ]
        },
        jointypeOptions: [
          {
            value: 1,
            label: '左关联'
          }, {
            value: 0,
            label: '内关联'
          }
        ]
      };
    },

    methods: {
      addAssociation() {
        this.join.condition.push(
          {
            sc: '',
            dc: ''
          }
        );
      },
      deleteAssociation(index) {
        this.join.condition.splice(index, 1);
      }
    },
    computed:{
      hiddenObject: function (index) {
        return {
          'data-set-item-one':index != 0
        }
      }
    }
  };
</script>

<style scoped>
  .hidden{
    visibility: hidden;
  }
</style>
