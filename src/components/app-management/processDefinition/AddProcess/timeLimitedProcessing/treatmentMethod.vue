<template>
  <div class="treatmentMethod">
    <div class="tabs">
      <div
        class="tab"
        :class="{ tabSelect: setting.type === item.type }"
        @click="typeChange(item)"
        v-for="(item, index) in typeTabList" :key="index"
      >
        <i :class="[item.icon]"></i>
        <span>{{item.name}}</span>
      </div>
    </div>
    <div v-if="setting.type === '1'">
        <automaticeRminder :setting="setting"></automaticeRminder>
    </div>
    <div v-if="setting.type === '2'">
        <automaticTransfer :setting="setting"></automaticTransfer>
    </div>

  </div>
</template>

<script>


import automaticeRminder from '@/components/app-management/processDefinition/AddProcess/timeLimitedProcessing/treatmentMethod/automaticeRminder'
import automaticTransfer from '@/components/app-management/processDefinition/AddProcess/timeLimitedProcessing/treatmentMethod/automaticTransfer'
export default {
  components: {automaticeRminder,automaticTransfer },
  props: ["setting"],
  data() {
    return {
      checkList: [],
      textarea: "",
      input: "",
      value: "",
      typeTabList:[
        { icon: "el-icon-message-solid", name: "自动提醒", type:"1"},
        { icon: "iocn-zidongtijiao", name: "自动转交", type:"2"},
      ],
    };
  },
  watch: {
    // 'setting.type'(newVl,oldVl){
    //   if(newVl !== oldVl){
          
    //       console.log(setting)
    //   }
    // }
  },
  mounted(){
      this.initSetting()
  },
  methods:{
    initSetting(){
        if(!this.setting.type){
            this.$set(this.setting,'type',"1")
        }
        if(!this.setting.time){
            this.$set(this.setting,'time','')
        }
        if(!this.setting.unit){
            this.$set(this.setting,'unit','')
        }
        if(!this.setting.type){
            this.$set(this.setting,'type','')
        }
        if(this.setting.type === '1'){
          if(!this.setting.remind){
              this.$set(this.setting,'remind',{})
          }
        }else if(this.setting.type === '2'){
          if(!this.setting.transfer){
              this.$set(this.setting,'transfer',{})
          }
        }
        if(!this.setting.remindType){
            this.$set(this.setting,'remindType',[])
        }

        if(!this.setting.title){
            this.$set(this.setting,'title','')
        }
        if(!this.setting.content){
            this.$set(this.setting,'content','')
        }
        
    },
    typeChange(item){
      this.setting.type = item.type
      let setting
          if(item.type === '1'){
              setting =  {
              idx: "",
              type: "1",
              time: "",
              unit: "",
              remind: {
                leader: "",
                dealingLeader: "",
                dealingOrgAndRole: [],
                role: [],
                orgAndRole: [],
                person: [],
                dyncUserAndRole: [],
                dyncOrgAndRole: [],
                cuserOrgAndRole: [],
                model: "",
                type: "0",
                conditions: [],
              },
              remindType: [],
              title: "",
              content: "",
            }
          }else{
            setting =  {
              idx: "",
              type: "2",
              time: "",
              unit: "",
              transfer: {
                leader: "",
                dealingLeader: "",
                dealingOrgAndRole: [],
                role: [],
                orgAndRole: [],
                person: [],
                dyncUserAndRole: [],
                dyncOrgAndRole: [],
                cuserOrgAndRole: [],
                model: "",
                type: "0",
                conditions: [],
              },
              remindType: [],
              title: "",
              content: "",
            }
          }
          this.$emit('update:setting',setting)
      }
  },
  

};
</script>

<style lang="scss" scope>
.treatmentMethod {
  .tabs {
    position: relative;
    display: flex;
    padding-bottom: 10px;
    .tab {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 12px 20px;
      border-radius: 5px;
      color: #ff913f;
      border: 1px solid #d7d7d7;
      margin-right: 10px;
      box-sizing: border-box;
      i {
        font-size: 28px;
        margin-right: 3px;
      }
      &:nth-child(1) {
        color: #ff913f;
      }
      &:nth-child(2) {
        color: #53b3e5;
      }
    }
    .tabSelect {
      background: #f2f2f2;
      border: 2px solid #30a2de;
    }
  }
  .setInfo {
    position: relative;
    background: #f6fbff;
    padding: 10px 15px;
  }
  .title {
    color: #333333;
  }
  .text {
    color: #646464;
    .inputText {
      width: 100px;
    }
    .selectText {
      width: 100px;
    }
  }
  .iocn-zidongtijiao{
    background: url('../../../../../assets/images/app-management/u10887.svg') center center no-repeat;
    width: 30px;
    height: 30px;
   background-size: contain;
  }
}
</style>